package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Integer> {
    Optional<Teacher> findById(Long id);

}
