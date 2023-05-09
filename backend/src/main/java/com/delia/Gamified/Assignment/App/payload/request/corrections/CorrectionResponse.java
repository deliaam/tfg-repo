package com.delia.Gamified.Assignment.App.payload.request.corrections;

import com.delia.Gamified.Assignment.App.model.Solution;

import java.util.ArrayList;
import java.util.List;

public class CorrectionResponse {

    private Solution solution;
    private Integer numberOfCorrections;

    private String calification;

    private String userName;

    private Long userId;

    private List<List<String>> files =new ArrayList<>();

    public CorrectionResponse(){

    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<List<String>>  getFiles() {
        return files;
    }

    public void setFiles(List<List<String>>  files) {
        this.files = files;
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
