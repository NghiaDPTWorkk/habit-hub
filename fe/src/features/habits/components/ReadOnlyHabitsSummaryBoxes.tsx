import React from 'react'
import { Box, Typography, alpha } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'
import type { Habit } from '@/types'

export const BadgeBox: React.FC<{
  icon: React.ReactNode
  title: string
  desc: string
  color: 'success' | 'warning' | 'primary'
}> = ({ icon, title, desc, color }) => (
  <Box
    sx={{
      p: { xs: 2.5, sm: 3.5 },
      borderRadius: pxToRem(20),
      border: '1px solid',
      borderColor: (t) => alpha(t.palette[color].main, 0.2),
      background: (t) =>
        t.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${alpha(t.palette[color].main, 0.12)} 0%, ${alpha(t.palette.background.paper, 0.95)} 100%)`
          : `linear-gradient(135deg, ${alpha(t.palette[color].main, 0.04)} 0%, ${alpha(t.palette.background.paper, 0.95)} 100%)`,
      boxShadow: (t) => `0 ${pxToRem(8)} ${pxToRem(30)} ${alpha(t.palette.common.black, 0.04)}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 2,
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: pxToRem(4),
        bgcolor: (t) => t.palette[color].main,
        opacity: 0.8,
      },
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: (t) => `0 ${pxToRem(16)} ${pxToRem(36)} ${alpha(t.palette[color].main, 0.18)}`,
        borderColor: (t) => t.palette[color].main,
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: pxToRem(56), sm: pxToRem(64) },
        height: { xs: pxToRem(56), sm: pxToRem(64) },
        borderRadius: '50%',
        bgcolor: (t) => alpha(t.palette[color].main, 0.1),
        boxShadow: (t) => `0 0 ${pxToRem(16)} ${alpha(t.palette[color].main, 0.15)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.08)',
        },
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 800,
          color: 'text.primary',
          mb: 0.75,
          fontSize: { xs: pxToRem(16), sm: pxToRem(18) },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          display: 'block',
          minHeight: { xs: 'auto', sm: pxToRem(40) },
          lineHeight: 1.5,
          fontSize: { xs: pxToRem(13), sm: pxToRem(14) },
        }}
      >
        {desc}
      </Typography>
    </Box>
  </Box>
)

export const StatBox: React.FC<{
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
}> = ({ label, value, icon, color }) => (
  <Box
    sx={{
      p: { xs: 2, sm: 2.5 },
      borderRadius: pxToRem(16),
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      boxShadow: (t) => `0 ${pxToRem(4)} ${pxToRem(16)} ${alpha(t.palette.common.black, 0.02)}`,
      display: 'flex',
      flexDirection: { xs: 'row', sm: 'column' },
      alignItems: { xs: 'center', sm: 'flex-start' },
      gap: { xs: 1.5, sm: 2 },
      width: '100%',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (t) => `0 ${pxToRem(8)} ${pxToRem(24)} ${alpha(t.palette.common.black, 0.06)}`,
        borderColor: color,
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: { xs: pxToRem(36), sm: pxToRem(44) },
        height: { xs: pxToRem(36), sm: pxToRem(44) },
        borderRadius: pxToRem(12),
        flexShrink: 0,
        bgcolor: (t) => {
          let resolved = t.palette.primary.main
          if (color === 'success.main') resolved = t.palette.success.main
          else if (color === 'warning.main') resolved = t.palette.warning.main
          else if (color === 'error.main') resolved = t.palette.error.main
          return alpha(resolved, 0.1)
        },
        color: color,
        boxShadow: (t) => {
          let resolved = t.palette.primary.main
          if (color === 'success.main') resolved = t.palette.success.main
          else if (color === 'warning.main') resolved = t.palette.warning.main
          else if (color === 'error.main') resolved = t.palette.error.main
          return `0 0 10px ${alpha(resolved, 0.1)}`
        },
      }}
    >
      {icon}
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          display: 'block',
          fontWeight: 700,
          textTransform: 'uppercase',
          mb: 0.25,
          fontSize: { xs: pxToRem(9), sm: pxToRem(11) },
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 850,
          color: 'text.primary',
          fontSize: { xs: pxToRem(15), sm: pxToRem(20) },
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
)

export const ProclamationHabitList: React.FC<{
  activeHabits: Habit[]
  todayCheckinByHabit: Record<number, { completedCount: number }>
}> = ({ activeHabits, todayCheckinByHabit }) => {
  if (activeHabits.length === 0) return null

  return (
    <Box
      sx={{
        mt: 2.5,
        pt: 2.5,
        borderTop: '1px solid',
        borderColor: (t) => alpha(t.palette.primary.main, 0.1),
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      {activeHabits.map((h) => {
        const checkin = todayCheckinByHabit[h.id]
        const completed = checkin?.completedCount ?? 0
        const isCompleted = completed >= h.targetPerDay
        const inProgress = completed > 0 && completed < h.targetPerDay
        const progressText = `${completed} / ${h.targetPerDay}`

        return (
          <Box key={h.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isCompleted ? (
                <Icons.Check sx={{ color: 'success.main', fontSize: pxToRem(18) }} />
              ) : inProgress ? (
                <Icons.TrendingUp sx={{ color: 'warning.main', fontSize: pxToRem(18) }} />
              ) : (
                <Icons.Remove sx={{ color: 'text.secondary', fontSize: pxToRem(16) }} />
              )}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {h.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                bgcolor: (t) => alpha(t.palette.action.hover, 0.06),
                px: 1,
                py: 0.25,
                borderRadius: pxToRem(4),
              }}
            >
              {progressText}
            </Typography>
            <Box
              sx={{
                fontSize: pxToRem(10),
                fontWeight: 700,
                px: 1.25,
                py: 0.25,
                borderRadius: pxToRem(4),
                bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                color: 'primary.main',
                textTransform: 'uppercase',
              }}
            >
              {h.category}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
