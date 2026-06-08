# COMPREHENSIVE TEST PLAN - HABIT TRACKER PRO

**Dự án** Habit Tracker Pro
**Team**  ByteBuilders
**Người thực hiện** Lê Ngọc Minh Phương

# I. TESTING OBJECTIVES, SCOPE & INFRASTRUCTURE

### 1. Strategic objectives

* **Mandantory module verification:** Ensure 100% functional compliance for the 4 core pillars defined in the Capstone Brief: Habit Management (CRUD), Daily Check-ins, Goals & Progress Rules (80% and 100% threshold states), and the Streaks & Statistics Dashboard.

* **State isolation validation:** Strictly verify the isolation between **Raw State** (primitive arrays stored inside the Zustand store for `habits`, `checkins`, and `goals`) and **Derived State** (dynamically computed values such as active streaks, completion percentages, and risk rates).

* **Persistence guarantee:** Protect the integrity of the data tier synchronized over the browser's `window.localStorage` against schema breakage and improper state mutations.

### 2. Testing scope

* **Centralized border control (Input vadilation):** Structural boundary testing on the shared validator file `src/utils/validation.ts` using specialized `AppError` payloads to prevent invalid data writes.

* **Advanced business logic & Algorithmic state:** Rigorous tracking of temporal calculations, dynamic string generation, and non-volatile history rollbacks (Undo/Reset mechanics).

* **Infrastructure telemetry & Deep-linking:** Automated verification of AWS Amplify continuous deployment pipelines, IAM privilege scoping, and Amazon CloudWatch log and metric alarms.

### 3. Environment & Development spec 

**Staging environment (Development branch)** Dynamically deployed on AWS Amplify with automated Web Previews attached to every open GitHub Pull Request. Used for active E2E testing, boundary validation, and bug logging.

**Production environment (Main branch)** Immutable build locked after Feature Freeze for direct evaluation.

```mermaid
graph TD
    A[Developer Git Push / Merge] -->|Trigger GitHub Webhook| B(AWS Amplify Engine)

    subgraph AWS Security Boundary
        C[AWS IAM Restricted Role] -->|Apply Least Privilege Policy| B
    end

    subgraph Automation & Compilation Pipeline
        B -->|Step 1: Provision Cloud Container| D[Virtual Environment]
        D -->|Step 2: Build Application| E[npm ci && npm run build]
        E -->|Step 3: Deploy Static Assets| F[Amplify Hosting Edge CDN]
    end

    subgraph Infrastructure Governance
        B -->|Stream Live Build & Access Logs| G(Amazon CloudWatch)
        G -->|Trigger Alerts| H[Billing Alarm @ $0.50 / Error Spikes]
    end

    F -->|Secure Client Router Session| I[Live Deployment URL]