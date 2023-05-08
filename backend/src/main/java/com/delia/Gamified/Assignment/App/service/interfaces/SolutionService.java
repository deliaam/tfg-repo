package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.model.Task;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface SolutionService {
    public Solution saveSolution(Solution solution);
    public List<Solution> findByTask(Integer solutionId);
    public Solution findById(Integer solutionId) throws ChangeSetPersister.NotFoundException;
}
