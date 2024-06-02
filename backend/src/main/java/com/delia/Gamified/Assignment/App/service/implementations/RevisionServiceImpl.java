package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.controller.CorrectionController;
import com.delia.Gamified.Assignment.App.model.Revision;
import com.delia.Gamified.Assignment.App.repository.RevisionRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.RevisionService;
import com.delia.Gamified.Assignment.App.service.interfaces.SolutionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RevisionServiceImpl implements RevisionService {
    @Autowired
    private RevisionRepository revisionRepository;

    @Autowired
    private SolutionService solutionService;

    @Override
    public Revision saveRevision(Revision revision){return  revisionRepository.save(revision);}

    @Override
    public List<Revision> findByClass(Integer classId){return revisionRepository.findAllByClassId(classId);}

    private static final Logger LOGGER = LoggerFactory.getLogger(CorrectionController.class);

    @Override
    public Revision findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Revision> optionalRevision = revisionRepository.findById(id);
        if (optionalRevision.isPresent()) {
            return optionalRevision.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public Revision setReviewed(Integer revisionId) throws ChangeSetPersister.NotFoundException {
        Revision revision = findById(revisionId);
        revision.setReviewed(true);
        return revisionRepository.save(revision);
    }
}
