package com.delia.Gamified.Assignment.App.payload.request.responses;

import com.delia.Gamified.Assignment.App.model.Response;

import java.util.ArrayList;
import java.util.List;

public class ResponseResponse {

    private Response response;
    private Boolean isCorrect;

    private String userName;

    private List<List<String>> files =new ArrayList<>();

    private Long userId;
    public ResponseResponse(){

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

    public List<List<String>>  getFiles() {
        return files;
    }

    public void setFiles(List<List<String>>  files) {
        this.files = files;
    }

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public Boolean getCorrect() {
        return isCorrect;
    }

    public void setCorrect(Boolean correct) {
        isCorrect = correct;
    }
}
