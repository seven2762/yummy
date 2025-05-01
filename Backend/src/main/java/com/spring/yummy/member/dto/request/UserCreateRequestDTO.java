package com.spring.yummy.member.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spring.yummy.member.entity.Role;

public record UserCreateRequestDTO(
    String email,
    String name,
    String password,
    String phone,
    @JsonIgnore
    Role role,
    AddressRequestDTO address
)
{}