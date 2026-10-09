# 📘 Todo App — Backend Service Documentation

> **Base Package:** `com.fahim`
> **Port:** `8080`
> **Database:** MySQL (`todo_db`)
> **Base URL:** `http://localhost:8080`

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Setup & Run](#-setup--run)
5. [Data Model](#-data-model)
6. [Task Lifecycle / Rollover Logic](#-task-lifecycle--rollover-logic)
7. [API Reference](#-api-reference)
8. [Enums](#-enums)
9. [Error Handling](#-error-handling)
10. [Scheduler](#-scheduler)
11. [Frontend / Mobile Integration Notes](#-frontend--mobile-integration-notes)
12. [Roadmap / Not Yet Implemented](#-roadmap--not-yet-implemented)

---

## 🎯 Overview

A Spring Boot REST backend for a Todo application with:

- **Sections:** Today, Tomorrow, Weekly, Monthly
- **Automatic rollover:** Completed tasks flow `TODAY → WEEKLY → MONTHLY` via cron jobs
- **Dashboard:** Aggregated statistics
- **Notifications:** In-app notification feed
- **Multi-platform ready:** Frontend (web) and mobile app both consume the same REST API

---

## 🧰 Tech Stack

| Layer | Tech |
|---|---|
| Language | Java 17 |
| Framework | Spring Boot 3.2.5 |
| Build | Maven |
| Database | MySQL 8 |
| ORM | Spring Data JPA (Hibernate) |
| Validation | Jakarta Bean Validation |
| Boilerplate | Lombok |
| Scheduling | Spring `@Scheduled` |

---

## 📂 Project Structure

```
src/main/java/com/fahim/
├── ServicesApplication.java        # Main entry + @EnableScheduling
├── config/
│   └── CorsConfig.java             # CORS for web/mobile
├── controller/
│   ├── TaskController.java
│   ├── NotificationController.java
│   └── DashboardController.java
├── dto/
│   ├── TaskRequest.java
│   └── DashboardResponse.java
├── entity/
│   ├── Task.java
│   └── Notification.java
├── enums/
│   ├── Priority.java
│   ├── TaskStatus.java
│   └── TaskSection.java
├── exception/
│   └── ResourceNotFoundException.java
├── repository/
│   ├── TaskRepository.java
│   └── NotificationRepository.java
├── scheduler/
│   └── TaskRolloverScheduler.java
└── service/
    ├── TaskService.java
    ├── NotificationService.java
    └── DashboardService.java
```

---

## ⚙️ Setup & Run

### 1. Create the database

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS todo_db;"
```

### 2. Configure `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/todo_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080
```

### 3. Run

```bash
./mvnw spring-boot:run
```

App is live at **`http://localhost:8080`**.

---

## 🗃️ Data Model

### `Task` Entity (table `tasks`)

| Field | Type | Notes |
|---|---|---|
| `id` | Long | Auto-generated PK |
| `task` | String | **Required** — task title |
| `category` | String | e.g. Work, Personal |
| `priority` | Enum | LOW / MEDIUM / HIGH / URGENT |
| `status` | Enum | PENDING / IN_PROGRESS / COMPLETED / ARCHIVED |
| `section` | Enum | TODAY / TOMORROW / WEEKLY / MONTHLY |
| `createdDate` | LocalDateTime | Set on insert |
| `plannedDate` | LocalDate | User's intended date |
| `originalDueDate` | LocalDate | Never mutated |
| `completedAt` | LocalDateTime | Set when marked complete |
| `projectGoal` | String | Grouping tag |
| `notes` | String (2000) | Free-form |
| `lastUpdated` | LocalDateTime | Auto-updated |

### `Notification` Entity (table `notifications`)

| Field | Type | Notes |
|---|---|---|
| `id` | Long | Auto PK |
| `title` | String | Short headline |
| `message` | String (1000) | Details |
| `taskId` | Long | Related task (nullable) |
| `read` | boolean | Default `false` |
| `createdAt` | LocalDateTime | Set on insert |

---

## 🔄 Task Lifecycle / Rollover Logic

```
   ┌───────────┐   complete   ┌───────────┐  daily 23:59  ┌──────────┐  Sunday 23:59  ┌──────────┐
   │  TODAY    │─────────────▶│ COMPLETED │──────────────▶│  WEEKLY  │───────────────▶│ MONTHLY  │
   └───────────┘              └───────────┘               └──────────┘                └──────────┘
         ▲                                                                                   
         │  midnight 00:01                                                                   
   ┌───────────┐                                                                             
   │ TOMORROW  │                                                                             
   └───────────┘                                                                             
```

**Triggers (cron):**

| Cron | Action |
|---|---|
| `0 59 23 * * *` | Completed `TODAY` → `WEEKLY` |
| `0 59 23 * * SUN` | Completed `WEEKLY` → `MONTHLY` |
| `0 1 0 * * *` | All `TOMORROW` → `TODAY` |

> ⚠️ **Important:** `@EnableScheduling` must be present on `ServicesApplication` (it is).

---

## 🌐 API Reference

**Base URL:** `http://localhost:8080`
**CORS:** Enabled for `*` on `/api/**`

### 📌 Task Endpoints — `/api/tasks`

#### `GET /api/tasks`
Fetch all tasks.

**Response 200**
```json
[
  {
    "id": 1,
    "task": "Finish report",
    "category": "Work",
    "priority": "HIGH",
    "status": "PENDING",
    "section": "TODAY",
    "createdDate": "2026-10-09T10:15:30",
    "plannedDate": "2026-10-09",
    "originalDueDate": "2026-10-10",
    "completedAt": null,
    "projectGoal": "Q4 Report",
    "notes": "Include charts",
    "lastUpdated": "2026-10-09T10:15:30"
  }
]
```

---

#### `GET /api/tasks/section/{section}`
Filter by section. Used by the **Weekly page** and **Monthly page**.

`{section}` ∈ `TODAY` | `TOMORROW` | `WEEKLY` | `MONTHLY`

**Example**
```
GET /api/tasks/section/WEEKLY
```

---

#### `GET /api/tasks/{id}`
Fetch one task.

**404** if not found.

---

#### `POST /api/tasks`
Create a task. Fires a notification.

**Request Body**
```json
{
  "task": "Finish report",
  "category": "Work",
  "priority": "HIGH",
  "status": "PENDING",
  "section": "TODAY",
  "plannedDate": "2026-10-09",
  "originalDueDate": "2026-10-10",
  "projectGoal": "Q4 Report",
  "notes": "Include charts"
}
```

**Required:** `task` (non-blank). Others optional — defaults applied (`status=PENDING`, `priority=MEDIUM`, `section=TODAY`).

**Response 200** — the saved task.

---

#### `PUT /api/tasks/{id}`
Full update of a task.

**Request Body** — same as POST.

---

#### `PATCH /api/tasks/{id}/complete`
Mark as **COMPLETED** and stamp `completedAt`.

**Response 200** — updated task.

---

#### `PATCH /api/tasks/{id}/move/{section}`
Manually move a task to another section.

**Example**
```
PATCH /api/tasks/1/move/WEEKLY
```

---

#### `DELETE /api/tasks/{id}`
Delete a task.

**Response 204** — No Content.

---

### 🔔 Notification Endpoints — `/api/notifications`

#### `GET /api/notifications`
All notifications, newest first.

#### `GET /api/notifications/unread`
Only unread ones — good for a bell badge.

#### `PATCH /api/notifications/{id}/read`
Mark one as read.

**Response 200** — updated notification.

---

### 📊 Dashboard Endpoint — `/api/dashboard`

#### `GET /api/dashboard`
Aggregated stats for the dashboard page.

**Response 200**
```json
{
  "todayTasks": 5,
  "tomorrowTasks": 3,
  "weeklyTasks": 12,
  "monthlyTasks": 8,
  "completedTasks": 20,
  "pendingTasks": 8,
  "unreadNotifications": 2
}
```

---

## 🧩 Enums

### Priority
`LOW` · `MEDIUM` · `HIGH` · `URGENT`

### TaskStatus
`PENDING` · `IN_PROGRESS` · `COMPLETED` · `ARCHIVED`

### TaskSection
`TODAY` · `TOMORROW` · `WEEKLY` · `MONTHLY`

> All enums serialize as **strings** in JSON.

---

## 🚨 Error Handling

### 404 — Resource Not Found
Thrown when a task ID doesn't exist.

```json
{
  "timestamp": "2026-10-09T10:20:00",
  "status": 404,
  "error": "Not Found",
  "message": "Task not found: 42",
  "path": "/api/tasks/42"
}
```

### 400 — Validation Failed
Triggered when `task` is blank.

```json
{
  "timestamp": "2026-10-09T10:20:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Task name is required",
  "path": "/api/tasks"
}
```

---

## ⏰ Scheduler

File: `scheduler/TaskRolloverScheduler.java`

| Method | Cron | Effect |
|---|---|---|
| `rolloverTodayToWeekly` | `0 59 23 * * *` | Completed TODAY → WEEKLY |
| `rolloverWeeklyToMonthly` | `0 59 23 * * SUN` | Completed WEEKLY → MONTHLY |
| `promoteTomorrowToToday` | `0 1 0 * * *` | All TOMORROW → TODAY |

Each rollover that moves > 0 tasks creates a **Notification**.

---

## 🔌 Frontend / Mobile Integration Notes

### Base URL
| Platform | URL |
|---|---|
| Web (localhost) | `http://localhost:8080` |
| Android Emulator | `http://10.0.2.2:8080` |
| iOS Simulator | `http://localhost:8080` |
| Physical device | `http://<your-lan-ip>:8080` |

### Pages → Endpoints Mapping

| UI Page | Endpoint |
|---|---|
| **Today's Plan** | `GET /api/tasks/section/TODAY` |
| **Tomorrow's Plan** | `GET /api/tasks/section/TOMORROW` |
| **Weekly Page** | `GET /api/tasks/section/WEEKLY` |
| **Monthly Page** | `GET /api/tasks/section/MONTHLY` |
| **Dashboard** | `GET /api/dashboard` |
| **Notification Bell** | `GET /api/notifications/unread` |
| **Notification Center** | `GET /api/notifications` |

### Common Actions

```javascript
// Complete a task
await fetch(`${BASE}/api/tasks/${id}/complete`, { method: 'PATCH' });

// Move a task manually
await fetch(`${BASE}/api/tasks/${id}/move/WEEKLY`, { method: 'PATCH' });

// Mark notification read
await fetch(`${BASE}/api/notifications/${id}/read`, { method: 'PATCH' });
```

### Polling Suggestion
No WebSocket yet. Poll `GET /api/notifications/unread` every **30s** for badge updates.

---

## 🗺️ Roadmap / Not Yet Implemented

Features **planned but not yet built** — file this list before starting the next phase.

- [ ] **Authentication & Authorization** — JWT + Spring Security
- [ ] **Per-user tasks** — add `userId` to Task, scope all queries by user
- [ ] **User entity + profile**
- [ ] **Global exception handler** (`@ControllerAdvice`) for consistent error JSON
- [ ] **Pagination & filtering** on `GET /api/tasks` (page, size, sort, search)
- [ ] **Soft delete** (add `deletedAt`)
- [ ] **Task tags** (many-to-many)
- [ ] **Subtasks**
- [ ] **Recurring tasks** (daily/weekly/monthly repeat)
- [ ] **File attachments** to tasks
- [ ] **WebSocket / SSE** for real-time notifications
- [ ] **Push notifications** (FCM for mobile)
- [ ] **Analytics / productivity report** endpoint
- [ ] **Export** (CSV / PDF)
- [ ] **Swagger / OpenAPI** docs (`springdoc-openapi`)
- [ ] **Unit + Integration tests** (JUnit + Testcontainers)
- [ ] **Dockerfile** + `docker-compose.yml` (App + MySQL)
- [ ] **CI/CD** pipeline
- [ ] **Rate limiting**
- [ ] **Audit log**
- [ ] **Timezone-aware scheduling** (per-user)

---

## 📎 Quick Reference — All Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/section/{section}` | Tasks by section |
| GET | `/api/tasks/{id}` | Get one task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/{id}` | Update task |
| PATCH | `/api/tasks/{id}/complete` | Mark complete |
| PATCH | `/api/tasks/{id}/move/{section}` | Move to section |
| DELETE | `/api/tasks/{id}` | Delete task |
| GET | `/api/notifications` | All notifications |
| GET | `/api/notifications/unread` | Unread notifications |
| PATCH | `/api/notifications/{id}/read` | Mark notification read |
| GET | `/api/dashboard` | Dashboard stats |

---

**Owner:** Fahim
**Package:** `com.fahim`
**Version:** `0.1.0` (pre-auth, pre-pagination)