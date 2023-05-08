package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.HandleResignation;
import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.repository.HandleResignationRepository;
import com.delia.Gamified.Assignment.App.repository.SolutionRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.HandleResignationService;
import com.delia.Gamified.Assignment.App.service.interfaces.SolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HandleResignationServiceImpl implements HandleResignationService {
    @Autowired
    private HandleResignationRepository handleResignationRepository;

    @Override
    public HandleResignation saveHandleResignation(HandleResignation handleResignation){return  handleResignationRepository.save(handleResignation);}

    @Override
    public HandleResignation findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<HandleResignation> optionalHandleResignation = handleResignationRepository.findById(id);
        if (optionalHandleResignation.isPresent()) {
            return optionalHandleResignation.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }
}
