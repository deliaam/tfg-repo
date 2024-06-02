package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.*;
import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.payload.request.questions.CreateQuestionRequest;
import com.delia.Gamified.Assignment.App.payload.request.questions.QuestionResponse;
import com.delia.Gamified.Assignment.App.payload.request.tasks.CreateTaskRequest;
import com.delia.Gamified.Assignment.App.payload.request.tasks.TaskResponse;
import com.delia.Gamified.Assignment.App.service.interfaces.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/question")
public class QuestionController {
    @Autowired
    private TaskService taskService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private FileStorageService storageService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private QuestionService questionService;

    private static final Logger LOGGER = LoggerFactory.getLogger(QuestionController.class);

    @PostMapping( "/create")
    public ResponseEntity<ResponseMessage> createQuestion(@ModelAttribute CreateQuestionRequest request, @RequestParam(required = false, name = "files") MultipartFile[] files) {
        LOGGER.error("create question");
        String message;
        String uploadedFiles = "";
        Lesson lesson = null;
        Task task = null;
        Class classObj = null;
        Student student;
        try {
            if (request.getLessonId() != null){
                lesson = lessonService.findById(request.getLessonId());
                classObj = lesson.getClassObj();
            }
            if (request.getTaskId() != null) {
                task = taskService.findById(request.getTaskId());
                classObj = task.getClassObj();
            }

        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Lesson not found!"));

        }
        try {
            student = studentService.findById(request.getUserId());
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ResponseMessage("Student not found! : " +  request.getUserId()));

        }
        Question question = new Question(request.getTitle(), request.getDescription(), LocalDateTime.now(), classObj, lesson, task, student);
        LOGGER.error("save question");
        Question savedQuestion = questionService.saveQuestion(question);

        try {
            if(files!=null){
                for(MultipartFile file: files){
                    String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                    FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());
                    fileDB.setQuestion(savedQuestion);
                    FileDB filedb = storageService.saveFile(fileDB);
                    uploadedFiles += file.getOriginalFilename() + ", ";
                    question.addFile(filedb);
                }
            }
            message = "Task created succesfully: " + uploadedFiles;
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (IOException e) {
            message = "Could not upload the files: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/getQuestions")
    public List<QuestionResponse> getQuestions(@RequestParam Integer classId, @RequestParam(required = false) Integer taskId){
        Optional<Integer> optionalTaskId = Optional.ofNullable(taskId);
        List<Question> questions = questionService.getAllQuestions(classId, optionalTaskId);

        List<QuestionResponse> response = new ArrayList<>();
        for(Question question : questions){
            QuestionResponse questionResponse = new QuestionResponse();
            questionResponse.setQuestion(question);
            Task task = question.getTask();
            Lesson lesson = question.getLesson();
            if(task != null) questionResponse.setTask(task.getTitle());
            if(lesson != null) questionResponse.setLesson(lesson.getName());
            List<List<String>> files =new ArrayList<>();
            for(FileDB file: question.getFiles()){
                files.add(Arrays.asList(file.getId(),file.getName()));
            }
            questionResponse.setFiles(files);
            Student student = question.getStudent();
            questionResponse.setUserId(student.getId());
            questionResponse.setNumberOfResponses(question.getResponses().size());

            response.add(questionResponse);
        }

        return response;

    }
}
