package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    @Query("SELECT t FROM Task t WHERE t.classObj.id = :classId ORDER BY t.dateTime DESC")
    List<Task> findAllOrderByDateDesc(@Param("classId") Integer classId);

    /* @Query("SELECT t, s.student, COUNT(s), COUNT(c) FROM Task t " +
            "LEFT JOIN t.solutions s " +
            "LEFT JOIN s.corrections c " +
            "GROUP BY t.id, s.student.id " +
            "ORDER BY t.dateTime DESC")
    List<Object[]> findAllTasksWithStudentInfo(); */
}
