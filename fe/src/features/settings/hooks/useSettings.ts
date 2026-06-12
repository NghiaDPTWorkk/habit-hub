import React, { useState, useRef } from 'react'
import { useBoundStore } from '@/store'
import { TEXTS } from '../constants'
import { SEED_HABITS, SEED_CHECKINS, SEED_GOALS } from '@/storage/seedData'
import { makeCheckinKey } from '@/store/checkinSlice'

export const useSettings = () => {
  // Account Profile state
  const [fullName, setFullName] = useState(
    () => localStorage.getItem('profile_full_name') || 'Dương Nghĩa'
  )
  const [email, setEmail] = useState(
    () => localStorage.getItem('profile_email') || 'trnghia@example.com'
  )
  const [subTier, setSubTier] = useState(
    () => localStorage.getItem('profile_sub_tier') || 'Premium Plan (Active)'
  )

  // General settings state
  const [readOnly, setReadOnly] = useState(
    () => localStorage.getItem('general_read_only') === 'true'
  )
  const [timezone, setTimezone] = useState(
    () => localStorage.getItem('general_timezone') || 'GMT+7 (Default)'
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handlers for persistence
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setFullName(val)
    localStorage.setItem('profile_full_name', val)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setEmail(val)
    localStorage.setItem('profile_email', val)
  }

  const handleSubTierChange = (e: { target: { value: string } }) => {
    const val = e.target.value
    setSubTier(val)
    localStorage.setItem('profile_sub_tier', val)
  }

  const handleReadOnlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked
    setReadOnly(val)
    localStorage.setItem('general_read_only', String(val))
  }

  const handleTimezoneChange = (e: { target: { value: string } }) => {
    const val = e.target.value
    setTimezone(val)
    localStorage.setItem('general_timezone', val)
  }

  const handleExportData = () => {
    try {
      const habits = useBoundStore.getState().habits
      const checkins = useBoundStore.getState().checkins
      const goals = useBoundStore.getState().goals

      const settingsData = {
        profile_full_name: localStorage.getItem('profile_full_name') || 'Trần Nghĩa',
        profile_email: localStorage.getItem('profile_email') || 'trnghia@example.com',
        profile_sub_tier: localStorage.getItem('profile_sub_tier') || 'Premium Plan (Active)',
        general_read_only: localStorage.getItem('general_read_only') || 'false',
        general_timezone: localStorage.getItem('general_timezone') || 'GMT+7 (Default)',
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

        const confirmed = window.confirm(TEXTS.importConfirmWarning)
        if (!confirmed) return

        useBoundStore.setState({
          habits,
          checkins,
          goals,
        })

        if (importedSettings) {
          if (importedSettings.profile_full_name !== undefined) {
            setFullName(importedSettings.profile_full_name)
            localStorage.setItem('profile_full_name', importedSettings.profile_full_name)
          }
          if (importedSettings.profile_email !== undefined) {
            setEmail(importedSettings.profile_email)
            localStorage.setItem('profile_email', importedSettings.profile_email)
          }
          if (importedSettings.profile_sub_tier !== undefined) {
            setSubTier(importedSettings.profile_sub_tier)
            localStorage.setItem('profile_sub_tier', importedSettings.profile_sub_tier)
          }
          if (importedSettings.general_read_only !== undefined) {
            setReadOnly(importedSettings.general_read_only === 'true')
            localStorage.setItem('general_read_only', importedSettings.general_read_only)
          }
          if (importedSettings.general_timezone !== undefined) {
            setTimezone(importedSettings.general_timezone)
            localStorage.setItem('general_timezone', importedSettings.general_timezone)
          }
        }

        useBoundStore.getState().showToast(TEXTS.importSuccess, 'success')
      } catch (err) {
        console.error(err)
        useBoundStore.getState().showToast(TEXTS.importParseError, 'error')
      }
    }
    reader.readAsText(file)
  }

  const handleWipeData = () => {
    const confirmed = window.confirm(TEXTS.wipeConfirmWarning)
    if (!confirmed) return

    useBoundStore.setState({
      habits: [],
      checkins: {},
      goals: [],
    })

    localStorage.removeItem('profile_full_name')
    localStorage.removeItem('profile_email')
    localStorage.removeItem('profile_sub_tier')
    localStorage.removeItem('general_read_only')
    localStorage.removeItem('general_timezone')

    setFullName('Trần Nghĩa')
    setEmail('trnghia@example.com')
    setSubTier('Premium Plan (Active)')
    setReadOnly(false)
    setTimezone('GMT+7 (Default)')

    useBoundStore.getState().showToast(TEXTS.wipeSuccess, 'success')
  }

  const handleLoadSeedData = () => {
    const confirmed = window.confirm(TEXTS.seedConfirmWarning)
    if (!confirmed) return

    const checkinsRecord = Object.fromEntries(
      SEED_CHECKINS.map((c) => [makeCheckinKey(c.habitId, c.date), c])
    )

    useBoundStore.setState({
      habits: SEED_HABITS,
      checkins: checkinsRecord,
      goals: SEED_GOALS,
    })

    localStorage.removeItem('profile_full_name')
    localStorage.removeItem('profile_email')
    localStorage.removeItem('profile_sub_tier')
    localStorage.removeItem('general_read_only')
    localStorage.removeItem('general_timezone')

    setFullName('Trần Nghĩa')
    setEmail('trnghia@example.com')
    setSubTier('Premium Plan (Active)')
    setReadOnly(false)
    setTimezone('GMT+7 (Default)')

    useBoundStore.getState().showToast(TEXTS.seedSuccess, 'success')
  }

  return {
    fullName,
    email,
    subTier,
    readOnly,
    timezone,
    fileInputRef,
    handleFullNameChange,
    handleEmailChange,
    handleSubTierChange,
    handleReadOnlyChange,
    handleTimezoneChange,
    handleExportData,
    handleImportClick,
    handleImportData,
    handleWipeData,
    handleLoadSeedData,
  }
}
