package com.spring.yummy.auth.jwt;

import com.spring.yummy.auth.dto.TokenDto;
import com.spring.yummy.auth.entity.BlacklistedToken;
import com.spring.yummy.auth.entity.RefreshToken;
import com.spring.yummy.auth.repository.BlacklistedTokenRepository;
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
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

@Slf4j
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

    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

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

        // Redis에 RefreshToken 엔티티로 저장
        RefreshToken tokenEntity = RefreshToken.of(
            authentication.getName(),
            refreshToken,
            refreshTokenValidityInSeconds
        );
        refreshTokenRepository.save(tokenEntity);

        return refreshToken;
    }

    // TokenDto를 반환하는 통합 메서드 (Access Token + Refresh Token)
    public TokenDto createTokenDto(Authentication authentication) {
        String accessToken = createAccessToken(authentication);
        String refreshToken = createRefreshToken(authentication);

        return new TokenDto(accessToken, refreshToken);
    }

    public Authentication getAuthentication(String token) {
        // 블랙리스트 확인
        if (blacklistedTokenRepository.existsById(token)) {
            throw new RuntimeException("로그아웃된 토큰입니다.");
        }

        Claims claims = parseClaims(token);

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
        if (blacklistedTokenRepository.existsById(token)) {
            log.info("로그아웃된 토큰입니다.");
            return false;
        }

        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }


    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            // 만료된 토큰에서도 클레임을 추출
            return e.getClaims();
        }
    }

    // 로그아웃 처리
    public void logout(String accessToken, String username) {
        // Access Token 블랙리스트에 추가
        long expiration = getExpirationTime(accessToken);
        if (expiration > 0) {
            BlacklistedToken blacklistedToken = BlacklistedToken.of(
                accessToken,
                expiration / 1000  // 밀리초를 초로 변환
            );
            blacklistedTokenRepository.save(blacklistedToken);
        }

        // Redis에서 Refresh Token 삭제
        refreshTokenRepository.deleteById(username);
    }
    // 토큰의 남은 유효시간 계산 (밀리초)
    public long getExpirationTime(String token) {
        try {
            Claims claims = parseClaims(token);
            Date expiration = claims.getExpiration();
            Date now = new Date();
            return Math.max(0, expiration.getTime() - now.getTime());
        } catch (Exception e) {
            return 0;
        }
    }
}