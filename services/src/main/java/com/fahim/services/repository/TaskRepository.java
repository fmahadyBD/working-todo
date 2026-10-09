package com.fahim.repository;

import com.fahim.entity.Task;
import com.fahim.enums.TaskSection;
import com.fahim.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findBySection(TaskSection section);
    List<Task> findBySectionAndStatus(TaskSection section, TaskStatus status);
    List<Task> findByPlannedDate(LocalDate plannedDate);
    List<Task> findByStatus(TaskStatus status);
    long countBySection(TaskSection section);
    long countByStatus(TaskStatus status);
}
