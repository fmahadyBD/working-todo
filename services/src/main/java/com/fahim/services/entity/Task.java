package com.fahim.services.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fahim.services.enums.Priority;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String task;

    private String category;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    private TaskSection section;

    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @Column(name = "planned_date")
    private LocalDate plannedDate;

    @Column(name = "original_due_date")
    private LocalDate originalDueDate;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "project_goal")
    private String projectGoal;

    @Column(length = 2000)
    private String notes;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
        if (this.status == null) this.status = TaskStatus.PENDING;
        if (this.priority == null) this.priority = Priority.MEDIUM;
        if (this.section == null) this.section = TaskSection.TODAY;
    }

    @PreUpdate
    public void preUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}
