package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.revisionRequests.ReviewCorrectionRequest;
import com.delia.Gamified.Assignment.App.payload.request.revisionRequests.RevisionRequest;
import com.delia.Gamified.Assignment.App.payload.request.revisionRequests.RevisionResponse;
import com.delia.Gamified.Assignment.App.payload.request.solutions.SolutionResponse;
import com.delia.Gamified.Assignment.App.payload.request.tasks.TaskResponse;
import com.delia.Gamified.Assignment.App.service.implementations.ClassServiceImpl;
import com.delia.Gamified.Assignment.App.service.interfaces.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/revision")
public class RevisionController {
    @Autowired
    private CorrectionService correctionService;

    @Autowired
    private RevisionService revisionService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TaskService taskService;

    @Autowired
    private SolutionService solutionService;

    private static final Logger LOGGER = LoggerFactory.getLogger(ClassServiceImpl.class);


    @PostMapping("/create")
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    public ResponseEntity createRevisionRequest(@RequestBody RevisionRequest request) {
        Correction correction;
        Student student;
        try {
            correction = correctionService.findById(request.getCorrectionId());
        } catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Correction not found! : " + request.getCorrectionId()));
        }
        try {
            student = studentService.findById(request.getUserId());
        } catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Student not found! : " + request.getUserId()));
        }
        Revision revisionRequest = new Revision(correction, LocalDateTime.now(), student);
        revisionService.saveRevision(revisionRequest);
        return ResponseEntity.status(HttpStatus.OK).body("Resigned correctly!");
    }

    @GetMapping("/getRevisions")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public List<RevisionResponse> getRevisions(@RequestParam Integer classId){
        List<Revision> revisions = revisionService.findByClass(classId);
        List<RevisionResponse> response = new ArrayList<>();
        for(Revision revision : revisions){
            User user = revision.getStudent();
            Correction correction = revision.getCorrection();
            Solution solution = correction.getSolution();
            Task task = solution.getTask();
            RevisionResponse revisionResponse = new RevisionResponse();
            revisionResponse.setRevision(revision);
            revisionResponse.setUserName(user.getName() +" "+ user.getLastName());
            revisionResponse.setTaskTitle(task.getTitle());
            revisionResponse.setCorrectionId(correction.getId());

            revisionResponse.setTask(getTaskObj(task, user.getId()));
            revisionResponse.setSolution(getSolutionObj(solution, user.getId()));
            response.add(revisionResponse);
        }

        return response;

    }

    @PostMapping("/reviewCorrection")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<?> setReviewed(@RequestBody ReviewCorrectionRequest request){
        try {
            revisionService.setReviewed(correctionService.findById(request.getCorrectionId()).getRevisionRequest().getId());
        } catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Revision not found! : " + request.getCorrectionId()));
        }
        return ResponseEntity.status(HttpStatus.OK).body("Reviewed correctly!");
    }

    private TaskResponse getTaskObj(Task task, Long userId) {
        TaskResponse taskResponse = new TaskResponse();
        taskResponse.setTask(task);
        taskResponse.setActive(taskService.isTaskActive(task));
        taskResponse.setNumberOfSolutions(task.getSolutions().size());
        taskResponse.setNumberOfCorrections(taskService.userCorrectionsInTask(userId, task));
        taskResponse.setAnswered(taskService.hasUserAnswered(userId,task).isPresent());
        taskResponse.setLesson(task.getLesson().getName());
        List<List<String>> files =new ArrayList<>();
        for(FileDB file: task.getFiles()){
            files.add(Arrays.asList(file.getId(),file.getName()));
        }
        taskResponse.setFiles(files);

        try {
            Student student = studentService.findById(userId);
            if(taskService.hasUserResigned(task, student)){
                taskResponse.setResigned(true);
            }

        }catch (ChangeSetPersister.NotFoundException exception){
        }
        return taskResponse;
    }
    private SolutionResponse getSolutionObj(Solution solution, Long userId){
        Student student = solution.getStudent();
        SolutionResponse solutionResponse = new SolutionResponse();
        solutionResponse.setSolution(solution);
        solutionResponse.setNumberOfCorrections(solution.getCorrections().size());
        solutionResponse.setUserName(student.getName() +" "+ student.getLastName());
        solutionResponse.setUserId(student.getId());
        List<List<String>> files =new ArrayList<>();
        for(FileDB file: solution.getFiles()){
            files.add(Arrays.asList(file.getId(),file.getName()));
        }
        solutionResponse.setCorrected(solutionService.hasUserCorrected(userId,solution).isPresent());

        solutionResponse.setFiles(files);

        return solutionResponse;
    }
}
