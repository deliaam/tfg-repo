package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.handleResignations.HandleResignationRequest;
import com.delia.Gamified.Assignment.App.service.interfaces.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/handleResignation")
public class HandleResignationController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private HandleResignationService handleResignationService;

    @Autowired
    private StudentService studentService;


    @PostMapping( "/create")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity createHandleResignation(@RequestBody HandleResignationRequest request) {
        Task task;
        Student student;
        try {
            task = taskService.findById(request.getTaskId());
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Task not found! : " + request.getTaskId()));

        }
        try {
            student = studentService.findById(request.getUserId());
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Student not found! : " + request.getUserId()));
        }
        HandleResignation handleResignation = new HandleResignation(student,task);
        handleResignationService.saveHandleResignation(handleResignation);
        return ResponseEntity.status(HttpStatus.OK).body("Resigned correctly!");
    }

}
