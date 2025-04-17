package com.spring.yummy.member.dto.request;


import com.spring.yummy.member.entity.Role;

public record UserCreateRequestDTO(String email, String username, String password, String phone, Role role) {

}
