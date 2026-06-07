# Habit Tracker: Task Assignment & Schedule

**Project Timeline:** June 8, 2026 (Monday) – June 17, 2026 (Wednesday)  
**Goal:** Complete all development 3 days before the June 20 deadline for integration, testing, and buffer.  
**Tech Stack:** React, TypeScript, Material UI (MUI), Zustand, LocalStorage, React Router  
**Current Status:** Base Structure, Routing, Theme MUI, and Zustand configuration have been successfully set up by Nghĩa.

---

## 1. Team Roles & Responsibilities

* **Dương Phạm Trọng Nghĩa (Lead BA & Project Manager):** Acted as Base Architect (completed base setup). Now serves as Product Owner / Lead BA to ensure business rules are met. Responsible for PR reviews, code quality, and workflow coordination.
* **Lê Ngọc Minh Phương (QA & Deployment):** Responsible for setting up automated pipelines (Vercel/Netlify/GH Pages), writing test cases, continuous manual testing on Staging, and managing final releases.
* **Team Dev (Alrz, Ny, Hạnh, Quỳnh, Như):** Focused on writing UI components with MUI and managing state/logic with Zustand custom hooks.

---

## 2. Detailed Task Breakdown (UI vs. Hooks)

### Feature 1: Habit Management (Core)
* **Members:** Alrz Phuong & Xuân Ny
* **Alrz (Logic Lead):** Write custom hook `useHabitStore` (Zustand) for Habit CRUD and LocalStorage sync. Write scheduling logic (`ScheduleService`) and Zod form validation.
* **Xuân Ny (UI Dev):** Write MUI UI components for `<HabitCard>`, `<HabitFormModal>`, `/habits` page (`<HabitList>` & `<FilterSidebar>`), and `<HabitOverflowMenu>`.

### Feature 2: Check-ins
* **Member:** Hạnh Trần
* **Logic & Store:** Write custom hook `useCheckInStore` (Zustand) for upserting check-ins, future-date guards, and target constraints.
* **UI Components:**
  * Write UI for `<QuickToggle>` inside the Habit Card.
  * Write UI for `<MultiCountModal>` using MUI Sliders.
  * Write UI for `/check-ins` page with MUI DatePicker and `<CheckInRow>`.
  * Support building `<ConfirmDialog>`.

### Feature 3: Goals & Progress
* **Member:** Trúc Quỳnh
* **Logic & Store:** Write custom hook `useGoalStore` (Zustand) for goal management and 80%/100% threshold detection.
* **UI Components:**
  * Write UI for `<GoalPanel>` and `<GoalForm>` in Habit Details.
  * Write UI for `<ProgressBar>` using MUI LinearProgress.
  * Write custom hook/logic for triggering MUI Snackbar notification toasts.

### Feature 4: Dashboard & Analytics
* **Member:** Bảo Như
* **Logic & Utilities:** Write pure utility functions to derive dashboard metrics on the fly (streaks, rates, totals) from Zustand stores.
* **UI Components:**
  * Write UI for `/dashboard` page and top `<KpiCard>` components.
  * Write UI for `<AtRiskBanner>` (MUI Alert), `<CategorySection>` (MUI Accordion), and `<HabitStatsRow>`.
  * Write UI for `<StatusPill>`.

---

## 3. Detailed Schedule (June 8 - June 17)

| Date | Nghĩa (Leader) | Phương (QA & Deploy) | Alrz & Ny (Habits) | Hạnh (Check-ins) | Quỳnh (Goals) | Như (Dashboard) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Mon 8/6** | Brief BA logic & review workflow. | Setup Staging environment & Test Plan. | **Alrz:** hook `useHabitStore`. <br>**Ny:** UI layout for `/habits`. | Hook `useCheckInStore`. | Hook `useGoalStore`. | Write analytics functions. |
| **Tue 9/6** | Review PRs for layout & stores. | Verify staging deployment & test cases. | **Alrz:** Form Validation logic. <br>**Ny:** UI `<HabitCard>` & Form Modal. | UI `<QuickToggle>` & state mapping. | UI `<GoalForm>` & `<ProgressBar>`. | UI `<KpiCard>` & metric wiring. |
| **Wed 10/6** | Cross-review store state updates. | Test Habit creation/edit on staging. | **Alrz:** Bind store data to Form. <br>**Ny:** UI `<FilterSidebar>`. | UI `<MultiCountModal>`. | UI `<GoalPanel>` & progress bar. | UI `<CategorySection>`. |
| **Thu 11/6** | Review validation & check-in business rules. | Test check-in boundary conditions. | **Alrz:** Cross-store validation logic. <br>**Ny:** Finalize `/habits` page. | UI `/check-ins` page + DatePicker. | Hook for threshold snackbar alerts. | UI `<HabitStatsRow>`. |
| **Fri 12/6** | Sync Check-in with Dashboard metrics. | Push initial seed data to staging for E2E test. | MUI Overflow Menu, empty/error UI states. | Configure date-filtering on `/check-ins`. | Fix toast re-triggering bugs. | UI `<AtRiskBanner>` & Dashboard layout. |
| **Sat 13/6 - Sun 14/6** | **Buffer Days** | **Catch-up** | **Independent Refinement** | | | |
| **Mon 15/6** | Conduct BA Acceptance Testing. | Execute E2E Test Phase 1 & log issues. | Fix bugs in Habit Store & logic. | Fix bugs in Check-in workflows. | Fix bugs in Goal Progress display. | Fix dashboard calculation bugs. |
| **Tue 16/6** | Review and approve final bugfix PRs. | Retest resolved bugs & prep Prod build. | Refine MUI component responsiveness. | Refine MUI component responsiveness. | Refine MUI component responsiveness. | Refine MUI component responsiveness. |
| **Wed 17/6** | **FEATURE FREEZE** | Deploy to Production & sign off. | **FEATURE FREEZE** | **FEATURE FREEZE** | **FEATURE FREEZE** | **FEATURE FREEZE** |
