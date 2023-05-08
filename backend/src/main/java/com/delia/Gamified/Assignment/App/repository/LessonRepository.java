package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {
}
