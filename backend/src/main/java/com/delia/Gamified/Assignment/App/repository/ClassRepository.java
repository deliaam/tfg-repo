package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Integer> {
    Optional<Class> findByCode(String code);
}
