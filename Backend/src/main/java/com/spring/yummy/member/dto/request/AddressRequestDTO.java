package com.spring.yummy.member.dto.request;


import com.fasterxml.jackson.annotation.JsonProperty;

public record AddressRequestDTO(
    String street, 
    String etc, 
    String zipCode,
    @JsonProperty(required = false) String description,
    @JsonProperty(required = false) Boolean isDefault
) {

}