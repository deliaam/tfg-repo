package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Question;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;
import java.util.Optional;

public interface QuestionService {
    public Question saveQuestion(Question question);
    public List<Question> getAllQuestions(Integer classId, Optional<Integer> taskId);
    public Question findById(Integer questionId) throws ChangeSetPersister.NotFoundException;
}
