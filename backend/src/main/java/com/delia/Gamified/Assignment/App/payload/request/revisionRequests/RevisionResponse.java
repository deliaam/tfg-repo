package com.delia.Gamified.Assignment.App.payload.request.revisionRequests;

import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.Revision;
import com.delia.Gamified.Assignment.App.payload.request.solutions.SolutionResponse;
import com.delia.Gamified.Assignment.App.payload.request.tasks.TaskResponse;

import java.util.ArrayList;
import java.util.List;

public class RevisionResponse {

    private Revision revision;

    private String userName;

    private String taskTitle;

    private Integer correctionId;

    private TaskResponse task;

    private SolutionResponse solution;

    public RevisionResponse(){

    }

    public Revision getRevision() {
        return revision;
    }

    public void setRevision(Revision revision) {
        this.revision = revision;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public Integer getCorrectionId() {
        return correctionId;
    }

    public void setCorrectionId(Integer correctionId) {
        this.correctionId = correctionId;
    }

    public TaskResponse getTask() {
        return task;
    }

    public void setTask(TaskResponse task) {
        this.task = task;
    }

    public SolutionResponse getSolution() {
        return solution;
    }

    public void setSolution(SolutionResponse solution) {
        this.solution = solution;
    }
}
