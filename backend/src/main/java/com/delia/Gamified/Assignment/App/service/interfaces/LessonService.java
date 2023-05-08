package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Lesson;
import org.springframework.data.crossstore.ChangeSetPersister;

public interface LessonService {
    public Lesson saveLesson(Lesson lesson);
    public Lesson findById(Integer id)  throws ChangeSetPersister.NotFoundException;

}
