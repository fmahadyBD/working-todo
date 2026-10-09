package com.fahim.services.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.fahim.services.entity.Task;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;

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
