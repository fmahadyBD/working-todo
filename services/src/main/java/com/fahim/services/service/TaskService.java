package com.fahim.services.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.fahim.services.dto.TaskRequest;
import com.fahim.services.entity.Task;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;
import com.fahim.services.exception.ResourceNotFoundException;
import com.fahim.services.repository.TaskRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final NotificationService notificationService;

    public List<Task> getAll() { return taskRepository.findAll(); }

    public List<Task> getBySection(TaskSection section) {
        return taskRepository.findBySection(section);
    }

    public Task getById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }

    public Task create(TaskRequest req) {
        Task task = Task.builder()
            .task(req.getTask())
            .category(req.getCategory())
            .priority(req.getPriority())
            .status(req.getStatus())
            .section(req.getSection() != null ? req.getSection() : TaskSection.TODAY)
            .plannedDate(req.getPlannedDate())
            .originalDueDate(req.getOriginalDueDate())
            .projectGoal(req.getProjectGoal())
            .notes(req.getNotes())
            .build();
        Task saved = taskRepository.save(task);
        notificationService.create("New Task", "Task created: " + saved.getTask(), saved.getId());
        return saved;
    }

    public Task update(Long id, TaskRequest req) {
        Task task = getById(id);
        task.setTask(req.getTask());
        task.setCategory(req.getCategory());
        task.setPriority(req.getPriority());
        task.setStatus(req.getStatus());
        task.setSection(req.getSection());
        task.setPlannedDate(req.getPlannedDate());
        task.setOriginalDueDate(req.getOriginalDueDate());
        task.setProjectGoal(req.getProjectGoal());
        task.setNotes(req.getNotes());
        return taskRepository.save(task);
    }

    public Task complete(Long id) {
        Task task = getById(id);
        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);
        notificationService.create("Task Completed", "Completed: " + saved.getTask(), saved.getId());
        return saved;
    }

    public Task moveSection(Long id, TaskSection section) {
        Task task = getById(id);
        task.setSection(section);
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        Task task = getById(id);
        taskRepository.delete(task);
    }
}
