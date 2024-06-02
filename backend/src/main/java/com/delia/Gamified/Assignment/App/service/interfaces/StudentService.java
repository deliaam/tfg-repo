package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Student;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface StudentService {
    public Student saveStudent(Student student);
    public Student findById(Long id)  throws ChangeSetPersister.NotFoundException;
    public List<Student> getAllStudents();
    public List<Student> getAllStudentsOrderedByScore();
}
