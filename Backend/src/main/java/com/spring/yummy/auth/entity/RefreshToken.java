package com.spring.yummy.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;
import org.springframework.data.redis.core.index.Indexed;

import java.io.Serializable;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("refreshToken")
public class RefreshToken  {
    
    @Id
    private String id;        // username을 ID로 사용
    
    @Indexed                  // 토큰으로 조회하기 위한 인덱스
    private String token;     // 리프레시 토큰 값

    @TimeToLive               // Redis TTL 설정
    private Long expiration;  // 만료 시간(초)
    
    public static RefreshToken of(String username, String token, Long expirationSeconds) {
        return RefreshToken.builder()
                .id(username)
                .token(token)
                .expiration(expirationSeconds)
                .build();
    }
}