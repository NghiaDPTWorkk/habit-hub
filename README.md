# CAPSTONE PROJECT REPORT - WECAMP BATCH 11

**Project Name:** TraceX
**Prepared by:** ByteBuilders

---

## 1. Overview
TraceX is a web application that helps users build, track, and analyze their daily habits and personal goals. This capstone focuses on real-life business logic, state management, derived data, and user experience.

### Learning Objectives
After completing this capstone, participants should be able to:
* Model complex application state.
* Manage multiple related data domains.
* Implement derived data and calculations.
* Build clear, structured, and scalable React components.
* Explain trade-offs and design decisions.

---

## 2. Team & Project Introduction

* **Team Name:** ByteBuilders
* **Project Name:** TraceX

### Team Members & Roles
| Member Name | Role / Responsibility | Assigned Features |
| :--- | :--- | :--- |
| Duong Pham Trong Nghia | Leader & BA | * Export Habit Data to JSON File |
| Le Ngoc Minh Phuong | Tester & DevOps | * Read-Only Summary Mode & Progress Charts |
| Nguyen Thi Bao Nhu | Developer | * Streaks & Statistics Dashboard<br>* Calendar Heatmap View of Check-ins |
| Arlene Phuong Brown | Developer | * Habit Management |
| Le Xuan Ny | Developer | * Habit Management<br>* Undo / Reset Logic<br>* Habit Reminder Notes Per Day |
| Tran Thi Hanh | Developer | * Daily Check-in Tracking |
| Nguyen Ngoc Truc Quynh | Developer | * Goals & Progress Rules |
| **All Members** | **Team** | * UX & Error Handling + Derived State & Data Persistence<br>* Responsive Mobile-First Design |

---

## 3. Core Features (Mandatory)

### 3.1 Habit Management
**Assigned to:** Arlene Phuong Brown + Le Xuan Ny

Users can manage all the habits they want to build. Each habit includes:
* **Habit name**
* **Category:** Health, Study, Work, Mindfulness, Other
* **Frequency:** Daily, Specific days of the week
* **Target per day:** (for example: drink water 8 times)
* **Priority:** Low, Medium, High
* **Status:** Active, Paused, Archived
* **Actions:** Add, edit, delete, pause, resume, archive, and filter habits by category, frequency, priority, or status.

<img width="8192" height="6725" alt="Habit Actions Sequence Diagram" src="https://github.com/user-attachments/assets/29176f1f-316b-4cb6-8cdb-4ed36e38a434" />
<p align="center"><em>(Habit Actions Sequence Diagram)</em></p>

### 3.2 Daily Check-in Tracking
**Assigned to:** Tran Thi Hanh

* Users can record progress for each habit on each day.
* Each check-in includes habit reference, date, completed count, and completion status (Not Started, In Progress, Completed).
* Users can mark a habit as done, increase/decrease the count, edit check-ins for the current day, and view check-ins grouped by date.
* Habits with a missed check-in for the current day must be visually highlighted.
* The system must show daily completion progress in real time.

<img width="13644" height="13796" alt="Check-ins Actions Sequence Diagram" src="https://github.com/user-attachments/assets/29f76652-1796-4c18-8311-3fa12041d3b6" />
<p align="center"><em>(Check-ins Actions Sequence Diagram)</em></p>

### 3.3 Goals & Progress Rules
**Assigned to:** Nguyen Truc Quynh

* Users can set a measurable goal for each habit (Streak target or Total completions target).
* At 80% of the target: show an encouragement message.
* At 100% of the target: show a goal-achieved alert.
* UI must clearly indicate goal status.

<img width="5636" height="7404" alt="Goal Actions Sequence Diagram" src="https://github.com/user-attachments/assets/aaeef25e-78fd-4329-bf9f-0d8d619f9449" />
<p align="center"><em>(Goal Actions Sequence Diagram)</em></p>

<img width="6528" height="8588" alt="Goals Progress Sequence Diagram" src="https://github.com/user-attachments/assets/93879364-31da-4998-abb7-e760c92445ce" />
<p align="center"><em>(Goals Progress Sequence Diagram)</em></p>

### 3.4 Streaks & Statistics Dashboard
**Assigned to:** Nguyen Thi Bao Nhu

* A dedicated dashboard shows habits grouped by category.
* Key indicators per habit: Current streak, Longest streak, Total completions, Completion rate over the last 7 days.
* Overall indicators: % of habits completed today, Number of active habits, Number of habits at risk of breaking a streak.

### 3.5 Undo / Reset Logic
**Assigned to:** Le Xuan Ny

* Support at least one of the following actions: undo the last check-in action, or reset all data to the initial state.
* The logic for these actions must be clearly implemented and explained within the application or documentation.

<img width="8192" height="6310" alt="Undo and Reset Logic Diagram" src="https://github.com/user-attachments/assets/027d7999-55cd-4993-8f82-29abd047b338" />
<p align="center"><em>(Undo / Reset Logic Sequence Diagram)</em></p>

### 3.6 UX & Error Handling + Derived State & Data Persistence
**Assigned to:** All members

* **Input Validation:** Ensure that required fields cannot be empty. Target values and counts cannot be negative, and the completed count cannot exceed the daily target. Additionally, a future date cannot be checked in.
* **Error Messages:** Show clear error messages to the user when input validation fails.
* **Empty States:** The UI must handle empty states gracefully, specifically when there are: no habits, no check-ins for the selected day, or no goals set.
* **Derived State & Performance:** Avoid duplicated state; all streaks, totals, percentages, and warnings must be derived from source data.
* **Data Persistence:** Data must persist after page refresh using mocked JSON data or localStorage.

<img width="7643" height="4508" alt="State architecture, validation and persistence flow" src="https://github.com/user-attachments/assets/3f3a7a7b-e142-417e-b5a7-222e9ede323d" />
<p align="center"><em>(State architecture, validation and persistence flow)</em></p>

**Sample Local Storage JSON Object (`tracex_data` / `habit-hub-storage` schema):**

```json
{
  "state": {
    "habits": [
      {
        "id": 1,
        "name": "Drink Water",
        "category": "Health",
        "frequency": "Daily",
        "specificDays": null,
        "targetPerDay": 8,
        "priority": "High",
        "status": "Active",
        "createdAt": "2026-06-15"
      },
      {
        "id": 2,
        "name": "Reading Book",
        "category": "Study",
        "frequency": "Specific",
        "specificDays": [1, 3, 5],
        "targetPerDay": 1,
        "priority": "Medium",
        "status": "Active",
        "createdAt": "2026-06-15"
      }
    ],
    "checkins": {
      "2026-06-15_1": {
        "habitId": 1,
        "date": "2026-06-15",
        "completedCount": 5,
        "status": "In Progress"
      },
      "2026-06-15_2": {
        "habitId": 2,
        "date": "2026-06-15",
        "completedCount": 1,
        "status": "Completed"
      }
    },
    "goals": [
      {
        "id": "1718452800000",
        "habitId": 1,
        "targetType": "total_completions",
        "targetValue": 100,
        "status": "active",
        "createdAt": "2026-06-15"
      }
    ],
    "notes": [
      {
        "id": "note-uuid-123456",
        "habitId": 1,
        "date": "2026-06-15",
        "content": "Drank 5 glasses before 5 PM. Feeling hydrated!",
        "createdAt": "2026-06-15T10:00:00.000Z"
      }
    ],
    "notifiedGoals": {
      "1718452800000-80percent": true
    },
    "themeMode": "dark"
  },
  "version": 0
}
```
---

## 4. Bonus Features (Optional - Stretch)

### 4.1 Calendar Heatmap View of Check-ins
**Assigned to:** Nguyen Thi Bao Nhu

* Visualize user check-in data over time using a calendar heatmap format.
* Indicate completion status or intensity (e.g., number of habits completed) on specific days using varying colors or shades.
* Allow users to navigate between different months or years to review historical progress.

### 4.2 Habit Reminder Notes Per Day
**Assigned to:** Le Xuan Ny

* Enable users to add custom text notes or reminders for specific habits on specific dates.
* Display these notes clearly within the daily check-in interface to serve as context or motivation.
* Store notes persistently alongside the daily check-in data.

<img width="8170" height="5300" alt="Habit Reminder Diagram" src="https://github.com/user-attachments/assets/225240a1-88b3-4095-9fe9-8b76ea90e312" />
<p align="center"><em>(Habit Reminder Notes Sequence Diagram)</em></p>

### 4.3 Export Habit Data to JSON File
**Assigned to:** Duong Pham Trong Nghia

* Provide a user-friendly option to export all current habit data, check-in history, and goal settings.
* Generate a downloadable JSON file containing the user's complete raw data.
* Allow users to create safe backups of their personal progress locally.

<img width="8192" height="4357" alt="Export Habit Data Diagram" src="https://github.com/user-attachments/assets/1519843a-2ee3-4e7b-bddf-dba4ae502475" />
<p align="center"><em>(Export Habit Data Sequence Diagram)</em></p>

### 4.4 Responsive Mobile-First Design
**Assigned to:** All members

* Ensure the application layout and UI components adapt seamlessly to various screen sizes, with a primary focus on mobile devices.
* Optimize interactive elements (buttons, forms, modals, navigation) for touch screens.
* Maintain clear readability, usability, and visual hierarchy across mobile, tablet, and desktop views.

### 4.5 Read-Only Summary Mode & Progress Charts
**Assigned to:** Le Ngoc Minh Phuong

* **Read-only mode:** Implement a specific view that summarizes the user's progress which can be safely shared with others without allowing data modification.
* **Weekly progress chart:** Generate visual charts (e.g., bar charts or line graphs) that display progress over the week, grouped by habit category (Health, Study, Work, etc.).

---

## 5. Known Limitations
Based on the project's technical constraints and scope, the following limitations are acknowledged:

* **Device-Specific Data:** Because the application relies strictly on `localStorage` or mocked JSON for data persistence, user data is tied to the specific browser and device being used. Cross-device synchronization is not currently possible.
* **No Authentication & Security:** The application has no authentication system and no real backend. Any user accessing the application on the same device/browser will have full access to view and modify the habit data.
* **Storage Capacity:** `localStorage` has a typical limit of around 5MB per origin. While sufficient for standard usage, an exceptionally long history of daily check-ins and habit notes over many years might eventually reach this limit.
* **Local Processing:** All derived data calculations (streaks, percentages, overall progress) are computed on the client side (frontend). For massive datasets, this could potentially impact performance, though it is optimized within the scope of React state management.
