package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Student;
import com.delia.Gamified.Assignment.App.model.User;
import com.delia.Gamified.Assignment.App.repository.StudentRepository;
import com.delia.Gamified.Assignment.App.repository.UserRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.StudentService;
import com.delia.Gamified.Assignment.App.service.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User findById(Long id)  throws ChangeSetPersister.NotFoundException {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
