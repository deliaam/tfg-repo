package com.delia.Gamified.Assignment.App.payload.request;

import java.util.Set;

import javax.validation.constraints.*;

public class SignupRequest {
    @NotBlank
    private String username;

    @NotBlank
    @Size(min = 2, max = 50)
    private String name;

    @NotBlank
    @Size(min = 2, max = 50)
    private String lastName;

    private Set<String> role;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;

    private String teacherKey;

    public String getTeacherKey() {
        return teacherKey;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRole() {
        return this.role;
    }

    public void setRole(Set<String> role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}