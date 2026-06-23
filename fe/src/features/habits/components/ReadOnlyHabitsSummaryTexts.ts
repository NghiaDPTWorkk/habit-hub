export const SUMMARY_TEXTS = {
  headerTitle: 'CHAMPION PROGRESS & ACCOMPLISHMENTS',
  levelLabel: (lvl: number, name: string) => `Level ${lvl}: ${name}`,
  rateLabel: (rate: number) => `${rate.toFixed(0)}% Done Today`,
  proclamation: {
    prefix: 'Outstanding! You are currently maintaining ',
    activeText: ' active habits. Today, you have successfully checked in ',
    outOfText: ' out of ',
    completedText: ' habits, which brings your daily completion rate to ',
    suffixText:
      '%. Keep pushing forward to unlock the next level and reinforce your positive routines!',
  },
  levelNames: {
    1: 'Habit Recruit',
    2: 'Consistency Builder',
    3: 'Habit Achiever',
    4: 'Elite Champion',
    5: 'Perfect Habit Legend',
  },
  levelHints: {
    1: 'Reach at least 21% to level up to Builder.',
    2: 'Reach 51% daily completion to become an Achiever.',
    3: 'Reach 81% daily completion to become an Elite Champion.',
    4: 'Reach 100% daily completion to achieve Perfect Legend status!',
    5: 'You have attained the ultimate status! Keep up the legendary performance!',
  },
  badges: {
    dailyTitle: 'Daily Champion',
    dailyDesc: (completed: number, total: number) =>
      `Completed ${completed}/${total} habits today!`,
    streakTitle: 'Streak Master',
    streakDesc: (streak: number) => `Top current streak is ${streak} days!`,
    focusTitle: 'Focus Leader',
    focusDesc: (category: string) => `Strong focus in ${category} habits.`,
  },
  stats: {
    activeHabits: 'Active Habits',
    todayRate: 'Daily Rate',
    totalCheckins: 'Total Completions',
    topStreak: 'Top Streak',
    streakValue: (val: number) => `${val} Days`,
    checkinsValue: (val: number) => `${val} times`,
  },
}
