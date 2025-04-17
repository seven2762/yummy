package com.spring.yummy.member.entity;


import lombok.Getter;

@Getter
public enum Role {


    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    Role(String roleUser) {

    }
}
