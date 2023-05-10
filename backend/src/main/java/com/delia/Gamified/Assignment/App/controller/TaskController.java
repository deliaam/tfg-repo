package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
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
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private StudentService studentService;

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

    @PostMapping( "/create")
    public ResponseEntity<ResponseMessage> createTask( @ModelAttribute CreateTaskRequest request, @RequestParam(required = false, name = "files") MultipartFile[] files) {
        String message;
        String uploadedFiles = "";
        Lesson lesson;
        LOGGER.error("request: " + request.getTitle());
        try {
            lesson = lessonService.findById(request.getLessonId());
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Lesson not found!"));

        }
        Task task = new Task(request.getTitle(),request.getDescription(),request.getDateTime(),lesson.getClassObj(),lesson);
        Task savedTask = taskService.saveTask(task);

        try {
            if(files!=null){
                for(MultipartFile file: files){
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
                    fileDB.setTask(savedTask);
                    FileDB filedb = storageService.saveFile(fileDB);
                    uploadedFiles += file.getOriginalFilename() + ", ";
                    task.addFile(filedb);


                }
            }
            message = "Task created succesfully: " + uploadedFiles;
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (IOException e) {
            message = "Could not upload the files: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/getTasks")
    public List<TaskResponse> getTasks(@RequestParam Integer classId, @RequestParam Long userId){
        List<Task> tasks = taskService.getAllTasks(classId);

        List<TaskResponse> response = new ArrayList<>();
        for(Task task : tasks){
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

            response.add(taskResponse);
        }

        return response;

    }
}
