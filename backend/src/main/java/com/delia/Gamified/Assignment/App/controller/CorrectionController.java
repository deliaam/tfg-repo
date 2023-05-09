package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.corrections.CreateCorrectionRequest;
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
@RequestMapping("/correction")
public class CorrectionController {
    @Autowired
    private CorrectionService correctionService;

    @Autowired
    private SolutionService solutionService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private UserService userService;

    @PostMapping( "/create")
    public ResponseEntity createCorrection(@ModelAttribute CreateCorrectionRequest request, @RequestParam(required = false, name = "files") MultipartFile[] files) {
        String message;
        String uploadedFiles = "";
        Solution solution;
        User user;
        try {
            solution = solutionService.findById(request.getSolutionId());
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Solution not found! : " + request.getSolutionId()));

        }
        try {
            user = userService.findById(request.getUserId());
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("User not found! : " +  request.getUserId()));

        }
        Correction correction = new Correction(user,solution,request.getDescription(), request.getQualification(), LocalDateTime.now());
        Correction savedCorrection = correctionService.saveCorrection(correction);
        solutionService.updateNewQualification(solution, request.getQualification());


        try {
            if(files!=null){
                for(MultipartFile file: files){
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
                    fileDB.setCorrection(correction);
                    FileDB filedb = storageService.saveFile(fileDB);
                    uploadedFiles += file.getOriginalFilename() + ", ";
                    savedCorrection.addFile(filedb);
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
    public List<SolutionResponse> getSolutions(@RequestParam Integer taskId){
        List<Solution> solutions = solutionService.findByTask(taskId);

        List<SolutionResponse> response = new ArrayList<>();
        for(Solution solution : solutions){
            Student student = solution.getStudent();
            SolutionResponse solutionResponse = new SolutionResponse();
            solutionResponse.setSolution(solution);
            solutionResponse.setNumberOfCorrections(0);
            solutionResponse.setUserName(student.getName() +" "+ student.getLastName());
            solutionResponse.setUserId(student.getId());
            List<List<String>> files =new ArrayList<>();
            for(FileDB file: solution.getFiles()){
                files.add(Arrays.asList(file.getId(),file.getName()));
            }
            solutionResponse.setFiles(files);
            response.add(solutionResponse);
        }

        return response;

    }
}