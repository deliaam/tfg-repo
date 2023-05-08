package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.model.Teacher;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface TeacherService {
    public Teacher saveTeacher(Teacher student);
    public List<Teacher> getAllTeachers();
    public Teacher findById(Long id)  throws ChangeSetPersister.NotFoundException;

}
