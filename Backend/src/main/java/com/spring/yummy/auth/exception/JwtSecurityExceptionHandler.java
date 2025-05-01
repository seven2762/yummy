package com.spring.yummy.auth.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtSecurityExceptionHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
        AuthenticationException authException) throws IOException {
        log.warn("인증 실패: {}", authException.getMessage());
        handleSecurityException(response, HttpServletResponse.SC_UNAUTHORIZED, "인증에 실패했습니다.", "Unauthorized");
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
        AccessDeniedException accessDeniedException) throws IOException {
        log.warn("권한 부족: {}", accessDeniedException.getMessage());
        handleSecurityException(response, HttpServletResponse.SC_FORBIDDEN, "접근 권한이 없습니다.", "Forbidden");
    }

    private void handleSecurityException(HttpServletResponse response, int status, String message, String error)
        throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("status", status);
        errorDetails.put("error", error);
        errorDetails.put("message", message);

        // 요청 실패 시간 추가
        errorDetails.put("timestamp", System.currentTimeMillis());

        // ObjectMapper를 사용하여 JSON으로 변환
        String jsonResponse = objectMapper.writeValueAsString(errorDetails);
        response.getWriter().write(jsonResponse);
    }
}