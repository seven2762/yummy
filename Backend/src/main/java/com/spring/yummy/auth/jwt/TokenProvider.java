package com.spring.yummy.auth.jwt;

import com.spring.yummy.auth.dto.TokenDto;
import com.spring.yummy.auth.repository.RefreshTokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class TokenProvider implements InitializingBean {

    private final Logger logger = LoggerFactory.getLogger(TokenProvider.class);
    private static final String AUTHORITIES_KEY = "auth";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-expired-time}")
    private long accessTokenValidityInSeconds;

    @Value("${jwt.refresh-token-expired-time}")
    private long refreshTokenValidityInSeconds;

    private Key key;

    // RefreshTokenRepository 주입
    private final RefreshTokenRepository refreshTokenRepository;


    private long getAccessTokenValidityInMilliseconds() {
        return accessTokenValidityInSeconds * 1000;
    }

    private long getRefreshTokenValidityInMilliseconds() {
        return refreshTokenValidityInSeconds * 1000;
    }



    @Override
    public void afterPropertiesSet() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Access Token 생성 (기존 메서드)
    public String createAccessToken(Authentication authentication) {
        String authorities = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.joining(","));

        long now = (new Date()).getTime();
        Date validity = new Date(now + getAccessTokenValidityInMilliseconds());

        return Jwts.builder()
            .setSubject(authentication.getName())
            .claim(AUTHORITIES_KEY, authorities)
            .signWith(key, SignatureAlgorithm.HS512)
            .setExpiration(validity)
            .compact();
    }

    // Refresh Token 생성 메서드
    public String createRefreshToken(Authentication authentication) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + getRefreshTokenValidityInMilliseconds());

        String refreshToken = Jwts.builder()
            .setSubject(authentication.getName())
            .signWith(key, SignatureAlgorithm.HS512)
            .setExpiration(validity)
            .compact();

        // Redis에 Refresh Token 저장
        refreshTokenRepository.save(
            authentication.getName(),
            refreshToken,
            Duration.ofMillis(getRefreshTokenValidityInMilliseconds())
        );

        return refreshToken;
    }

    // TokenDto를 반환하는 통합 메서드 (Access Token + Refresh Token)
    public TokenDto createTokenDto(Authentication authentication) {
        String accessToken = createAccessToken(authentication);
        String refreshToken = createRefreshToken(authentication);

        return new TokenDto(accessToken, refreshToken);
    }

    // 기존 getAuthentication 메서드
    public Authentication getAuthentication(String token) {
        // 블랙리스트 확인
        if (refreshTokenRepository.isBlacklisted(token)) {
            throw new RuntimeException("로그아웃된 토큰입니다.");
        }

        Claims claims = Jwts
            .parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

        Collection<? extends GrantedAuthority> authorities =
            Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        User principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    // Refresh Token에서 사용자 이름 추출
    public String getUsernameFromRefreshToken(String token) {
        Claims claims = Jwts
            .parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

        return claims.getSubject();
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        // 블랙리스트 확인
        if (refreshTokenRepository.isBlacklisted(token)) {
            logger.info("로그아웃된 토큰입니다.");
            return false;
        }

        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            logger.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            logger.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            logger.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            logger.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    // Redis에 저장된 Refresh Token과 비교하여 검증
    public boolean validateRefreshToken(String username, String refreshToken) {
        return refreshTokenRepository.findByUsername(username)
            .map(savedToken -> savedToken.equals(refreshToken) && validateToken(refreshToken))
            .orElse(false);
    }

    // Refresh Token으로 새 Access Token 발급
    public String refreshAccessToken(String refreshToken) {
        // Refresh Token 유효성 검사
        if (!validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.");
        }

        // Refresh Token에서 사용자 이름 추출
        String username = getUsernameFromRefreshToken(refreshToken);

        // Redis에 저장된 Refresh Token과 비교
        if (!validateRefreshToken(username, refreshToken)) {
            throw new RuntimeException("저장된 Refresh Token과 일치하지 않습니다.");
        }

        // 사용자 권한 정보 조회 (실제 구현에서는 DB에서 사용자 정보 조회 필요)
        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

        // 인증 객체 생성
        Authentication authentication =
            new UsernamePasswordAuthenticationToken(new User(username, "", authorities), "", authorities);

        // 새 Access Token 생성
        return createAccessToken(authentication);
    }

    // 로그아웃 처리
    public void logout(String accessToken, String username) {
        // Access Token 블랙리스트에 추가 (남은 유효시간동안)
        long expiration = getExpirationTime(accessToken);
        if (expiration > 0) {
            refreshTokenRepository.addToBlacklist(accessToken, Duration.ofMillis(expiration));
        }

        // Redis에서 Refresh Token 삭제
        refreshTokenRepository.deleteByUsername(username);
    }

    // 토큰의 남은 유효시간 계산 (밀리초)
    private long getExpirationTime(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

            Date expiration = claims.getExpiration();
            Date now = new Date();

            return Math.max(0, expiration.getTime() - now.getTime());
        } catch (Exception e) {
            return 0;
        }
    }
}