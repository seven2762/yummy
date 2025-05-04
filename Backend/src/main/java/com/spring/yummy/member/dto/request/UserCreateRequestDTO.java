package com.spring.yummy.member.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.spring.yummy.member.entity.Role;

public record UserCreateRequestDTO(
    String email,
    String name,
    String password,
    String phone,
    @JsonIgnore
    Role role,
    @JsonProperty(required = false)
    AddressRequestDTO address
)
{}