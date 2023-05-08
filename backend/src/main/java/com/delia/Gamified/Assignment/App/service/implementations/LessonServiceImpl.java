package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Lesson;
import com.delia.Gamified.Assignment.App.repository.LessonRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LessonServiceImpl implements LessonService {
    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Lesson saveLesson(Lesson lesson){return  lessonRepository.save(lesson);}
    @Override
    public Lesson findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Lesson> optionalClass = lessonRepository.findById(id);
        if (optionalClass.isPresent()) {
            return optionalClass.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
