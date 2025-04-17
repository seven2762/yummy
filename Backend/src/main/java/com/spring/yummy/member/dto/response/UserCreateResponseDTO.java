package com.spring.yummy.member.dto.response;

import com.spring.yummy.member.entity.Role;
import com.spring.yummy.member.entity.User;


public record UserCreateResponseDTO(String username, String email, String phone, Role role) {

    public static UserCreateResponseDTO from(User user) {
        return new UserCreateResponseDTO(user.getUsername(), user.getEmail(), user.getPhone(), user.getRole());
    }

}
