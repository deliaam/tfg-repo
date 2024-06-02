package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.corrections.DeleteCorrectionRequest;
import com.delia.Gamified.Assignment.App.payload.request.responses.CreateResponseRequest;
import com.delia.Gamified.Assignment.App.payload.request.responses.ResponseResponse;
import com.delia.Gamified.Assignment.App.payload.request.responses.SetCorrectRequest;
import com.delia.Gamified.Assignment.App.payload.request.solutions.CreateSolutionRequest;
import com.delia.Gamified.Assignment.App.payload.request.solutions.SolutionResponse;
import com.delia.Gamified.Assignment.App.service.interfaces.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/response")
public class ResponseController {
    @Autowired
    private QuestionService questionService;

    @Autowired
    private ResponseService responseService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private StudentService studentService;

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

    @PostMapping("/create")
    public ResponseEntity createResponse(@ModelAttribute CreateResponseRequest request, @RequestParam(required = false, name = "files") MultipartFile[] files) {
        String message;
        String uploadedFiles = "";
        Question question;
        Student student;
        try {
            question = questionService.findById(request.getQuestionId());
        } catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Question not found! : " + request.getQuestionId()));

        }
        try {
            student = studentService.findById(request.getUserId());
        } catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Student not found! : " + request.getUserId()));

        }
        Response response = new Response(student, question, request.getDescription(), LocalDateTime.now());
        Response savedResponse = responseService.saveResponse(response);
        try {
            if (files != null) {
                for (MultipartFile file : files) {
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
                    fileDB.setResponse(savedResponse);
                    FileDB filedb = storageService.saveFile(fileDB);
                    uploadedFiles += file.getOriginalFilename() + ", ";
                    savedResponse.addFile(filedb);
                }
            }
            message = "Solution created succesfully: " + uploadedFiles;
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (IOException e) {
            message = "Could not upload the files: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/getResponses")
    public List<ResponseResponse> getResponses(@RequestParam Integer questionId, @RequestParam Long userId) {
        List<Response> responses = responseService.findByQuestion(questionId);

        List<ResponseResponse> endpointResponse = new ArrayList<>();
        for (Response response : responses) {
            Student student = response.getStudent();
            ResponseResponse responseResponse = new ResponseResponse();
            responseResponse.setResponse(response);
            responseResponse.setUserName(student.getName() + " " + student.getLastName());
            responseResponse.setUserId(student.getId());
            List<List<String>> files = new ArrayList<>();
            for (FileDB file : response.getFiles()) {
                files.add(Arrays.asList(file.getId(), file.getName()));
            }
            responseResponse.setCorrect(response.getCorrect());

            responseResponse.setFiles(files);
            endpointResponse.add(responseResponse);
        }

        return endpointResponse;

    }

    @PostMapping("/setCorrect")
    public ResponseEntity setCorrect(@RequestBody SetCorrectRequest request) {
        Response response;
        try {
            response = responseService.findById(request.getResponseId());
        } catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Response not found! : " + request.getResponseId()));
        }
        responseService.setCorrect(response);
        Question question = response.getQuestion();
        question.setIsResponded(true);
        questionService.saveQuestion(question);
        Student student = response.getStudent();
        student.setScore(student.getScore()+50);
        studentService.saveStudent(student);
        return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Response marked as correct"));
    }
}
