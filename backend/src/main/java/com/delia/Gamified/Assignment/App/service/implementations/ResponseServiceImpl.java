package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.EQualification;
import com.delia.Gamified.Assignment.App.model.Response;
import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.repository.ResponseRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResponseServiceImpl implements ResponseService {
    @Autowired
    private ResponseRepository responseRepository;

    @Override
    public Response saveResponse(Response response){return  responseRepository.save(response);}

    @Override
    public List<Response> findByQuestion(Integer questionId){return responseRepository.findAllByQuestionId(questionId);}

    @Override
    public Response findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Response> optionalResponse = responseRepository.findById(id);
        if (optionalResponse.isPresent()) {
            return optionalResponse.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public void setCorrect(Response response){
        response.setCorrect(true);
        responseRepository.save(response);
    }

}
