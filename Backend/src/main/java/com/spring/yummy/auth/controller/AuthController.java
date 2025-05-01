package com.spring.yummy.auth.controller;

import com.spring.yummy.auth.dto.LoginReq;
import com.spring.yummy.auth.dto.TokenDto;
import com.spring.yummy.auth.service.AuthService;
import com.spring.yummy.auth.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;

    /**
     * 로그인 API
     */
    @PostMapping("/login")
    public ResponseEntity<TokenDto> login( @RequestBody LoginReq loginReq) {
        TokenDto tokenDto = authService.login(loginReq);
        return ResponseEntity.ok(tokenDto);
    }

    /**
     * 토큰 갱신 API
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refreshToken(@RequestHeader("Refresh-Token") String refreshToken) {
        TokenDto tokenDto = tokenService.refreshToken(refreshToken);
        return ResponseEntity.ok(tokenDto);
    }

    /**
     * 로그아웃 API
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String bearerToken) {
        authService.logout(bearerToken);
        return ResponseEntity.ok().build();
    }
}