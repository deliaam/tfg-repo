package com.delia.Gamified.Assignment.App.payload.request.revisionRequests;

import javax.validation.constraints.NotBlank;

public class RevisionRequest {

    @NotBlank
    private Integer correctionId;

    @NotBlank
    private Long userId;

    public Integer getCorrectionId() {
        return correctionId;
    }

    public void setCorrectionId(Integer correctionId) {
        this.correctionId = correctionId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
