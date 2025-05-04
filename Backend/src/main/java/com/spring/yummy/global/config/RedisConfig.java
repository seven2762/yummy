package com.spring.yummy.global.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableRedisRepositories
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;


    @Value("${spring.data.redis.password}")
    private String redisPassword;

    @Bean
    public RedissonClient redissonClient() {
        Config config = new Config();

        // 이미 URL 형식이므로 그대로 사용
        String address = redisHost;

        if (redisPassword != null && !redisPassword.isEmpty()) {
            config.useSingleServer()
                .setAddress(address)
                .setUsername("default")
                .setPassword(redisPassword)
                .setConnectionMinimumIdleSize(5)
                .setConnectionPoolSize(10);
        } else {
            config.useSingleServer()
                .setAddress(address)
                .setConnectionMinimumIdleSize(5)
                .setConnectionPoolSize(10);
        }

        System.out.println("Redisson 연결 시도: " + address +
            ", 사용자: default, 비밀번호:" + (redisPassword != null ? "설정됨" : "없음"));

        return Redisson.create(config);
    }
    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        return redisTemplate;
    }
}