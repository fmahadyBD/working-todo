package com.fahim.services.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fahim.services.entity.Task;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    /* ---------- Basic lookups ---------- */
    List<Task> findBySection(TaskSection section);
    List<Task> findBySectionAndStatus(TaskSection section, TaskStatus status);
    List<Task> findBySectionAndStatusNot(TaskSection section, TaskStatus status);
    List<Task> findByPlannedDate(LocalDate plannedDate);
    List<Task> findByStatus(TaskStatus status);

    /* ---------- Counts ---------- */
    long countBySection(TaskSection section);
    long countByStatus(TaskStatus status);
    long countBySectionAndStatus(TaskSection section, TaskStatus status);

    /* ---------- Active-only per section (excludes COMPLETED) ---------- */
    @Query("""
        SELECT t FROM Task t
        WHERE t.section = :section
          AND t.status IN ('PENDING', 'IN_PROGRESS')
        ORDER BY t.priority DESC, t.plannedDate ASC
        """)
    List<Task> findActiveBySection(@Param("section") TaskSection section);

    @Query("""
        SELECT COUNT(t) FROM Task t
        WHERE t.section = :section
          AND t.status IN ('PENDING', 'IN_PROGRESS')
        """)
    long countActiveBySection(@Param("section") TaskSection section);

    /* ---------- All completed tasks (for archive view) ---------- */
    @Query("""
        SELECT t FROM Task t
        WHERE t.status = 'COMPLETED'
        ORDER BY t.completedAt DESC
        """)
    List<Task> findAllCompleted();
}