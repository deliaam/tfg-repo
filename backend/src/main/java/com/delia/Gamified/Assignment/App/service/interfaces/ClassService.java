package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Class;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface ClassService {
    public Class saveClass(Class classObj);

    public List<Class> getAllClasses();

    public void delete(int id);

    public void updateClass(Class classObj) throws ChangeSetPersister.NotFoundException;
    public Class findByCode(String code) throws ChangeSetPersister.NotFoundException;
    public Class findById(Integer id)  throws ChangeSetPersister.NotFoundException;

}
