package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Response;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface ResponseService {
    public Response saveResponse(Response response);


    public List<Response> findByQuestion(Integer questionId);

    public Response findById(Integer responseId) throws ChangeSetPersister.NotFoundException;

    public void setCorrect(Response response);

}