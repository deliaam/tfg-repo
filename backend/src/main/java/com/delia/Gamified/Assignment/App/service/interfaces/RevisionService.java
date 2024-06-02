package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Revision;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface RevisionService {
    public Revision saveRevision(Revision revision);
    public List<Revision> findByClass(Integer classId);
    public Revision findById(Integer revisionId) throws ChangeSetPersister.NotFoundException;
    public Revision setReviewed(Integer revisionId) throws ChangeSetPersister.NotFoundException;
}
