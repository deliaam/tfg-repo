package com.delia.Gamified.Assignment.App.scheduler;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.service.implementations.ClassServiceImpl;
import com.delia.Gamified.Assignment.App.service.interfaces.StudentService;
import com.delia.Gamified.Assignment.App.service.interfaces.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ScoreScheduler {

    @Autowired
    private TaskService taskService;

    @Autowired
    private StudentService studentService;

    private static final Logger LOGGER = LoggerFactory.getLogger(ClassServiceImpl.class);

    @Scheduled(cron = "0 0 2 * * *")
    public void execute() throws InterruptedException {
        LOGGER.info("Started score scheduler");
        List<Task> taskList = taskService.getTasksByDateBefore(LocalDateTime.now());
        for (Task task: taskList){
            if(!task.isScoreCalculated()){
                for (Solution solution : task.getSolutions()){
                    addScoreToSolvingUser(solution.getQualification(), solution.getStudent());
                    addScoreToCorrectors(solution.getQualification(), solution.getCorrections());
                }
                task.setScoreCalculated(true);
                taskService.saveTask(task);
            }
        }

    }

    private void addScoreToSolvingUser(EQualification qualification, Student student){
        double score = student.getScore();
        LOGGER.info("Student" +student.getName() + " first score: " + score);
        if(qualification == null) return;
        switch (qualification){
            case GOOD -> score+=100;
            case FAIR -> score+=50;
            case POOR -> score-=25;
        }
        student.setScore(score);
        LOGGER.info("Student new score: " + score);
        studentService.saveStudent(student);
    }

    private void addScoreToCorrectors(EQualification qualification, List<Correction> corrections){
        if(qualification == null) return;
        for (Correction correction: corrections){
            User user = correction.getUser();
            if(user instanceof Student){
                Student student = (Student) user;
                double score = student.getScore();
                switch (qualification){
                    case GOOD -> {
                        switch (correction.getQualification()){
                            case GOOD -> score+=25;
                            case FAIR -> {}
                            case POOR -> score-=15;
                        }
                    }
                    case FAIR -> {
                        switch (correction.getQualification()){
                            case FAIR -> score+=25;
                            case GOOD -> {}
                            case POOR -> {}
                        }
                    }
                    case POOR -> {
                        switch (correction.getQualification()){
                            case POOR -> score+=25;
                            case FAIR -> {}
                            case GOOD -> score-=15;
                        }
                    }
                }
                student.setScore(score);
                studentService.saveStudent(student);
            }
        }
    }
}
