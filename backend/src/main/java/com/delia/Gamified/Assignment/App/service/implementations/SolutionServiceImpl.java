package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.model.Task;
import com.delia.Gamified.Assignment.App.repository.SolutionRepository;
import com.delia.Gamified.Assignment.App.repository.TaskRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.SolutionService;
import com.delia.Gamified.Assignment.App.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SolutionServiceImpl implements SolutionService {
    @Autowired
    private SolutionRepository solutionRepository;

    @Override
    public Solution saveSolution(Solution solution){return  solutionRepository.save(solution);}

    @Override
    public List<Solution> findByTask(Integer taskId){return solutionRepository.findAllByTaskId(taskId);}

    @Override
    public Solution findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Solution> optionalSolution = solutionRepository.findById(id);
        if (optionalSolution.isPresent()) {
            return optionalSolution.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}