package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.model.Task;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    public Task saveTask(Task task);
    public List<Task> getAllTasks(Integer classId);
    public boolean isTaskActive(Task task) ;
    public Task findById(Integer taskId) throws ChangeSetPersister.NotFoundException;
    public Optional<Solution> hasUserAnswered(Long userId, Task task);
    public boolean hasUserResigned(Task task, Student student);

}
