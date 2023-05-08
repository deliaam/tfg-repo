package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.model.Teacher;
import com.delia.Gamified.Assignment.App.service.interfaces.StudentService;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/student")
@CrossOrigin
public class StudentController {
    @Autowired
    private StudentService studentService;

    @PostMapping("/add")
    public String add(@RequestBody Student student){
        studentService.saveStudent(student);
        return "New student is added";
    }

    @GetMapping("/getAll")
    public List<Student> getAllStudents(){
        return studentService.getAllStudents();
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<Student> getStudent(@RequestParam Long userId){
        try {
            Student student = studentService.findById(userId);
            return ResponseEntity.ok().body(student);
        } catch (ChangeSetPersister.NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
