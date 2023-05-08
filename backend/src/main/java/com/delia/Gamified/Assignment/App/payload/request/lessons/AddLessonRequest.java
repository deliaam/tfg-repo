package com.delia.Gamified.Assignment.App.payload.request.lessons;

import javax.validation.constraints.NotBlank;

public class AddLessonRequest {
    @NotBlank
    private String lessonName;
    @NotBlank
    private Integer classId;

    public String getLessonName() {
        return lessonName;
    }

    public Integer getClassId() {
        return classId;
    }
}
