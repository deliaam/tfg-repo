package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Integer> {
    @Query("SELECT r FROM Response r WHERE r.question.id = :questionId ORDER BY r.dateTime ASC")
    List<Response> findAllByQuestionId(@Param("questionId")Integer questionId);

}
