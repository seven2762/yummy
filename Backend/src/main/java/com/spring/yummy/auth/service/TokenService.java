package com.spring.yummy.auth.service;

import com.spring.yummy.auth.dto.TokenDto;
import com.spring.yummy.auth.entity.RefreshToken;
import com.spring.yummy.auth.jwt.TokenProvider;
import com.spring.yummy.auth.repository.RefreshTokenRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class TokenService {

    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;

    public TokenService(TokenProvider tokenProvider, RefreshTokenRepository refreshTokenRepository) {
        this.tokenProvider = tokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
    }


    /**
     * 리프레시 토큰을 사용하여 새 토큰 발급
     */
    @Transactional
    public TokenDto refreshToken(String refreshToken) {
        // 토큰 유효성 검증
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("유효하지 않은 리프레시 토큰입니다.");
        }

        // 리프레시 토큰에서 사용자 이름 추출
        String username = tokenProvider.getUsernameFromRefreshToken(refreshToken);
        
        // Redis에 저장된 리프레시 토큰 확인
        RefreshToken savedToken = refreshTokenRepository.findByToken(username)
            .orElseThrow(() -> new NoSuchElementException("저장된 리프레시 토큰이 없습니다."));
        
        // 전달된 리프레시 토큰과 저장된 토큰 비교
        if (!savedToken.getToken().equals(refreshToken)) {
            throw new RuntimeException("리프레시 토큰이 일치하지 않습니다.");
        }

        // 새 액세스 토큰 생성
        Authentication authentication = tokenProvider.getAuthentication(refreshToken);
        String newAccessToken = tokenProvider.createAccessToken(authentication);
        
        // 기존 리프레시 토큰 유지 (리프레시 토큰은 갱신하지 않음)
        return new TokenDto(newAccessToken, refreshToken);
    }
}