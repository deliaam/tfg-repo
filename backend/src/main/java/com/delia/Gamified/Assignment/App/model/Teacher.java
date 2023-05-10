package com.delia.Gamified.Assignment.App.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import com.delia.Gamified.Assignment.App.service.interfaces.ClassService;
import org.springframework.beans.factory.annotation.Autowired;

@Entity
@Table(name = "teacher")
public class Teacher extends User{

    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Class> classes = new HashSet<>();

    @ElementCollection
    private Set<String> notifications = new HashSet<>();

    public Teacher(){

    }
    public Teacher(String name, String lastName, String username, String password) {
        super(name,lastName, username, password);
    }

    public Set<Class> getClasses() {
        return this.classes;
    }

    public void addClass(Class classObj) {
        this.classes.add(classObj);
    }

    public void setClasses(Set<Class> classes) {
        this.classes = classes;
    }

    public Set<String> getNotifications() {
        return notifications;
    }

    public void setNotifications(Set<String> notifications) {
        this.notifications = notifications;
    }
}
