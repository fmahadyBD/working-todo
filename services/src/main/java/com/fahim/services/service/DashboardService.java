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
            taskRepo.countBySection(TaskSection.TODAY),
            taskRepo.countBySection(TaskSection.TOMORROW),
            taskRepo.countBySection(TaskSection.WEEKLY),
            taskRepo.countBySection(TaskSection.MONTHLY),
            taskRepo.countByStatus(TaskStatus.COMPLETED),
            taskRepo.countByStatus(TaskStatus.PENDING),
            notifRepo.findByReadFalseOrderByCreatedAtDesc().size()
        );
    }
}
