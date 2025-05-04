package com.spring.yummy.auth.service;

import com.spring.yummy.auth.dto.TokenDto;
import com.spring.yummy.auth.entity.BlacklistedToken;
import com.spring.yummy.auth.entity.RefreshToken;
import com.spring.yummy.auth.exception.TokenException;
import com.spring.yummy.auth.jwt.TokenProvider;
import com.spring.yummy.auth.repository.BlacklistedTokenRepository;
import com.spring.yummy.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class TokenService {

    private static final Logger log = LoggerFactory.getLogger(TokenService.class);
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    /**
     * 리프레시 토큰을 사용하여 새 토큰 발급
     */
    @Transactional
    public TokenDto refreshToken(String refreshToken) {
        // 토큰 유효성 검증
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new TokenException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 리프레시 토큰에서 사용자 이름 추출
        String username = tokenProvider.getUsernameFromRefreshToken(refreshToken);
        log.info("username :{} , refreshToken:{}", username, refreshToken);

        // Redis에 저장된 리프레시 토큰 확인
        RefreshToken savedToken = refreshTokenRepository.findById(username)
            .orElseThrow(() -> new TokenException("저장된 리프레시 토큰이 없습니다."));

        // 전달된 리프레시 토큰과 저장된 토큰 비교
        if (!savedToken.getToken().equals(refreshToken)) {
            throw new TokenException("리프레시 토큰이 일치하지 않습니다.");
        }

        // 리프레시 토큰용 인증 객체를 얻음
        Authentication authentication = tokenProvider.getAuthenticationFromRefreshToken(refreshToken);

        // 새 액세스 토큰 생성
        String newAccessToken = tokenProvider.createAccessToken(authentication);

        // 기존 리프레시 토큰 유지
        return new TokenDto(newAccessToken, refreshToken);
    }

    public void logout(String accessToken, String username) {
        // Access Token 블랙리스트에 추가
        long expiration = tokenProvider.getExpirationTime(accessToken);
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
}