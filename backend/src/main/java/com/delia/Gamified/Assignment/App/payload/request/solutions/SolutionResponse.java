package com.delia.Gamified.Assignment.App.payload.request.solutions;

import com.delia.Gamified.Assignment.App.model.Solution;

public class SolutionResponse {

    private Solution solution;
    private Integer numberOfCorrections;

    private String calification;

    private String userName;

    private Long userId;
    public SolutionResponse(){

    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Solution getSolution() {
        return solution;
    }

    public void setSolution(Solution solution) {
        this.solution = solution;
    }

    public Integer getNumberOfCorrections() {
        return numberOfCorrections;
    }

    public void setNumberOfCorrections(Integer numberOfCorrections) {
        this.numberOfCorrections = numberOfCorrections;
    }

    public String getCalification() {
        return calification;
    }

    public void setCalification(String calification) {
        this.calification = calification;
    }
}