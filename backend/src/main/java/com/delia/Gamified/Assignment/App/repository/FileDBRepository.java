package com.delia.Gamified.Assignment.App.repository;
import com.delia.Gamified.Assignment.App.model.FileDB;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FileDBRepository extends JpaRepository<FileDB, String> {

}