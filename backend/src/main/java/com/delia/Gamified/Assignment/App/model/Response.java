package com.delia.Gamified.Assignment.App.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="response")
@JsonIgnoreProperties(value = {"taskObj, files"})
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(columnDefinition="LONGTEXT")
    private String description;

    private Boolean isCorrect;

    @DateTimeFormat(iso=DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime dateTime;
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Question question;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Student student;


    @OneToMany(mappedBy = "response", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<FileDB> files = new HashSet<>();

    private String filesIds = "";

    public Response(){

    }
    public Response(Student student, Question question, String description, LocalDateTime dateTime){
        this.student = student;
        this.description = description;
        this.dateTime = dateTime;
        this.question = question;
        this.isCorrect = false;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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
        file.setResponse(this);
    }
    public Set<String> getFilesIds() {
        Set<String> ids = new HashSet<>();
        if (this.filesIds == null) return ids;
        for(String idString : this.filesIds.split(",")) {
            ids.add(idString);
        }

        return ids;
    }

    public Boolean getCorrect() {
        return isCorrect;
    }

    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }
}
