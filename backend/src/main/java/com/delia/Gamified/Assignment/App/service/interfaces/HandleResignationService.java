package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.HandleResignation;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.crossstore.ChangeSetPersister;

public interface HandleResignationService {
    public HandleResignation saveHandleResignation(HandleResignation handleResignation);
    public HandleResignation findById(Integer handleResignationId) throws ChangeSetPersister.NotFoundException;
}
