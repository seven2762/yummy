package com.spring.yummy.member.repository;

import com.spring.yummy.member.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String username);
    Optional<User> findByUsername(String username);
}
