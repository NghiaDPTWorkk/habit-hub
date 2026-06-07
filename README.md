# Habit Hub

A habit tracking web application built with React and Material UI. Track daily habits, log check-ins, set goals, and monitor your progress through a statistics dashboard.

## Features

- **Habit management** — Create, edit, pause, archive, and delete habits with category, frequency, priority, and daily target settings
- **Daily check-ins** — Quick toggle for single-count habits; slider modal for multi-count habits; grouped view by date
- **Goals & achievements** — Set streak or total-completion goals per habit; notifications at 80% and 100% progress
- **Statistics dashboard** — KPI cards (done today, active habits, at-risk, achieved goals), at-risk banner, and per-category breakdown with streak and completion rate stats
- **Filters** — Filter habits by category, priority, status, and frequency
- **Seed data** — Demo data auto-loaded on first boot; reset to seed state at any time via Settings

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 + TypeScript 6 |
| Component library | MUI (Material UI) v9 |
| State / persistence | Zustand v5 + localStorage |
| Routing | React Router v7 |
| Validation | Zod v3 |
| Date utilities | date-fns v4 |
| Build tool | Vite v8 |

## Project Structure

```
habit-hub/
├── docs/               # Requirements and UI mockups
└── fe/                 # Frontend application
    └── src/
        ├── components/ # Shared UI components and layout
        ├── domain/     # AppError and error codes
        ├── features/   # Feature modules (habits, check-ins, goals, dashboard)
        ├── hooks/      # Custom React hooks (useToast)
        ├── router/     # Route definitions
        ├── schemas/    # Zod validation schemas
        ├── services/   # Business logic (HabitsService, CheckInsService, etc.)
        ├── storage/    # Seed data
        ├── store/      # Zustand store slices
        ├── theme/      # MUI theme configuration
        ├── types/      # TypeScript type definitions
        └── utils/      # Date utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm))

### Installation

```bash
# Clone the repository
git clone git@github.com:NghiaDPTWorkk/habit-hub.git
cd habit-hub/fe

# Install dependencies
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency conflict between `eslint-plugin-react@7` and `eslint@10`.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Usage

1. **First boot** — Demo habits and check-ins are loaded automatically so you can explore the app right away.
2. **Create a habit** — Click **New habit** on the Habits page, fill in the form, and submit.
3. **Log a check-in** — On the Habits page, use the circle toggle (single-count) or **+** button (multi-count) on any habit card. Or go to **Check-ins** to view and log by date.
4. **Set a goal** — Expand a habit card and click **Set a goal** to track a streak or total-completion target.
5. **View stats** — Go to **Dashboard** for an overview of today's progress, at-risk habits, and per-category streaks.
6. **Reset data** — Click the settings icon (top right) → **Reset all data** → type `RESET` to restore demo data.
