import type { Habit, Goal, Checkin } from '@/types'

export const escapeCsv = (str: string): string => {
  if (!str) return ''
  return str.replace(/"/g, '""')
}

export const convertToCSV = (habits: Habit[], checkins: Record<string, Checkin>): string => {
  let csv = '\uFEFF' // UTF-8 BOM for Excel
  csv += 'Habit ID,Habit Name,Category,Frequency,Priority,Status,Checkin Date,Completed Count\n'

  const checkinList = Object.values(checkins)

  habits.forEach((habit) => {
    const habitCheckins = checkinList.filter((c) => c.habitId === habit.id)
    if (habitCheckins.length === 0) {
      csv += `"${habit.id}","${escapeCsv(habit.name)}","${habit.category}","${habit.frequency}","${habit.priority}","${habit.status}","N/A","0"\n`
    } else {
      const sortedCheckins = [...habitCheckins].sort((a, b) => a.date.localeCompare(b.date))
      sortedCheckins.forEach((c) => {
        csv += `"${habit.id}","${escapeCsv(habit.name)}","${habit.category}","${habit.frequency}","${habit.priority}","${habit.status}","${c.date}","${c.completedCount}"\n`
      })
    }
  })
  return csv
}

export const escapeHtml = (unsafe: string): string => {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const convertToHTMLReport = (
  habits: Habit[],
  checkins: Record<string, Checkin>,
  goals: Goal[]
): string => {
  const todayStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const checkinList = Object.values(checkins)

  const habitsHtml = habits
    .map(
      (h) => `
    <tr>
      <td><strong>${escapeHtml(h.name)}</strong></td>
      <td><span class="badge badge-${h.category.toLowerCase()}">${h.category}</span></td>
      <td>${h.frequency}</td>
      <td><span class="priority-${h.priority.toLowerCase()}">${h.priority}</span></td>
      <td><span class="status-${h.status.toLowerCase()}">${h.status}</span></td>
    </tr>
  `
    )
    .join('')

  const goalsHtml = goals
    .map((g) => {
      const habit = habits.find((h) => h.id === g.habitId)
      const habitName = habit ? habit.name : `Habit #${g.habitId}`
      return `
    <tr>
      <td><strong>${escapeHtml(habitName)}</strong></td>
      <td>${g.targetType === 'streak' ? 'Streak' : 'Total Completions'}</td>
      <td>${g.targetValue}</td>
      <td><span class="status-${g.status}">${g.status}</span></td>
    </tr>
  `
    })
    .join('')

  const checkinsHtml = [...checkinList]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 100)
    .map((c) => {
      const habit = habits.find((h) => h.id === c.habitId)
      const habitName = habit ? habit.name : `Habit #${c.habitId}`
      return `
      <tr>
        <td>${c.date}</td>
        <td><strong>${escapeHtml(habitName)}</strong></td>
        <td>${c.completedCount}</td>
      </tr>
    `
    })
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>TraceX - Habit Hub Progress Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.4;
      color: #333;
      background-color: #fff;
      margin: 0;
      padding: 20px;
    }
    h1 {
      color: #fd7e14;
      border-bottom: 3px solid #fd7e14;
      padding-bottom: 0.5rem;
      margin-top: 0;
      margin-bottom: 1.5rem;
      font-size: 24px;
    }
    h2 {
      color: #495057;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 0.25rem;
      font-size: 16px;
    }
    .meta {
      font-size: 0.85rem;
      color: #6c757d;
      margin-bottom: 1.5rem;
    }
    .stats {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .stat-card {
      flex: 1;
      background: #fafafa;
      border: 1px solid #dee2e6;
      padding: 1rem;
      border-radius: 0.25rem;
      text-align: center;
    }
    .stat-card h3 {
      font-size: 0.75rem;
      color: #6c757d;
      margin: 0 0 0.25rem 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-card p {
      font-size: 1.5rem;
      font-weight: bold;
      color: #fd7e14;
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1.5rem;
      background: #fff;
      font-size: 13px;
    }
    th, td {
      padding: 0.5rem 0.75rem;
      border: 1px solid #dee2e6;
      text-align: left;
    }
    th {
      background-color: #f1f3f5;
      color: #495057;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background-color: #fcfcfc;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 0.25rem;
    }
    .badge-health { background-color: #d4edda; color: #155724; }
    .badge-study { background-color: #cce5ff; color: #004085; }
    .badge-work { background-color: #fff3cd; color: #856404; }
    .badge-mindfulness { background-color: #f8d7da; color: #721c24; }
    .badge-other { background-color: #e2e3e5; color: #383d41; }
    .status-active { color: #28a745; font-weight: bold; }
    .status-paused { color: #ffc107; font-weight: bold; }
    .status-completed { color: #007bff; font-weight: bold; }
    .status-archived { color: #6c757d; font-weight: bold; }
    .priority-high { color: #dc3545; font-weight: bold; }
    .priority-medium { color: #fd7e14; font-weight: bold; }
    .priority-low { color: #28a745; font-weight: bold; }
    .footer {
      margin-top: 2rem;
      font-size: 0.75rem;
      color: #868e96;
      text-align: center;
      border-top: 1px solid #dee2e6;
      padding-top: 0.75rem;
    }
    @media print {
      body {
        padding: 0;
        margin: 0;
        background-color: #fff;
      }
      .stat-card {
        background-color: #fff !important;
        border: 1px solid #ccc;
      }
      th {
        background-color: #e9ecef !important;
      }
      table, tr, td, th {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <h1>Progress Report - TraceX Habit Hub</h1>
  <div class="meta">Report Date: ${todayStr}</div>
  
  <div class="stats">
    <div class="stat-card">
      <h3>Total Habits</h3>
      <p>${habits.length}</p>
    </div>
    <div class="stat-card">
      <h3>Total Check-ins</h3>
      <p>${checkinList.length}</p>
    </div>
    <div class="stat-card">
      <h3>Goals Set</h3>
      <p>${goals.length}</p>
    </div>
  </div>

  <h2>1. Habits List</h2>
  <table>
    <thead>
      <tr>
        <th>Habit Name</th>
        <th>Category</th>
        <th>Frequency</th>
        <th>Priority</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${habitsHtml || '<tr><td colspan="5">No habits data found.</td></tr>'}
    </tbody>
  </table>

  <h2>2. Goals & Milestones</h2>
  <table>
    <thead>
      <tr>
        <th>Goal Title</th>
        <th>Type</th>
        <th>Target Value</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${goalsHtml || '<tr><td colspan="4">No goals found.</td></tr>'}
    </tbody>
  </table>

  <h2>3. Recent Check-in History (Max 100)</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Habit Name</th>
        <th>Completed Count</th>
      </tr>
    </thead>
    <tbody>
      ${checkinsHtml || '<tr><td colspan="3">No check-in history found.</td></tr>'}
    </tbody>
  </table>

  <div class="footer">
    Report generated by TraceX Habit Hub.
  </div>
</body>
</html>
  `
}
