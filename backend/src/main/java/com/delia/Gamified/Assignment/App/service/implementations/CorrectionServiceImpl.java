package com.delia.Gamified.Assignment.App.service.implementations;

import com.delia.Gamified.Assignment.App.controller.CorrectionController;
import com.delia.Gamified.Assignment.App.model.Correction;
import com.delia.Gamified.Assignment.App.model.EQualification;
import com.delia.Gamified.Assignment.App.model.Solution;
import com.delia.Gamified.Assignment.App.repository.CorrectionRepository;
import com.delia.Gamified.Assignment.App.service.interfaces.CorrectionService;
import com.delia.Gamified.Assignment.App.service.interfaces.SolutionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CorrectionServiceImpl implements CorrectionService {
    @Autowired
    private CorrectionRepository correctionRepository;

    @Autowired
    private SolutionService solutionService;

    @Override
    public Correction saveCorrection(Correction correction){return  correctionRepository.save(correction);}

    @Override
    public List<Correction> findBySolution(Integer solutionId){return correctionRepository.findAllBySolutionId(solutionId);}

    private static final Logger LOGGER = LoggerFactory.getLogger(CorrectionController.class);

    @Override
    public Correction findById(Integer id)  throws ChangeSetPersister.NotFoundException {
        Optional<Correction> optionalCorrection = correctionRepository.findById(id);
        if (optionalCorrection.isPresent()) {
            return optionalCorrection.get();
        } else {
            throw new ChangeSetPersister.NotFoundException();
        }
    }

    @Override
    public EQualification removeCorrection(Integer correctionId) throws ChangeSetPersister.NotFoundException{
        EQualification newQualification;
        Correction correction = findById(correctionId);
        Solution solution = correction.getSolution();
        List<Correction> correctionList = findBySolution(solution.getId());
        correctionList.remove(correction);
        if(correctionList.isEmpty()){
            newQualification=null;
        }else{
            newQualification = correctionList.get(correctionList.size()-1).getQualification();
        }
        solution.setQualification(newQualification);
        solutionService.saveSolution(solution);
        correction.setRemoved(true);
        correctionRepository.save(correction);
        return newQualification;
    }

}
