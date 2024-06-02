package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.repository.StudentRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentServiceImpl implements StudentService {
    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public Student findById(Long id)  throws ChangeSetPersister.NotFoundException {
        Optional<Student> optionalClass = studentRepository.findById(id);
        if (optionalClass.isPresent()) {
            return optionalClass.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public List<Student> getAllStudentsOrderedByScore() {
        return studentRepository.findAllOrderedByScore();
    }
}
