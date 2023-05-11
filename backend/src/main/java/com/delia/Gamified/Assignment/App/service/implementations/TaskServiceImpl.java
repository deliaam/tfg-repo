package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.repository.TaskRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Override
    public Task saveTask(Task task){return  taskRepository.save(task);}

    @Override
    public List<Task> getAllTasks(Integer classId){return taskRepository.findAllOrderByDateDesc(classId);}

    @Override
    public List<Task> getTasksByDateBefore(LocalDateTime dateTime){return taskRepository.getTasksByDateBefore(dateTime);}

    @Override
    public Task findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isPresent()) {
            return optionalTask.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
    public boolean isTaskActive(Task task) {
        return task.getDateTime().isAfter(LocalDateTime.now());
    }

    @Override
    public Optional<Solution> hasUserAnswered(Long userId, Task task){
        for(Solution solution : task.getSolutions()){
            if(solution.getStudent().getId()==userId) return Optional.of(solution);
        }
        return Optional.empty();
    }
    public boolean hasUserResigned(Task task, Student student){
        for(HandleResignation handleResignation : student.getHandleResignations()){
            if(handleResignation.getTask().equals(task)) return true;
        }
        return false;
    }

    public int userCorrectionsInTask(Long userId, Task task){
        int count=0;
        for(Solution solution : task.getSolutions()){
            for (Correction correction : solution.getCorrections()){
                if(correction.getUser().getId() == userId) count++;
            }
        }
        return count;
    }
}
