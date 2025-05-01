package com.spring.yummy.auth.service;

import com.spring.yummy.auth.dto.LoginReq;
import com.spring.yummy.auth.dto.TokenDto;
import com.spring.yummy.auth.exception.AuthException;
import com.spring.yummy.auth.exception.TokenException;
import com.spring.yummy.auth.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    /**
     * 로그인 처리 및 토큰 발급
     */

    @Transactional
    public TokenDto login(LoginReq loginReq) {
        try {
            // 1. 인증 정보 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(loginReq.email(), loginReq.password());

            // 2. 스프링 시큐리티 인증 과정
            Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);

            // 3. SecurityContext에 인증 정보 저장
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 4. 토큰 생성 및 반환
            return tokenProvider.createTokenDto(authentication);

        } catch (Exception e) {
            log.error("로그인 실패: {}", e.getMessage());
            throw new AuthException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
    }

    /**
     * 로그아웃 처리
     */
    @Transactional
    public void logout(String accessToken) {
        if (accessToken != null && accessToken.startsWith("Bearer ")) {
            accessToken = accessToken.substring(7);
        }

        try {
            // 토큰 유효성 검증
            if (!tokenProvider.validateToken(accessToken)) {
                throw new TokenException("유효하지 않은 토큰입니다.");
            }

            // 인증 정보 가져오기
            Authentication authentication = tokenProvider.getAuthentication(accessToken);
            String username = authentication.getName();

            // 토큰 무효화 처리
            tokenProvider.logout(accessToken, username);

            // SecurityContext 정리
            SecurityContextHolder.clearContext();

            log.info("로그아웃 완료: {}", username);
        } catch (Exception e) {
            log.error("로그아웃 실패: {}", e.getMessage());
            throw new AuthException("로그아웃 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}