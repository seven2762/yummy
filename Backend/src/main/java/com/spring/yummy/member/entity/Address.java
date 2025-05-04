package com.spring.yummy.member.entity;

import com.spring.yummy.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Slf4j
public class Address extends BaseEntity {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String etc;

    @Column(nullable = false)
    private String zipcode;

    @Column(nullable = false)
    private boolean isDefault;

    @Column
    private String description;


    public static Address CreateAddress(User user, String street, String etc, String zipcode, boolean isDefault, String description) {
        Address address = Address.builder()
            .user(user)
            .street(street)
            .etc(etc)
            .zipcode(zipcode)
            .isDefault(isDefault)
            .description(description)
            .build();

        address.initAuditInfo(user.getUsername());
        return address;
    }

    public void updateDefaultAddress(String userName, boolean defaultAddress) {
        if (this.isDefault != defaultAddress) {
            this.updateAuditInfo(userName);

            if (defaultAddress) {
                log.info("주소 {}가 기본 주소로 설정되었습니다.", this.id);
            }
        }
        this.isDefault = defaultAddress;
    }


}
