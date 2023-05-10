package com.delia.Gamified.Assignment.App.service.tests;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.repository.TaskRepository;
import com.delia.Gamified.Assignment.App.service.implementations.TaskServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskServiceImpl taskService;

    @Test
    public void testSaveTask() {
        //Arrange
        Task task = new Task();
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        //Act
        Task savedTask = taskService.saveTask(task);

        //Assert
        verify(taskRepository).save(task);
        assertEquals(task, savedTask);
    }

    @Test
    public void testGetAllTasks() {
        // Arrange
        Integer classId = 1;
        List<Task> tasks = new ArrayList<>();
        Task task1 = new Task();
        tasks.add(task1);
        when(taskRepository.findAllOrderByDateDesc(classId)).thenReturn(tasks);

        //Act
        List<Task> returnedTasks = taskService.getAllTasks(classId);

        //Assert
        verify(taskRepository).findAllOrderByDateDesc(classId);
        assertEquals(tasks, returnedTasks);
    }

    @Test
    public void testFindById() {
        // Arrange
        Optional<Task> optionalTask = Optional.of(new Task());
        Task returnedTask = null;
        when(taskRepository.findById(anyInt())).thenReturn(optionalTask);

        //Act
        try {
            returnedTask = taskService.findById(anyInt());
        } catch (ChangeSetPersister.NotFoundException e) {
            fail("Should not have thrown an exception");
        }

        //Assert
        verify(taskRepository).findById(anyInt());
        assertEquals(optionalTask.get(), returnedTask);
    }

    @Test(expected = ChangeSetPersister.NotFoundException.class)
    public void testFindByIdNotFound() throws ChangeSetPersister.NotFoundException {
        // Arrange
        Optional<Task> optionalTask = Optional.empty();
        when(taskRepository.findById(anyInt())).thenReturn(optionalTask);

        // Act
        taskService.findById(anyInt());
    }

    @Test
    public void testIsTaskActive() {
        // Arrange
        Task task = new Task();
        LocalDateTime dateTime = LocalDateTime.now().plusMinutes(5);
        task.setDateTime(dateTime);

        // Act
        boolean isActive = taskService.isTaskActive(task);

        //Assert
        assertTrue(isActive);
    }
    @Test
    public void testIsTaskNotActive() {
        // Arrange
        Task task = new Task();
        LocalDateTime dateTime = LocalDateTime.now().minusMinutes(5);
        task.setDateTime(dateTime);

        // Act
        boolean isActive = taskService.isTaskActive(task);

        //Assert
        assertFalse(isActive);
    }

    @Test
    public void testUserHasAnswered() {
        // Arrange
        Task task = new Task();
        Student student = new Student();
        student.setId(1L);
        Solution solution = new Solution();
        solution.setStudent(student);

        Set<Solution> solutions = Collections.singleton(solution);
        task.setSolutions(solutions);

        // Act
        Optional<Solution> optionalSolution = taskService.hasUserAnswered(1L, task);

        // Assert
        assertTrue(optionalSolution.isPresent());
        assertEquals(solution, optionalSolution.get());
    }
    @Test
    public void testUserHasNotAnswered() {
        // Arrange
        Task task = new Task();
        Solution solution = new Solution();
        solution.setStudent(new Student());

        Set<Solution> solutions = Collections.singleton(solution);
        task.setSolutions(solutions);

        // Act
        Optional<Solution> optionalSolution = taskService.hasUserAnswered(1L, task);

        // Assert
        assertFalse(optionalSolution.isPresent());
    }



    @Test
    public void testHasUserResigned() {
        // Arrange
        Task task = new Task();
        Student student = new Student();
        student.setId(1L);
        HandleResignation handleResignation = new HandleResignation();
        handleResignation.setTask(task);
        student.setHandleResignations(Collections.singleton(handleResignation));

        // Act
        boolean hasResigned = taskService.hasUserResigned(task, student);

        //Assert
        assertTrue(hasResigned);
    }

    @Test
    public void testHasUserNotResigned() {
        // Arrange
        Task task = new Task();
        Student student = new Student();

        // Act
        boolean hasResigned = taskService.hasUserResigned(task, student);

        //Assert
        assertFalse(hasResigned);
    }

    @Test
    public void testUserCorrectionsInTask() {
        // Arrange
        Task task = new Task();
        Solution solution = new Solution();
        Correction correction1 = new Correction();
        User user = new User();
        user.setId(1L);
        correction1.setUser(user);
        solution.setCorrections(Collections.singleton(correction1));
        task.setSolutions(Collections.singleton(solution));

        // Act
        int count = taskService.userCorrectionsInTask(1L, task);

        //Assert
        assertEquals(1, count);
    }
}