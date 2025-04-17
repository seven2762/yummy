package com.spring.yummy.member.controller;

import com.spring.yummy.global.dto.ApiResDto;
import com.spring.yummy.member.dto.request.UserCreateRequestDTO;
import com.spring.yummy.member.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user/")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;


    @PostMapping("/signUp")
    public ResponseEntity<ApiResDto> createUser(UserCreateRequestDTO requestDTO) {

        userService.CreateUser(requestDTO);

        return ResponseEntity.ok().body(new ApiResDto("회원 가입이 성공적으로 완료되었습니다", HttpStatus.OK.value()));

    }
}
