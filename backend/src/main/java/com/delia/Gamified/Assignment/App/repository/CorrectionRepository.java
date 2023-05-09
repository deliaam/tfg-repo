package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CorrectionRepository extends JpaRepository<Correction, Integer> {
    @Query("SELECT c FROM Correction c WHERE c.solution.id = :solutionId ORDER BY c.dateTime ASC")
    List<Correction> findAllBySolutionId(@Param("solutionId")Integer solutionId);

}
