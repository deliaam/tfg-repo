package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Teacher;
import com.delia.Gamified.Assignment.App.repository.TeacherRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherServiceImpl implements TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public Teacher saveTeacher(Teacher student) {
        return teacherRepository.save(student);
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public Teacher findById(Long id)  throws ChangeSetPersister.NotFoundException {
        Optional<Teacher> optionalClass = teacherRepository.findById(id);
        if (optionalClass.isPresent()) {
            return optionalClass.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
