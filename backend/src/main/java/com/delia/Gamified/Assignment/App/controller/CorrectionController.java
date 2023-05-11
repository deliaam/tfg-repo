package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.corrections.CorrectionResponse;
import com.delia.Gamified.Assignment.App.payload.request.corrections.CreateCorrectionRequest;
import com.delia.Gamified.Assignment.App.payload.request.corrections.DeleteCorrectionRequest;
import com.delia.Gamified.Assignment.App.payload.request.solutions.CreateSolutionRequest;
import com.delia.Gamified.Assignment.App.payload.request.solutions.SolutionResponse;
import com.delia.Gamified.Assignment.App.service.implementations.ClassServiceImpl;
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
    private static final Logger LOGGER = LoggerFactory.getLogger(CorrectionController.class);

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
        solutionService.updateNewQualification(solution,request.getQualification());
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

    @GetMapping("/getCorrections")
    public List<CorrectionResponse> getCorrections(@RequestParam Integer solutionId){
        List<Correction> corrections = correctionService.findBySolution(solutionId);
        for(Correction correction : corrections){
            LOGGER.info(correction.getQualification().toString());
        }
        List<CorrectionResponse> response = new ArrayList<>();
        for(Correction correction : corrections){
            User user = correction.getUser();
            CorrectionResponse correctionResponse = new CorrectionResponse();
            correctionResponse.setCorrection(correction);
            correctionResponse.setUserName(user.getName() +" "+ user.getLastName());
            correctionResponse.setUserId(user.getId());
            List<List<String>> files =new ArrayList<>();
            for(FileDB file: correction.getFiles()){
                files.add(Arrays.asList(file.getId(),file.getName()));
            }
            correctionResponse.setFiles(files);
            response.add(correctionResponse);
        }

        return response;

    }
    @PostMapping("/deleteCorrection")
    public ResponseEntity deleteCorrection(@RequestBody DeleteCorrectionRequest request){
        try {
            EQualification newQualification = correctionService.removeCorrection(request.getCorrectionId());
            return ResponseEntity.status(HttpStatus.OK).body(newQualification);

        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Correction not found! : " + request.getCorrectionId()));
        }
    }
}
