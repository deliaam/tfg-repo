package com.delia.Gamified.Assignment.App.payload.request.classes;

public class JoinRequest {
    private String classCode;
    private Long userId;

    public String getClassCode() {
        return classCode;
    }

    public void setClassCode(String classCode) {
        this.classCode = classCode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
