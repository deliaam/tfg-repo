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
@Table(name="solution")
@JsonIgnoreProperties(value = {"taskObj, files"})
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(columnDefinition="LONGTEXT")
    private String description;

    @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateTime;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "task_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Student student;

    @OneToMany(mappedBy = "solution", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Correction> corrections = new HashSet<>();

    @OneToMany(mappedBy = "solution", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<FileDB> files = new HashSet<>();

    private EQualification qualification;

    private String filesIds = "";

    public Solution(){

    }
    public Solution(Student student, Task task, String description, LocalDateTime dateTime){
        this.student = student;
        this.description = description;
        this.dateTime = dateTime;
        this.task = task;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
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

    public Set<FileDB> getFiles() {
        return files;
    }

    public void setFiles(Set<FileDB> files) {
        this.files = files;
    }

    public void addFile(FileDB file){
        this.filesIds += file.getId()+",";
        this.files.add(file);
        file.setSolution(this);
    }
    public Set<String> getFilesIds() {
        Set<String> ids = new HashSet<>();
        if (this.filesIds == null) return ids;
        for(String idString : this.filesIds.split(",")) {
            ids.add(idString);
        }

        return ids;
    }

    public Set<Correction> getCorrections() {
        return corrections;
    }

    public void setCorrections(Set<Correction> corrections) {
        this.corrections = corrections;
    }

    public EQualification getQualification() {
        return qualification;
    }

    public void setQualification(EQualification qualification) {
        this.qualification = qualification;
    }

    public void setFilesIds(String filesIds) {
        this.filesIds = filesIds;
    }
}
