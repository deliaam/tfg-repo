package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findById(Long id);
}
