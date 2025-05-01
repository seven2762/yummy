package com.spring.yummy.auth.service;

import com.spring.yummy.member.entity.User;
import com.spring.yummy.member.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Spring Security에서 사용자 정보를 로드하는 서비스
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;



    /**
     * 사용자 이름(이메일)으로 사용자 정보를 로드
     * @param username 사용자 이름(이메일)
     * @return UserDetails 객체
     * @throws UsernameNotFoundException 사용자를 찾을 수 없는 경우
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException(username + " -> 데이터베이스에서 찾을 수 없습니다."));
    }

    /**
     * Member 엔티티를 Spring Security의 UserDetails 객체로 변환
     * @param user 회원 엔티티
     * @return UserDetails 객체
     */
    private UserDetails createUserDetails(User user) {
        // 사용자 권한 목록 생성
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole().getValue());
        List<GrantedAuthority> authorities = List.of(authority);

        return new org.springframework.security.core.userdetails.User(
            user.getEmail(),           // 사용자 이름(이메일)
            user.getPassword(),        // 암호화된 비밀번호
            authorities                // 권한 목록
        );
    }
}