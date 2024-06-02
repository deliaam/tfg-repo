package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Question;
import com.delia.Gamified.Assignment.App.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    @Query("SELECT q FROM Question q WHERE q.classObj.id = :classId ORDER BY q.dateTime DESC")
    List<Question> findAllOrderByDateDesc(@Param("classId") Integer classId);

    @Query("SELECT q FROM Question q WHERE q.classObj.id = :classId AND q.task.id = :taskId ORDER BY q.dateTime DESC")
    List<Question> findAllByTaskIdOrderByDateDesc(@Param("classId") Integer classId, @Param("taskId") Integer taskId);
}
