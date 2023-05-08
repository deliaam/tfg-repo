package com.delia.Gamified.Assignment.App.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "student")
public class Student extends User {

    @ManyToMany(fetch = FetchType.LAZY,
            cascade = {
                    CascadeType.PERSIST,
                    CascadeType.MERGE
            })
    @JoinTable(name = "student_classes",
            joinColumns = { @JoinColumn(name = "student_id") },
            inverseJoinColumns = { @JoinColumn(name = "class_id") })
    private Set<Class> classes = new HashSet<>();

    @ElementCollection
    private Set<String> solutions = new HashSet<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<HandleResignation> handleResignations = new HashSet<>();
    private double score;

    public Student(){

    }
    public Student(String name, String lastName, String username, String password) {
        super(name,lastName, username, password);
        this.score = 0;
    }

    public Set<HandleResignation> getHandleResignations() {
        return handleResignations;
    }

    public void setHandleResignations(Set<HandleResignation> handleResignations) {
        this.handleResignations = handleResignations;
    }

    public Set<Class> getClasses() {
        return classes;
    }

    public void setClasses(Set<Class> classes) {
        this.classes = classes;
    }
    public void addClass(Class classObj) {
        this.classes.add(classObj);
    }
    public void removeClass(Integer classId) {
        Class classObj = this.classes.stream().filter(c -> c.getId() == classId).findFirst().orElse(null);
        if (classObj != null) {
            this.classes.remove(classObj);
        }
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
