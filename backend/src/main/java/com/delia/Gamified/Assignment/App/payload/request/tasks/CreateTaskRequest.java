package com.delia.Gamified.Assignment.App.payload.request.tasks;

import com.delia.Gamified.Assignment.App.model.Lesson;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class CreateTaskRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateTime;

    @NotBlank
    private Integer lessonId;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public Integer getLessonId() {
        return lessonId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public void setLessonId(Integer lessonId) {
        this.lessonId = lessonId;
    }
}
