package com.delia.Gamified.Assignment.App.repository;

import com.delia.Gamified.Assignment.App.model.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, Integer> {
    @Query("SELECT r FROM Revision r WHERE r.correction.solution.task.classObj.id = :classId AND r.isReviewed = false AND r.correction.removed = false ORDER BY r.dateTime DESC ")
    List<Revision> findAllByClassId(@Param("classId")Integer classId);
}
