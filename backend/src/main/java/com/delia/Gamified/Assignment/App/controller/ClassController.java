package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.model.Teacher;
import com.delia.Gamified.Assignment.App.payload.request.classes.AddRequest;
import com.delia.Gamified.Assignment.App.payload.request.classes.DeleteRequest;
import com.delia.Gamified.Assignment.App.payload.request.classes.JoinRequest;
import com.delia.Gamified.Assignment.App.payload.request.classes.UnjoinRequest;
import com.delia.Gamified.Assignment.App.repository.StudentRepository;
import com.delia.Gamified.Assignment.App.repository.TeacherRepository;
import com.delia.Gamified.Assignment.App.service.implementations.ClassServiceImpl;
import com.delia.Gamified.Assignment.App.service.interfaces.ClassService;
import com.delia.Gamified.Assignment.App.service.interfaces.StudentService;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/class")
public class ClassController {
    @Autowired
    private ClassService classService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private StudentRepository studentRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(ClassServiceImpl.class);


    //Cambiar ResponseEntity<Class> por String
    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<Class> add(@RequestBody AddRequest request){
        Class classObj = new Class(request.getClassName());
        Class finalClassObj = teacherRepository.findById(request.getTeacherId()).map(teacher -> {
            classObj.setTeacher(teacher);
            return classService.saveClass(classObj);
        }).orElseThrow(() -> new ResourceNotFoundException("Not found Teacher with id = " + request.getTeacherId()));

        return new ResponseEntity<>(finalClassObj, HttpStatus.CREATED);
    }

    @GetMapping("/getClass")
    public ResponseEntity<Class> getClass(@RequestParam Integer classId){
        try {
            Class classObj = classService.findById(classId);
            return ResponseEntity.ok().body(classObj);
        } catch (ChangeSetPersister.NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @GetMapping("/getAllTeachers")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public Set<Class> getAllTeacherClasses(@RequestParam Long teacherId){
        Optional<Teacher> teacher = teacherRepository.findById(teacherId);
        if(teacher.isEmpty()){
            throw new  ResourceNotFoundException("Not found Teacher with id = " + teacherId);
        }
        return teacher.get().getClasses();
    }

    @GetMapping("/getAllStudents")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public Set<Class> getAllStudentClasses(@RequestParam Long studentId){
        Optional<Student> student = studentRepository.findById(studentId);
        if(student.isEmpty()){
            throw new  ResourceNotFoundException("Not found Teacher with id = " + studentId);
        }
        return student.get().getClasses();
    }

    @PostMapping("/delete")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public String delete(@RequestBody DeleteRequest request){
        LOGGER.error("delete: " + request.getClassId() );
        classService.delete(request.getClassId());
        return "Deleted";
    }

    @PutMapping("/edit")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<String> updateClass(@RequestBody Class classObj) {
        try {
            classService.updateClass(classObj);
            return ResponseEntity.ok().body("Updated correctly");
        } catch (ChangeSetPersister.NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    @PutMapping("/join")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<String> joinClass(@RequestBody JoinRequest request) {
        try {
            Class classObj = classService.findByCode(request.getClassCode());
            LOGGER.info("" + classObj.getId());
            Student student = studentService.findById(request.getUserId());
            student.addClass(classObj);
            studentService.saveStudent(student);

            return ResponseEntity.ok().body("Updated correctly");
        } catch (ChangeSetPersister.NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/unjoin")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity<String> unjoinClass(@RequestBody UnjoinRequest request) {
        try {
            Student student = studentService.findById(request.getUserId());
            student.removeClass(request.getClassId());
            studentService.saveStudent(student);

            return ResponseEntity.ok().body("Updated correctly");
        } catch (ChangeSetPersister.NotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}