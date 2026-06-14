import React, { useState, useRef } from 'react'
import { useBoundStore } from '@/store'
import { TEXTS } from '../constants'
import { SEED_HABITS, SEED_CHECKINS, SEED_GOALS } from '@/storage/seedData'
import { makeCheckinKey } from '@/store/checkinSlice'

export const useSettings = () => {
  // General settings state
  const [readOnly, setReadOnly] = useState(
    () => localStorage.getItem('general_read_only') === 'true'
  )

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

  // Handlers for persistence
  const handleReadOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked
    setReadOnly(val)
    localStorage.setItem('general_read_only', String(val))
  }

  const handleExportData = () => {
    try {
      const habits = useBoundStore.getState().habits
      const checkins = useBoundStore.getState().checkins
      const goals = useBoundStore.getState().goals

      const settingsData = {
        general_read_only: localStorage.getItem('general_read_only') || 'false',
      }

      const payload = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        data: {
          habits,
          checkins,
          goals,
          settings: settingsData,
        },
      }

      const jsonString = JSON.stringify(payload, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'tracex_export.json'
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

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (!json || typeof json !== 'object' || !json.data || typeof json.data !== 'object') {
          useBoundStore.getState().showToast(TEXTS.importInvalidError, 'error')
          return
        }

        const { habits, checkins, goals, settings: importedSettings } = json.data
        if (!Array.isArray(habits) || typeof checkins !== 'object' || !Array.isArray(goals)) {
          useBoundStore.getState().showToast(TEXTS.importInvalidError, 'error')
          return
        }

        showConfirm(
          TEXTS.importTitleDialog,
          TEXTS.importConfirmWarning,
          () => {
            useBoundStore.setState({
              habits,
              checkins,
              goals,
            })

            if (importedSettings) {
              if (importedSettings.general_read_only !== undefined) {
                setReadOnly(importedSettings.general_read_only === 'true')
                localStorage.setItem('general_read_only', importedSettings.general_read_only)
              }
            }

            useBoundStore.getState().showToast(TEXTS.importSuccess, 'success')
          },
          'warning'
        )
      } catch (err) {
        console.error(err)
        useBoundStore.getState().showToast(TEXTS.importParseError, 'error')
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
        })

        localStorage.removeItem('general_read_only')
        setReadOnly(false)

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
          SEED_CHECKINS.map((c) => [makeCheckinKey(c.date, c.habitId), c])
        )

        useBoundStore.setState({
          habits: SEED_HABITS,
          checkins: checkinsRecord,
          goals: SEED_GOALS,
        })

        localStorage.removeItem('general_read_only')
        setReadOnly(false)

        useBoundStore.getState().showToast(TEXTS.seedSuccess, 'success')
      },
      'info'
    )
  }

  return {
    readOnly,
    fileInputRef,
    confirmOpen,
    confirmConfig,
    handleConfirmClose,
    handleConfirmAction,
    handleReadOnlyChange,
    handleExportData,
    handleImportClick,
    handleImportData,
    handleWipeData,
    handleLoadSeedData,
  }
}
