package com.spring.yummy.auth.exception;

public class AuthException extends RuntimeException {
    public AuthException(String message) {
        super(message);
    }
}