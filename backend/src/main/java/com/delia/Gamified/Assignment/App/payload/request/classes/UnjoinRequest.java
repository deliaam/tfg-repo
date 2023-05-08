package com.delia.Gamified.Assignment.App.payload.request.classes;

public class UnjoinRequest {
    private Integer classId;
    private Long userId;

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}