package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Class;
import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.repository.ClassRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.apache.commons.lang.RandomStringUtils;

@Service
public class ClassServiceImpl implements ClassService {
    @Autowired
    private ClassRepository classRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(ClassServiceImpl.class);

    @Override
    public Class saveClass(Class classObj) {
        classObj.setCode(RandomStringUtils.randomAlphanumeric(10));
        return classRepository.save(classObj);
    }

    @Override
    public List<Class> getAllClasses() {
        return classRepository.findAll();
    }

    @Override
    public void delete(int id){
        LOGGER.debug("delete " + id);
        classRepository.deleteById(id);
    }

    @Override
    public void updateClass(Class classObj) throws ChangeSetPersister.NotFoundException {
        Optional<Class> optionalClass = classRepository.findById(classObj.getId());
        LOGGER.debug("class object: " + classObj.getId());
        if (optionalClass.isPresent()) {
            Class classToUpdate = optionalClass.get();
            classToUpdate.setName(classObj.getName());

            classRepository.save(classToUpdate);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public Class findByCode(String code) throws ChangeSetPersister.NotFoundException {
        Optional<Class> optionalClass = classRepository.findByCode(code);
        if (optionalClass.isPresent()) {
            return optionalClass.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public Class findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Class> optionalClass = classRepository.findById(id);
        if (optionalClass.isPresent()) {
            return optionalClass.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
