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

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    /** Returns all tasks in a section (includes completed). */
    public List<Task> getBySection(TaskSection section) {
        return taskRepository.findBySection(section);
    }

    /** Returns only pending/in-progress tasks in a section. */
    public List<Task> getActiveBySection(TaskSection section) {
        return taskRepository.findActiveBySection(section);
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
                .status(req.getStatus() != null ? req.getStatus() : TaskStatus.PENDING)
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

        // ✅ Only overwrite if provided — don't wipe with null
        if (req.getStatus() != null)
            task.setStatus(req.getStatus());
        if (req.getSection() != null)
            task.setSection(req.getSection());

        task.setPlannedDate(req.getPlannedDate());
        task.setOriginalDueDate(req.getOriginalDueDate());
        task.setProjectGoal(req.getProjectGoal());
        task.setNotes(req.getNotes());

        return taskRepository.save(task);
    }

    /**
     * ✅ Marks task COMPLETED.
     * Section is NOT changed — task stays where it is.
     * Scheduler later archives it (if enabled).
     */
    public Task complete(Long id) {
        Task task = getById(id);

        if (task.getStatus() == TaskStatus.COMPLETED) {
            return task; // idempotent — do nothing if already done
        }

        task.setStatus(TaskStatus.COMPLETED);
        task.setCompletedAt(LocalDateTime.now());
        Task saved = taskRepository.save(task);

        notificationService.create("Task Completed",
                "Completed: " + saved.getTask(), saved.getId());
        return saved;
    }

    /** Revert a completed task back to PENDING. */
    public Task uncomplete(Long id) {
        Task task = getById(id);
        task.setStatus(TaskStatus.PENDING);
        task.setCompletedAt(null);
        return taskRepository.save(task);
    }

    /** Move task to a different section. Does not change status. */
    public Task moveSection(Long id, TaskSection section) {
        Task task = getById(id);
        if (task.getSection() == section)
            return task;
        task.setSection(section);
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        Task task = getById(id);
        taskRepository.delete(task);
    }

    public List<Task> getAllCompleted() {
        return taskRepository.findAllCompleted();
    }
}