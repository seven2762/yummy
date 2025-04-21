package com.spring.yummy.member.service;

import com.spring.yummy.member.dto.request.UserCreateRequestDTO;
import com.spring.yummy.member.entity.User;
import com.spring.yummy.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public void CreateUser(UserCreateRequestDTO requestDTO) {
        userRepository.save(
            User.create(requestDTO.username(), bCryptPasswordEncoder.encode(requestDTO.password()), requestDTO.email(),
                requestDTO.phone()));
    }
}
