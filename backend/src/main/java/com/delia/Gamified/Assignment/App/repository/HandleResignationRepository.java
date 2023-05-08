package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.HandleResignation;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandleResignationRepository extends JpaRepository<HandleResignation, Integer> {
}
