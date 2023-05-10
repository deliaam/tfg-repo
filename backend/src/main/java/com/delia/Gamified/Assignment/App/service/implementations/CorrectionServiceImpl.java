package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.model.Task;
import com.delia.Gamified.Assignment.App.repository.CorrectionRepository;
import com.delia.Gamified.Assignment.App.repository.SolutionRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.CorrectionService;
import com.delia.Gamified.Assignment.App.service.interfaces.SolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CorrectionServiceImpl implements CorrectionService {
    @Autowired
    private CorrectionRepository correctionRepository;

    @Override
    public Correction saveCorrection(Correction correction){return  correctionRepository.save(correction);}

    @Override
    public List<Correction> findBySolution(Integer solutionId){return correctionRepository.findAllBySolutionId(solutionId);}

    @Override
    public Correction findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Correction> optionalCorrection = correctionRepository.findById(id);
        if (optionalCorrection.isPresent()) {
            return optionalCorrection.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

}
