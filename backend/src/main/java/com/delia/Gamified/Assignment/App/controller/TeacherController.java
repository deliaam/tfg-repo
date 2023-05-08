package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.Teacher;
import com.delia.Gamified.Assignment.App.service.interfaces.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
@CrossOrigin
public class TeacherController {
    @Autowired
    private TeacherService teacherService;

    @PostMapping("/add")
    public String add(@RequestBody Teacher teacher){
        teacherService.saveTeacher(teacher);
        return "New student is added";
    }

    @GetMapping("/getAll")
    public List<Teacher> getAllTeachers(){
        return teacherService.getAllTeachers();
    }

    @GetMapping("/get")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<Teacher> getTeacher(@RequestParam Long userId){
        try {
            Teacher teacher = teacherService.findById(userId);
            return ResponseEntity.ok().body(teacher);
        } catch (ChangeSetPersister.NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}