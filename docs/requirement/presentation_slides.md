---
marp: true
theme: default
paginate: true
backgroundColor: #ffffff
color: #1e293b
style: |
  section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 40px 60px;
    font-size: 22px;
  }
  h1 {
    color: #1e3a8a;
    font-size: 1.6em;
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  h2 {
    color: #0f766e;
    font-size: 1.25em;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-top: 15px;
  }
  h3 {
    color: #b91c1c;
    font-size: 1.0em;
    margin-bottom: 5px;
  }
  footer {
    font-size: 0.5em;
    color: #64748b;
  }
  .slide-header {
    font-size: 0.8em;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 20px;
    padding-bottom: 5px;
  }
  .highlight {
    background-color: #f1f5f9;
    border-left: 4px solid #1e3a8a;
    padding: 15px;
    margin: 15px 0;
    border-radius: 4px;
  }
  table {
    font-size: 0.8em;
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 10px;
    text-align: left;
  }
  th {
    background-color: #f8fafc;
    color: #1e3a8a;
  }
---

# CAPSTONE GRADUATION PROJECT REPORT

## PROJECT: TRACEX - PERSONAL HABIT MANAGEMENT SYSTEM

### Training Unit: Wecamp - Batch 11

**Development Team:** ByteBuilders (07 Members)
**Specialist Judge:** Liam Nguyen

---

## JUDGES AND TEAM MEMBERS

### Evaluation Board: Judge Liam Nguyen

- **Duong Pham Trong Nghia** (Team Leader / Lead BA & PM)
  - Business analysis, data flow management, PR review & base code design.
- **Le Ngoc Minh Phuong** (DevOps Engineer / QA & Deployment)
  - CI/CD setup, quality assurance, automation testing & Bug Tracking.
- **Development Team (Developers):**
  - **Arlene Phuong Brown**: Zustand store logic, Zod validation & Habit Schedule.
  - **Le Xuan Ny**: UI components design, habit cards, interactive forms with MUI.
  - **Tran Thi Hanh**: Check-in logic, boundary checks for dates, progress history.
  - **Nguyen Thi Bao Nhu**: Statistics algorithms (Streaks/Rates) & Dashboard charts.
  - **Nguyen Ngoc Truc Quynh**: Goal management mechanism & smart feedback (MUI Snackbar).

---

## CHAPTER I: PROJECT OVERVIEW & CONTEXT

### 1. Project Context

- Part of the Wecamp Batch 11 Capstone program, requiring advanced Frontend techniques and strict adherence to enterprise development standards.

### 2. Practical Needs & Problem Statement

- Users struggle to maintain self-discipline due to a lack of visual progress tracking tools.
- Most existing applications require complex registration/login, which creates initial barriers for users.

### 3. Proposed Solution: TraceX System

- Build a high-performance Single Page Application (SPA) web app with instant local persistence (localStorage) for a friction-free, no-authentication (No-Auth) experience.

---

## CHAPTER II: FEATURE SCOPE SPECIFICATION (SCOPE)

### 1. Habit Management (F1)

- **Scope:** Full CRUD capabilities for habit management.
- **Data Attributes:** Habit name, category (Health, Study, Work, Mindfulness, Other), frequency (Daily or specific days of the week), daily target count, priority (Low/Medium/High), and status (Active/Paused/Archived).
- **UI Highlight:** Visually highlight habits that have missed check-ins for the current day.

### 2. Daily Check-in Tracking (F2)

- **Scope:** Real-time logging of habit execution.
- **Mechanisms:** Quick Toggle for simple habits (1 time/day) and Multi-Count Dialog for quantitative habits (e.g., drinking water, reading books). Prevent future-date check-ins and limit completions to not exceed the daily target.

---

## CHAPTER II: FEATURE SCOPE SPECIFICATION (SCOPE)

### 3. Goals & Progress Rules (F3)

- **Scope:** Automatic progress tracking for long-term habit goals of two types:
  - **Streak Target:** Maintain consecutive streak for $N$ days.
  - **Total Completions:** Achieve a specified total check-in count.
- **Gamification:** Trigger encouraging Toast/Snackbar messages at **80%** progress and a goal-achieved alert dialog at **100%**.

### 4. Dashboard & Analytics (F4)

- **Scope:** Aggregate raw data into visual Key Performance Indicators (KPIs):
  - Per-Habit: Current streak, longest streak, total completions, and 7-day completion rate.
  - Overall: Completion % for today, active habits count, and an At-Risk banner warning for habits about to break their streaks.

---

## CHAPTER III: SYSTEM ARCHITECTURE & STATE MANAGEMENT

### 1. Centralized State Management (Zustand Slices Pattern)

- Derived State (Avoid duplicated state): All analytics (streaks, totals, rates, and warnings) are dynamically computed during rendering directly from raw `habits` and `checkins` data, rather than being stored in the state.

![Centralized State Management](images/state_architecture.png)

### 2. Cross-Slice Event Flow

![Cross-Slice Event Flow](images/cross_slice_flow.png)

- **Operational Flow:**
  1. User performs check-in action $\rightarrow$ mutates `checkins` state.
  2. System automatically triggers goal evaluation $\rightarrow$ compares actual progress with target $\rightarrow$ invokes Snackbar alert if 80%/100% threshold is reached.
  3. Dashboard automatically updates calculated KPIs.
  4. Middleware synchronizes the new state with `localStorage`.

### 3. Undo/Reset Mechanism & Data Integrity Constraints

- **Undo Logic:** Bound store maintains a snapshot of the previous check-in state in memory cache. When the "Undo" action is triggered, the store reverts the check-in list to this snapshot.
- **Reset Logic:** Clears all `localStorage` state and reloads the default Seed Data from static JSON files for rapid demonstration.
- **Validation Logic:**
  - Employs **Zod** schema validation for habit and goal creation/update forms.
  - Prevents logical errors (negative values, exceeding daily targets, future-date check-ins).

---

## CHAPTER IV: SOFTWARE DEVELOPMENT STANDARDS

### 1. Team Workflow Constraints

- **Husky Pre-commit hook:** Enforces linting (ESLint), formatting (Prettier), branch naming, and commit message checks prior to code push/commit.
- **Branch Naming Standard:** `type/HH-[Task_Id]-short-name` (e.g., `feature/HH-12-habit-crud`).
- **Commit Message Standard:** `feat(checkins): HH-24 - implement quick toggle (#15)`.

### 2. Source Code Guidelines (Enterprise ESLint Rules)

- No raw string literals in JSX (JSX literals must be extracted to constants/localization).
- No hardcoded Hex/RGB colors (must be fetched via MUI Theme palette).
- No raw `px` or `em` units in `sx` props (must use MUI spacing values or rem).
- Avoid direct imports from MUI root packages (import through shared UI wrapper components).
