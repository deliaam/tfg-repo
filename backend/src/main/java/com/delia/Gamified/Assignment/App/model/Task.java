package com.delia.Gamified.Assignment.App.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.Type;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="task")
@JsonIgnoreProperties(value = {"lesson, classObj, files"})
public class Task {

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

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Lesson lesson;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<FileDB> files = new HashSet<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<Solution> solutions = new HashSet<>();

    @JsonIgnore
    private boolean scoreCalculated;

    private String filesIds = "";

    public Task(){

    }
    public Task(String title, String description, LocalDateTime dateTime, Class classObj, Lesson lesson){
        this.title = title;
        this.description = description;
        this.dateTime = dateTime;
        this.classObj = classObj;
        this.lesson = lesson;
        this.scoreCalculated = false;
    }

    public Set<Solution> getSolutions() {
        return solutions;
    }

    public void setSolutions(Set<Solution> solutions) {
        this.solutions = solutions;
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

    public boolean isScoreCalculated() {
        return scoreCalculated;
    }

    public void setScoreCalculated(boolean scoreCalculated) {
        this.scoreCalculated = scoreCalculated;
    }

    public void setFilesIds(String filesIds) {
        this.filesIds = filesIds;
    }
}
