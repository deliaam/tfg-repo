package com.delia.Gamified.Assignment.App.payload.request.solutions;

import com.delia.Gamified.Assignment.App.model.Solution;

import java.util.ArrayList;
import java.util.List;

public class SolutionResponse {

    private Solution solution;
    private Integer numberOfCorrections;

    private String userName;

    private List<List<String>> files =new ArrayList<>();

    private boolean corrected;
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

    public List<List<String>>  getFiles() {
        return files;
    }

    public void setFiles(List<List<String>>  files) {
        this.files = files;
    }

    public boolean isCorrected() {
        return corrected;
    }

    public void setCorrected(boolean corrected) {
        this.corrected = corrected;
    }
}
