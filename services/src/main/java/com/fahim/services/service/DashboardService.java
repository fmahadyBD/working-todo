package com.fahim.service;

import com.fahim.dto.DashboardResponse;
import com.fahim.enums.TaskSection;
import com.fahim.enums.TaskStatus;
import com.fahim.repository.NotificationRepository;
import com.fahim.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
