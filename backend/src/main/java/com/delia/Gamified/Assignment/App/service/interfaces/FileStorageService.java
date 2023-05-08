package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.FileDB;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.stream.Stream;

public interface FileStorageService {
    public FileDB getFile(String id);
    public Stream<FileDB> getAllFiles();
    public FileDB store(MultipartFile file) throws IOException;
    public FileDB saveFile(FileDB file) throws IOException;
}
