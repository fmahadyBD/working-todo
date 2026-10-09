package com.fahim.services.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

import com.fahim.services.enums.Priority;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;

@Data
public class TaskRequest {
    @NotBlank(message = "Task name is required")
    private String task;
    private String category;
    private Priority priority;
    private TaskStatus status;
    private TaskSection section;
    private LocalDate plannedDate;
    private LocalDate originalDueDate;
    private String projectGoal;
    private String notes;
}
