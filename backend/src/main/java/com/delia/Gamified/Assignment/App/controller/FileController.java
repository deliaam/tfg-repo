package com.delia.Gamified.Assignment.App.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.delia.Gamified.Assignment.App.model.FileDB;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseFile;
import com.delia.Gamified.Assignment.App.payload.fileupload.ResponseMessage;
import com.delia.Gamified.Assignment.App.service.implementations.FileStorageServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@Controller
@CrossOrigin
@RequestMapping("/file")
public class FileController {

    @Autowired
    private FileStorageServiceImpl storageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("files") MultipartFile[] files) {
        String message = "";
        String uploadedFiles = "";
        try {
            for(MultipartFile file: files){
                storageService.store(file);
                uploadedFiles += file.getOriginalFilename() + ", ";
            }


            message = "Uploaded the files successfully: " + uploadedFiles;
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
        } catch (Exception e) {
            message = "Could not upload the files: !";
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
        }
    }

    @GetMapping("/getFiles")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        List<ResponseFile> files = storageService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/file/files/")
                    .path(dbFile.getId())
                    .toUriString();

            return new ResponseFile(
                    dbFile.getName(),
                    fileDownloadUri,
                    dbFile.getType(),
                    dbFile.getData().length);
        }).collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/getFile")
    public ResponseEntity<byte[]> getFile(@RequestParam String id) {
        FileDB fileDB = storageService.getFile(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.builder("attachment").filename(fileDB.getName()).build());
        headers.set("Access-Control-Expose-Headers", "Content-Disposition");

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileDB.getData());
    }
}