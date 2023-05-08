package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolutionRepository extends JpaRepository<Solution, Integer> {
    @Query("SELECT s FROM Solution s WHERE s.task.id = :taskId ORDER BY s.dateTime ASC")
    List<Solution> findAllByTaskId(@Param("taskId")Integer taskId);

}
