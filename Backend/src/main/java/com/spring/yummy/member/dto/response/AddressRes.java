package com.spring.yummy.member.dto.response;


import com.spring.yummy.member.entity.Address;
import lombok.Builder;

@Builder
public record AddressRes(Long id, String street, String etc, String zipcode , String description, boolean isDefault) {


    public static AddressRes from(Address address) {
        return AddressRes.builder()
            .id(address.getId())
            .street(address.getStreet())
            .etc(address.getEtc())
            .zipcode(address.getZipcode())
            .description(address.getDescription())
            .isDefault(address.isDefault())
            .build();
    }
}
