package com.fahim.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardResponse {
    private long todayTasks;
    private long tomorrowTasks;
    private long weeklyTasks;
    private long monthlyTasks;
    private long completedTasks;
    private long pendingTasks;
    private long unreadNotifications;
}
