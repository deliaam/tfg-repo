package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.EQualification;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;

public interface SolutionService {
    public Solution saveSolution(Solution solution);

    public List<Solution> findByTask(Integer solutionId);

    public Solution findById(Integer solutionId) throws ChangeSetPersister.NotFoundException;

    public void updateNewQualification(Solution solution, EQualification newQualification);

    public Optional<Correction> hasUserCorrected(Long userId, Solution solution);
}