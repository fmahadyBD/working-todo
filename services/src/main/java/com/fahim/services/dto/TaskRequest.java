package com.fahim.dto;

import com.fahim.enums.Priority;
import com.fahim.enums.TaskSection;
import com.fahim.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

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
