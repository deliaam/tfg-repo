package com.delia.Gamified.Assignment.App.payload.request.responses;

import javax.validation.constraints.NotBlank;

public class CreateResponseRequest {

    @NotBlank
    private Long userId;

    @NotBlank
    private Integer questionId;
    @NotBlank
    private String description;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
