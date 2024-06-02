package com.delia.Gamified.Assignment.App.payload.request.questions;

import com.delia.Gamified.Assignment.App.model.Question;
import com.delia.Gamified.Assignment.App.model.Task;

import java.util.ArrayList;
import java.util.List;

public class QuestionResponse {

    private Question question;
    private String lesson;
    private String task;
    private Integer numberOfResponses;

    private Long userId;
    private List<List<String>> files =new ArrayList<>();

    public QuestionResponse(){

    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getTask() {
        return task;
    }

    public void setTask(String task) {
        this.task = task;
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


    public Integer getNumberOfResponses() {
        return numberOfResponses;
    }

    public void setNumberOfResponses(Integer numberOfResponses) {
        this.numberOfResponses = numberOfResponses;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
