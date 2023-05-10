package com.delia.Gamified.Assignment.App.service.interfaces;

import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.Solution;
import org.springframework.data.crossstore.ChangeSetPersister;

import java.util.List;

public interface CorrectionService {
    public Correction saveCorrection(Correction correction);
    public List<Correction> findBySolution(Integer solutionId);
    public Correction findById(Integer correctionId) throws ChangeSetPersister.NotFoundException;

}
