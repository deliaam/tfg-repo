package com.delia.Gamified.Assignment.App.payload.request.classes;

import javax.validation.constraints.NotBlank;

public class AddRequest {
    @NotBlank
    private String className;
    @NotBlank
    private Long teacherId;

    public String getClassName() {
        return className;
    }

    public Long getTeacherId() {
        return teacherId;
    }
}
