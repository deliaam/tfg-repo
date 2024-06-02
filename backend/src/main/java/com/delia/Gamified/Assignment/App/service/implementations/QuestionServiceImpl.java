package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.repository.QuestionRepository;
import com.delia.Gamified.Assignment.App.repository.TaskRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.QuestionService;
import com.delia.Gamified.Assignment.App.service.interfaces.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QuestionServiceImpl implements QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public Question saveQuestion(Question question){return  questionRepository.save(question);}

    @Override
    public List<Question> getAllQuestions(Integer classId, Optional<Integer> taskId) {
        if (taskId.isPresent()) {
            return questionRepository.findAllByTaskIdOrderByDateDesc(classId, taskId.get());
        } else {
            return questionRepository.findAllOrderByDateDesc(classId);
        }
    }
    @Override
    public Question findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Question> optionalQuestion = questionRepository.findById(id);
        if (optionalQuestion.isPresent()) {
            return optionalQuestion.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
