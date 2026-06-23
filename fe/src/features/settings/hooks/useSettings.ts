import React, { useState, useRef } from 'react'
import { useBoundStore } from '@/store'
import { TEXTS } from '../constants'
import { SEED_HABITS, SEED_CHECKINS, SEED_GOALS } from '@/storage/seedData'
import { makeCheckinKey } from '@/store/checkinSlice'
import { convertToCSV, convertToHTMLReport } from '../utils/exportHelpers'

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

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (!json || typeof json !== 'object' || !json.data || typeof json.data !== 'object') {
          useBoundStore.getState().showToast(TEXTS.importInvalidError, 'error')
          return
        }

        const { habits, checkins, goals } = json.data
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

        useBoundStore.setState({
          habits: SEED_HABITS,
          checkins: checkinsRecord,
          goals: SEED_GOALS,
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
