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

    /**
     * Runs at 23:59 every day.
     * Moves COMPLETED tasks from TODAY → WEEKLY (archives them).
     */
    @Scheduled(cron = "0 59 23 * * *")
    public void rolloverTodayToWeekly() {
        List<Task> completed =
            taskRepo.findBySectionAndStatus(TaskSection.TODAY, TaskStatus.COMPLETED);

        if (completed.isEmpty()) {
            log.info("Rollover TODAY→WEEKLY: nothing to do");
            return;
        }

        completed.forEach(t -> t.setSection(TaskSection.WEEKLY));
        taskRepo.saveAll(completed);

        notifService.create("Daily Rollover",
            completed.size() + " completed task(s) archived to Weekly", null);

        log.info("Rolled over {} tasks from TODAY to WEEKLY", completed.size());
    }

    /**
     * Runs at 23:59 every Sunday.
     * Moves COMPLETED tasks from WEEKLY → MONTHLY (archives them).
     */
    @Scheduled(cron = "0 59 23 * * SUN")
    public void rolloverWeeklyToMonthly() {
        List<Task> completed =
            taskRepo.findBySectionAndStatus(TaskSection.WEEKLY, TaskStatus.COMPLETED);

        if (completed.isEmpty()) {
            log.info("Rollover WEEKLY→MONTHLY: nothing to do");
            return;
        }

        completed.forEach(t -> t.setSection(TaskSection.MONTHLY));
        taskRepo.saveAll(completed);

        notifService.create("Weekly Rollover",
            completed.size() + " completed task(s) archived to Monthly", null);

        log.info("Rolled over {} tasks from WEEKLY to MONTHLY", completed.size());
    }

    /**
     * Runs at 00:01 every day.
     * Promotes ALL tasks (pending + completed) from TOMORROW → TODAY.
     */
    @Scheduled(cron = "0 1 0 * * *")
    public void promoteTomorrowToToday() {
        List<Task> tomorrow = taskRepo.findBySection(TaskSection.TOMORROW);

        if (tomorrow.isEmpty()) {
            log.info("Promote TOMORROW→TODAY: nothing to do");
            return;
        }

        tomorrow.forEach(t -> t.setSection(TaskSection.TODAY));
        taskRepo.saveAll(tomorrow);

        notifService.create("Morning Rollover",
            tomorrow.size() + " task(s) moved from Tomorrow to Today", null);

        log.info("Promoted {} tasks from TOMORROW to TODAY", tomorrow.size());
    }
}