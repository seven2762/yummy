package com.spring.yummy.auth.repository;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.time.Duration;
import java.util.Optional;

@Repository
public class RefreshTokenRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private final ValueOperations<String, String> valueOperations;

    // 키 접두사 정의
    private static final String REFRESH_TOKEN_PREFIX = "RT:";

    public RefreshTokenRepository(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
        this.valueOperations = redisTemplate.opsForValue();
    }

    // 리프레시 토큰 저장
    // username을 키로 사용하여 리프레시 토큰 저장
    public void save(String username, String refreshToken, Duration expiration) {
        String key = REFRESH_TOKEN_PREFIX + username;
        valueOperations.set(key, refreshToken, expiration);
    }

    // 리프레시 토큰 조회
    public Optional<String> findByUsername(String username) {
        String key = REFRESH_TOKEN_PREFIX + username;
        String value = valueOperations.get(key);
        return Optional.ofNullable(value);
    }

    // 리프레시 토큰 삭제 (로그아웃시 사용)
    public void deleteByUsername(String username) {
        String key = REFRESH_TOKEN_PREFIX + username;
        redisTemplate.delete(key);
    }

    // 액세스 토큰 블랙리스트 추가 (로그아웃시 사용)
    public void addToBlacklist(String accessToken, Duration expiration) {
        String key = "BL:" + accessToken;
        valueOperations.set(key, "blacklisted", expiration);
    }

    // 액세스 토큰이 블랙리스트에 있는지 확인
    public boolean isBlacklisted(String accessToken) {
        String key = "BL:" + accessToken;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}