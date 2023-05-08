package com.delia.Gamified.Assignment.App.payload.request.tasks;

import com.delia.Gamified.Assignment.App.model.Task;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class TaskResponse {

    private Task task;
    private String lesson;
    private Integer numberOfSolutions;
    private Integer numberOfCorrections;
    private boolean isActive;
    private boolean isAnswered;

    private boolean isResigned = false;
    private List<List<String>> files =new ArrayList<>();

    public TaskResponse(){

    }

    public boolean isResigned() {
        return isResigned;
    }

    public void setResigned(boolean resigned) {
        isResigned = resigned;
    }

    public List<List<String>>  getFiles() {
        return files;
    }

    public void setFiles(List<List<String>>  files) {
        this.files = files;
    }

    public String getLesson() {
        return lesson;
    }

    public void setLesson(String lesson) {
        this.lesson = lesson;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Integer getNumberOfSolutions() {
        return numberOfSolutions;
    }

    public void setNumberOfSolutions(Integer numberOfSolutions) {
        this.numberOfSolutions = numberOfSolutions;
    }

    public Integer getNumberOfCorrections() {
        return numberOfCorrections;
    }

    public void setNumberOfCorrections(Integer numberOfCorrections) {
        this.numberOfCorrections = numberOfCorrections;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isAnswered() {
        return isAnswered;
    }

    public void setAnswered(boolean answered) {
        isAnswered = answered;
    }
}
