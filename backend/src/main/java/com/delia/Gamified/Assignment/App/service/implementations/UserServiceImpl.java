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

    public User findByUsername(String userName) throws ChangeSetPersister.NotFoundException {
        Optional<User> optionalUser = userRepository.findByUsername(userName);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    public void verifyUser(String token) throws ChangeSetPersister.NotFoundException {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setVerified(true);
            user.setVerificationToken(null); // Clear the token after verification
            userRepository.save(user);
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
