package com.spring.yummy.member.controller;

import com.spring.yummy.global.dto.ApiResDto;
import com.spring.yummy.member.dto.request.AddressRequestDTO;
import com.spring.yummy.member.dto.request.UserCreateRequestDTO;
import com.spring.yummy.member.dto.response.AddressRes;
import com.spring.yummy.member.entity.Address;
import com.spring.yummy.member.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user/")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/signUp")
    public ResponseEntity<ApiResDto> createUser(@RequestBody UserCreateRequestDTO requestDTO) {

        userService.createUser(requestDTO);

        return ResponseEntity.ok().body(new ApiResDto("회원 가입이 성공적으로 완료되었습니다", HttpStatus.OK.value()));

    }

    @PostMapping("/{userId}/address")
    public ResponseEntity<ApiResDto> addUserAddress(
        @PathVariable("userId") Long userId,
        @RequestBody AddressRequestDTO requestDTO) {

        AddressRes newAddress = userService.addUserAddress(userId, requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResDto(
                "주소가 성공적으로 추가되었습니다",
                HttpStatus.CREATED.value(),
                newAddress
            ));
    }
    //ci 테스트
}
