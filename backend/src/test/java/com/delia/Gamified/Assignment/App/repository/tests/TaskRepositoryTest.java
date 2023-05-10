package com.delia.Gamified.Assignment.App.repository.tests;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Lesson;
import com.delia.Gamified.Assignment.App.model.Task;
import com.delia.Gamified.Assignment.App.model.Teacher;
import com.delia.Gamified.Assignment.App.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.*;
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TestEntityManager entityManager;

    private Class classObj1;
    private Class classObj2;
    private Teacher teacher1;
    private Teacher teacher2;
    private Lesson lesson1;
    private Lesson lesson2;
    @BeforeEach
    void setUp() {
        teacher1 = createTeacher();
        teacher2 = createTeacher();
        classObj1 = createClass("Class 1", teacher1);
        classObj2 = createClass("Class 2", teacher2);
        lesson1 = createLesson("Lesson 1", classObj1);
        lesson2 = createLesson("Lesson 2", classObj2);
    }

    private Teacher createTeacher() {
        Teacher teacher = new Teacher();
        return entityManager.persist(teacher);
    }

    private Class createClass(String name, Teacher teacher) {
        Class classObj = new Class(name);
        classObj.setTeacher(teacher);
        return entityManager.persist(classObj);
    }

    private Lesson createLesson(String name, Class classObj) {
        Lesson lesson = new Lesson(name);
        lesson.setClassObj(classObj);
        return entityManager.persist(lesson);
    }

    @Test
    public void testFindAllOrderByDateDesc() {
        // Arrange
        Task task1 = new Task("Task 1", "Description", LocalDateTime.now().minusDays(2),classObj1,lesson1);
        Task task2 = new Task("Task 2", "Description", LocalDateTime.now().minusDays(1),classObj1,lesson1);
        Task task3 = new Task("Task 3", "Description", LocalDateTime.now().minusDays(3),classObj2,lesson2);

        entityManager.persist(task1);
        entityManager.persist(task2);
        entityManager.persist(task3);
        entityManager.flush();

        // Act
        List<Task> tasks = taskRepository.findAllOrderByDateDesc(classObj1.getId());

        // Assert
        assertThat(tasks).hasSize(2);
        assertEquals(tasks.get(0),task2);
        assertEquals(tasks.get(1),task1);
    }
}
