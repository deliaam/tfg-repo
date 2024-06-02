package com.delia.Gamified.Assignment.App.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="question")
@JsonIgnoreProperties(value = {"lesson, classObj, files"})
public class  Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;

    @Column(columnDefinition="LONGTEXT")
    private String description;
    @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateTime;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Class classObj;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Task task;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Student student;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<FileDB> files = new HashSet<>();
    /*
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Solution> solutions = new HashSet<>(); */

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Response> responses = new HashSet<>();

    private String filesIds = "";

    private Boolean isResponded;

    public Question(){

    }
    public Question(String title, String description, LocalDateTime dateTime, Class classObj, Lesson lesson, Task task, Student student){
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.classObj = classObj;
        this.lesson = lesson;
        this.task = task;
        this.student = student;
        this.isResponded = false;
    }

    public Boolean getIsResponded() {
        return this.isResponded;
    }

    public void setIsResponded(Boolean isResponded) {
        this.isResponded = isResponded;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Class getClassObj() {
        return classObj;
    }

    public void setClassObj(Class classObj) {
        this.classObj = classObj;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime  getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime  dateTime) {
        this.dateTime = dateTime;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Set<FileDB> getFiles() {
        return files;
    }

    public void setFiles(Set<FileDB> files) {
        this.files = files;
    }

    public void addFile(FileDB file){
        this.filesIds += file.getId()+",";
        this.files.add(file);
    }
    public Set<String> getFilesIds() {
        Set<String> ids = new HashSet<>();
        if (this.filesIds == null) return ids;
        for(String idString : this.filesIds.split(",")) {
            ids.add(idString);
        }

        return ids;
    }

    public void setFilesIds(String filesIds) {
        this.filesIds = filesIds;
    }

    public Set<Response> getResponses() {
        return responses;
    }

    public void setResponses(Set<Response> responses) {
        this.responses = responses;
    }
}
