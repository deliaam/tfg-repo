package com.delia.Gamified.Assignment.App.repository;

import java.util.Optional;

import com.delia.Gamified.Assignment.App.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);
}
