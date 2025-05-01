package com.spring.yummy.auth.repository;

import com.spring.yummy.auth.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {

    Optional<RefreshToken> findById(String username);

    Optional<RefreshToken> findByToken(String token);

    void deleteById(String username);
}