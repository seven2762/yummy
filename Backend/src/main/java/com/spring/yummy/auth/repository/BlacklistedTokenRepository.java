package com.spring.yummy.auth.repository;

import com.spring.yummy.auth.entity.BlacklistedToken;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlacklistedTokenRepository extends CrudRepository<BlacklistedToken, String> {
    
    boolean existsById(String token);
}