package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Question;
import com.delia.Gamified.Assignment.App.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findById(Long id);
    @Query("SELECT s FROM Student s ORDER BY s.score DESC")
    List<Student> findAllOrderedByScore();
}
