package com.delia.Gamified.Assignment.App.repository;

import java.util.Optional;

import com.delia.Gamified.Assignment.App.model.ERole;
import com.delia.Gamified.Assignment.App.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
