package com.fahim.services.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.fahim.services.dto.DashboardResponse;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;
import com.fahim.services.repository.NotificationRepository;
import com.fahim.services.repository.TaskRepository;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepo;
    private final NotificationRepository notifRepo;

    public DashboardResponse getStats() {
        return new DashboardResponse(
            // ✅ Active (pending + in-progress) per section
            taskRepo.countActiveBySection(TaskSection.TODAY),
            taskRepo.countActiveBySection(TaskSection.TOMORROW),
            taskRepo.countActiveBySection(TaskSection.WEEKLY),
            taskRepo.countActiveBySection(TaskSection.MONTHLY),

            // Totals across all sections
            taskRepo.countByStatus(TaskStatus.COMPLETED),
            taskRepo.countByStatus(TaskStatus.PENDING)
                + taskRepo.countByStatus(TaskStatus.IN_PROGRESS),

            // Unread notifications
            notifRepo.findByReadFalseOrderByCreatedAtDesc().size()
        );
    }
}