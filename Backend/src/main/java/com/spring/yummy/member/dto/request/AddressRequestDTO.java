package com.spring.yummy.member.dto.request;


public record AddressRequestDTO(
    String street, 
    String etc, 
    String zipCode, 
    String description, 
    boolean isDefault
) {

}