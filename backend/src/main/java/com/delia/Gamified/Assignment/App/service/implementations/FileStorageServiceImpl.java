package com.delia.Gamified.Assignment.App.service.implementations;

import java.io.IOException;
import java.util.stream.Stream;

import com.delia.Gamified.Assignment.App.model.FileDB;
import com.delia.Gamified.Assignment.App.repository.FileDBRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;


@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Autowired
    private FileDBRepository fileDBRepository;

    public FileDB store(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        FileDB fileDB = new FileDB(fileName, file.getContentType(), file.getBytes());

        return fileDBRepository.save(fileDB);
    }
    public FileDB saveFile(FileDB file) throws IOException {

        return fileDBRepository.save(file);
    }
    public FileDB getFile(String id) {
        return fileDBRepository.findById(id).get();
    }

    public Stream<FileDB> getAllFiles() {
        return fileDBRepository.findAll().stream();
    }
}