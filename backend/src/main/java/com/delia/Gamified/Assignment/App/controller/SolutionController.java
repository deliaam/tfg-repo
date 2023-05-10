package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.solutions.CreateSolutionRequest;
import com.delia.Gamified.Assignment.App.payload.request.solutions.SolutionResponse;
import com.delia.Gamified.Assignment.App.payload.request.tasks.CreateTaskRequest;
import com.delia.Gamified.Assignment.App.payload.request.tasks.TaskResponse;
import com.delia.Gamified.Assignment.App.service.implementations.ClassServiceImpl;
import com.delia.Gamified.Assignment.App.service.interfaces.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.apache.tomcat.util.json.JSONParser;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/solution")
public class SolutionController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private SolutionService solutionService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserDetailsService userDetails;

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

    @PostMapping( "/create")
    public ResponseEntity createSolution(@ModelAttribute CreateSolutionRequest request, @RequestParam(required = false, name = "files") MultipartFile[] files) {
        String message;
        String uploadedFiles = "";
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
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Student not found! : " +  request.getUserId()));

        }
        Solution solution = new Solution(student,task,request.getDescription(), LocalDateTime.now());
        Solution savedSolution = solutionService.saveSolution(solution);
        try {
            if(files!=null){
                for(MultipartFile file: files){
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
                    fileDB.setSolution(savedSolution);
                    FileDB filedb = storageService.saveFile(fileDB);
                    uploadedFiles += file.getOriginalFilename() + ", ";
                    savedSolution.addFile(filedb);
                }
            }
            message = "Solution created succesfully: " + uploadedFiles;
            return ResponseEntity.status(HttpStatus.OK).body(solution);
        } catch (IOException e) {
            message = "Could not upload the files: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/getSolutions")
    public List<SolutionResponse> getSolutions(@RequestParam Integer taskId, @RequestParam Long userId){
        List<Solution> solutions = solutionService.findByTask(taskId);

        List<SolutionResponse> response = new ArrayList<>();
        for(Solution solution : solutions){
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
            response.add(solutionResponse);
        }

        return response;

    }
}
