package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.User;
import org.springframework.data.crossstore.ChangeSetPersister;

public interface UserService {
    public User findById(Long id)  throws ChangeSetPersister.NotFoundException;

    public User findByUsername(String username)  throws ChangeSetPersister.NotFoundException;

    public void verifyUser(String toke)  throws ChangeSetPersister.NotFoundException;

}
