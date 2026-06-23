import React, { useState, useRef } from 'react'
import { useBoundStore } from '@/store'
import { TEXTS } from '../constants'
import { SEED_HABITS, SEED_CHECKINS, SEED_GOALS, SEED_NOTES } from '@/storage/seedData'
import { makeCheckinKey } from '@/store/checkinSlice'
import { convertToCSV, convertToHTMLReport } from '../utils/exportHelpers'
import { currentStreak, totalCompletions } from '@/features/dashboard/services'
import type { Habit, Goal, Checkin } from '@/types'

export const useSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dialog confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string
    content: string
    severity?: 'error' | 'warning' | 'info'
    onConfirm: () => void
  } | null>(null)

  const showConfirm = (
    title: string,
    content: string,
    onConfirm: () => void,
    severity?: 'error' | 'warning' | 'info'
  ) => {
    setConfirmConfig({ title, content, onConfirm, severity })
    setConfirmOpen(true)
  }

  const handleConfirmClose = () => {
    setConfirmOpen(false)
  }

  const handleConfirmAction = () => {
    if (confirmConfig) {
      confirmConfig.onConfirm()
    }
    setConfirmOpen(false)
  }

  const handleExportData = (format: 'json' | 'csv' | 'pdf' = 'json') => {
    try {
      const habits = useBoundStore.getState().habits
      const checkins = useBoundStore.getState().checkins
      const goals = useBoundStore.getState().goals

      if (format === 'pdf') {
        const htmlString = convertToHTMLReport(habits, checkins, goals)
        const iframe = document.createElement('iframe')
        iframe.style.position = 'fixed'
        iframe.style.right = '0'
        iframe.style.bottom = '0'
        iframe.style.width = '0'
        iframe.style.height = '0'
        iframe.style.border = '0'
        document.body.appendChild(iframe)

        const doc = iframe.contentWindow?.document || iframe.contentDocument
        if (doc) {
          doc.open()
          doc.write(htmlString)
          doc.close()

          setTimeout(() => {
            if (iframe.contentWindow) {
              iframe.contentWindow.focus()
              iframe.contentWindow.print()
            }
            // Delay removing the iframe to allow browser print task scheduling
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe)
              }
            }, 2000)
          }, 800)
        }
        useBoundStore.getState().showToast('PDF print dialog opened', 'success')
        return
      }

      let blob: Blob
      let filename = `tracex_export_${new Date().toISOString().slice(0, 10)}`

      if (format === 'csv') {
        const csvString = convertToCSV(habits, checkins)
        blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
        filename += '.csv'
      } else {
        const payload = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          data: {
            habits,
            checkins,
            goals,
          },
        }

        const jsonString = JSON.stringify(payload, null, 2)
        blob = new Blob([jsonString], { type: 'application/json' })
        filename += '.json'
      }

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      useBoundStore.getState().showToast(TEXTS.exportSuccess, 'success')
    } catch (e) {
      console.error(e)
      useBoundStore.getState().showToast(TEXTS.exportError, 'error')
    }
  }

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    e.target.value = ''

    if (!file.name.toLowerCase().endsWith('.json')) {
      useBoundStore
        .getState()
        .showToast('Invalid file format: Please select a .json backup file.', 'error')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (!json || typeof json !== 'object') {
          useBoundStore
            .getState()
            .showToast('Invalid backup file: Root must be a JSON object.', 'error')
          return
        }
        if (!json.data || typeof json.data !== 'object') {
          useBoundStore.getState().showToast('Invalid backup file: Missing "data" object.', 'error')
          return
        }

        const { habits, checkins, goals } = json.data
        if (!Array.isArray(habits)) {
          useBoundStore
            .getState()
            .showToast('Invalid backup file: "data.habits" must be a JSON array.', 'error')
          return
        }
        if (typeof checkins !== 'object' || checkins === null) {
          useBoundStore
            .getState()
            .showToast('Invalid backup file: "data.checkins" must be a JSON object.', 'error')
          return
        }
        if (!Array.isArray(goals)) {
          useBoundStore
            .getState()
            .showToast('Invalid backup file: "data.goals" must be a JSON array.', 'error')
          return
        }

        showConfirm(
          TEXTS.importTitleDialog,
          TEXTS.importConfirmWarning,
          () => {
            const notifiedGoals: Record<string, boolean> = {}
            goals.forEach((goal: Goal) => {
              const habit = habits.find((h: Habit) => h.id === goal.habitId)
              if (habit) {
                const checkinList = Object.values(checkins) as unknown as Checkin[]
                const currentValue =
                  goal.targetType === 'streak'
                    ? currentStreak(habit, checkinList)
                    : totalCompletions(habit, checkinList)
                const percentage = Math.round((currentValue / goal.targetValue) * 100)
                if (percentage >= 100) {
                  notifiedGoals[`${goal.id}-completed`] = true
                  notifiedGoals[`${goal.id}-80percent`] = true
                } else if (percentage >= 80) {
                  notifiedGoals[`${goal.id}-80percent`] = true
                }
              }
            })

            useBoundStore.setState({
              habits,
              checkins,
              goals,
              notifiedGoals,
            })
            useBoundStore.getState().showToast(TEXTS.importSuccess, 'success')
          },
          'warning'
        )
      } catch (err) {
        console.error(err)
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to read or parse the backup file'
        useBoundStore.getState().showToast(`JSON Parse Error: ${errorMsg}`, 'error')
      }
    }
    reader.readAsText(file)
  }

  const handleWipeData = () => {
    showConfirm(
      TEXTS.wipeTitleDialog,
      TEXTS.wipeConfirmWarning,
      () => {
        useBoundStore.setState({
          habits: [],
          checkins: {},
          goals: [],
          notes: [],
        })

        useBoundStore.getState().showToast(TEXTS.wipeSuccess, 'success')
      },
      'error'
    )
  }

  const handleLoadSeedData = () => {
    showConfirm(
      TEXTS.seedTitleDialog,
      TEXTS.seedConfirmWarning,
      () => {
        const checkinsRecord = Object.fromEntries(
          SEED_CHECKINS.map((c) => [makeCheckinKey(c.habitId, c.date), c])
        )

        const notifiedGoals: Record<string, boolean> = {}
        SEED_GOALS.forEach((goal) => {
          const habit = SEED_HABITS.find((h) => h.id === goal.habitId)
          if (habit) {
            const currentValue =
              goal.targetType === 'streak'
                ? currentStreak(habit, SEED_CHECKINS)
                : totalCompletions(habit, SEED_CHECKINS)
            const percentage = Math.round((currentValue / goal.targetValue) * 100)
            if (percentage >= 100) {
              notifiedGoals[`${goal.id}-completed`] = true
              notifiedGoals[`${goal.id}-80percent`] = true
            } else if (percentage >= 80) {
              notifiedGoals[`${goal.id}-80percent`] = true
            }
          }
        })

        useBoundStore.setState({
          habits: SEED_HABITS,
          checkins: checkinsRecord,
          goals: SEED_GOALS,
          notes: SEED_NOTES,
          notifiedGoals,
        })
        useBoundStore.getState().showToast(TEXTS.seedSuccess, 'success')
      },
      'info'
    )
  }

  return {
    fileInputRef,
    confirmOpen,
    confirmConfig,
    handleConfirmClose,
    handleConfirmAction,
    handleExportData,
    handleImportClick,
    handleImportData,
    handleWipeData,
    handleLoadSeedData,
  }
}
