package com.delia.Gamified.Assignment.App.payload.request.handleResignations;

import javax.validation.constraints.NotBlank;

public class HandleResignationRequest {

    @NotBlank
    private Long userId;

    @NotBlank
    private Integer taskId;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getTaskId() {
        return taskId;
    }

    public void setTaskId(Integer taskId) {
        this.taskId = taskId;
    }

}
