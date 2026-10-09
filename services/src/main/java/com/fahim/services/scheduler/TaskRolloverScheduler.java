package com.fahim.services.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fahim.services.entity.Task;
import com.fahim.services.enums.TaskSection;
import com.fahim.services.enums.TaskStatus;
import com.fahim.services.repository.TaskRepository;
import com.fahim.services.service.NotificationService;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskRolloverScheduler {

    private final TaskRepository taskRepo;
    private final NotificationService notifService;

    // Every day at 11:59 PM - completed TODAY -> WEEKLY
    @Scheduled(cron = "0 59 23 * * *")
    public void rolloverTodayToWeekly() {
        List<Task> completed = taskRepo.findBySectionAndStatus(TaskSection.TODAY, TaskStatus.COMPLETED);
        completed.forEach(t -> t.setSection(TaskSection.WEEKLY));
        taskRepo.saveAll(completed);
        if (!completed.isEmpty()) {
            notifService.create("Daily Rollover", completed.size() + " tasks moved to Weekly", null);
        }
        log.info("Rolled over {} tasks from TODAY to WEEKLY", completed.size());
    }

    // Every Sunday 11:59 PM - completed WEEKLY -> MONTHLY
    @Scheduled(cron = "0 59 23 * * SUN")
    public void rolloverWeeklyToMonthly() {
        List<Task> completed = taskRepo.findBySectionAndStatus(TaskSection.WEEKLY, TaskStatus.COMPLETED);
        completed.forEach(t -> t.setSection(TaskSection.MONTHLY));
        taskRepo.saveAll(completed);
        if (!completed.isEmpty()) {
            notifService.create("Weekly Rollover", completed.size() + " tasks moved to Monthly", null);
        }
        log.info("Rolled over {} tasks from WEEKLY to MONTHLY", completed.size());
    }

    // Every midnight 12:01 AM - TOMORROW -> TODAY
    @Scheduled(cron = "0 1 0 * * *")
    public void promoteTomorrowToToday() {
        List<Task> tomorrow = taskRepo.findBySection(TaskSection.TOMORROW);
        tomorrow.forEach(t -> t.setSection(TaskSection.TODAY));
        taskRepo.saveAll(tomorrow);
        log.info("Promoted {} tasks from TOMORROW to TODAY", tomorrow.size());
    }
}
