package com.spring.yummy.auth.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("blacklistedToken")
public class BlacklistedToken  {
    
    @Id
    private String id;
    
    @TimeToLive
    private Long expiration;
    
    // 정적 팩토리 메서드
    public static BlacklistedToken of(String token, Long expirationSeconds) {
        return BlacklistedToken.builder()
                .id(token)
                .expiration(expirationSeconds)
                .build();
    }
}