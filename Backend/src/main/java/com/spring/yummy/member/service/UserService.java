package com.spring.yummy.member.service;

import com.spring.yummy.member.dto.request.AddressRequestDTO;
import com.spring.yummy.member.dto.request.UserCreateRequestDTO;
import com.spring.yummy.member.dto.response.AddressRes;
import com.spring.yummy.member.entity.Address;
import com.spring.yummy.member.entity.User;
import com.spring.yummy.member.repository.AddressRepository;
import com.spring.yummy.member.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AddressRepository addressRepository;

    @Transactional
    public void createUser(UserCreateRequestDTO requestDTO) {
        // 사용자 생성
        log.info("==== 회원가입 요청 받음 ====");
        log.info("RequestDTO: {}", requestDTO);
        log.info("Username: {}, Email: {}, Phone: {}",
            requestDTO.name(), requestDTO.email(), requestDTO.phone());

        User user = User.create(
            requestDTO.name(),
            bCryptPasswordEncoder.encode(requestDTO.password()),
            requestDTO.email(),
            requestDTO.phone()
        );

        // 주소가 null이 아닌 경우에만 주소 추가
        if (requestDTO.address() != null) {
            user.addAddress(createAddress(user, requestDTO.address()));
        }

        userRepository.save(user);
    }

    private Address createAddress(User user , AddressRequestDTO requestDTO) {



        log.info("==== 회원가입 요청 받음 ====");
        log.info("RequestDTO: {}", requestDTO);
        log.info("zipcode: {}, street: {}, etc: {}", requestDTO.zipCode(), requestDTO.street(),
            requestDTO.etc());

        return Address.CreateAddress(
            user,
            requestDTO.street(),
            requestDTO.etc(),
            requestDTO.zipCode(),
            true,
            requestDTO.description() != null ? requestDTO.description() : ""
        );
    }

    @Transactional
    public AddressRes addUserAddress(Long userId, AddressRequestDTO dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다: " + userId));

        if (dto.isDefault()) {
            updateDefaultAddressStatus(user);
        }

        Address newAddress = Address.CreateAddress(
            user, dto.street(), dto.etc(), dto.zipCode(),
            dto.isDefault(), dto.description()
        );

        user.addAddress(newAddress);

        return AddressRes.from(newAddress);
    }

    private void updateDefaultAddressStatus(User user) {
        user.getAddress().stream()
            .filter(Address::isDefault)
            .forEach(addr -> addr.updateDefaultAddress(user.getUsername(), false));
    }
}
