package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.HandleResignation;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HandleResignationRepository extends JpaRepository<HandleResignation, Integer> {
}
