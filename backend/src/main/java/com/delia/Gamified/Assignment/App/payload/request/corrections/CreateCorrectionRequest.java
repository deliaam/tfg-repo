package com.delia.Gamified.Assignment.App.payload.request.corrections;

import com.delia.Gamified.Assignment.App.model.EQualification;

import javax.validation.constraints.NotBlank;

public class CreateCorrectionRequest {

    @NotBlank
    private Long userId;

    @NotBlank
    private Integer solutionId;
    @NotBlank
    private String description;

    @NotBlank
    private EQualification qualification;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public EQualification getQualification() {
        return qualification;
    }

    public void setQualification(EQualification qualification) {
        this.qualification = qualification;
    }

    public Integer getSolutionId() {
        return solutionId;
    }

    public void setSolutionId(Integer taskId) {
        this.solutionId = taskId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
