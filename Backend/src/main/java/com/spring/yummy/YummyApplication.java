package com.spring.yummy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class YummyApplication {

    public static void main(String[] args) {
        SpringApplication.run(YummyApplication.class, args);
    }
}
