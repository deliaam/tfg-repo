package com.delia.Gamified.Assignment.App.controller;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Lesson;
import com.delia.Gamified.Assignment.App.payload.request.lessons.AddLessonRequest;
import com.delia.Gamified.Assignment.App.service.interfaces.ClassService;
import com.delia.Gamified.Assignment.App.service.interfaces.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@CrossOrigin
@RequestMapping("/lesson")
public class LessonController {
    @Autowired
    private LessonService lessonService;

    @Autowired
    private ClassService classService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity add(@RequestBody AddLessonRequest request){
        try {
            Lesson lesson = new Lesson(request.getLessonName());
            Class classObj = classService.findById(request.getClassId());
            lesson.setClassObj(classObj);
            Lesson savedLesson = lessonService.saveLesson(lesson);
            return ResponseEntity.ok().body(savedLesson);
        }catch (ChangeSetPersister.NotFoundException exception){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/getClassLessons")
    @PreAuthorize("hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT')")
    public ResponseEntity<Set<Lesson>> getClassLessons (@RequestParam Integer classId){
        try {
            Class classObj = classService.findById(classId);
            return  ResponseEntity.ok().body(classObj.getLessons());
        }catch (ChangeSetPersister.NotFoundException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
