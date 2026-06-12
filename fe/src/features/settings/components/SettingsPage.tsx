import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Stack,
  Button,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { useBoundStore } from '@/store'
import { TEXTS } from '../constants'

export const SettingsPage: React.FC = () => {
  // Account Profile state
  const [fullName, setFullName] = useState(
    () => localStorage.getItem('profile_full_name') || 'Trần Nghĩa'
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

  const fileInputRef = React.useRef<HTMLInputElement>(null)

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

  return (
    <Stack spacing={3} sx={{ maxWidth: 800, mx: 'auto', mt: 1, mb: 4 }}>
      {/* Account Profile Settings Card */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {TEXTS.profileTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {TEXTS.profileSubtitle}
        </Typography>

        <Stack spacing={2.5}>
          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}
            >
              {TEXTS.fullNameLabel}
            </Typography>
            <TextField value={fullName} onChange={handleFullNameChange} fullWidth />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}
            >
              {TEXTS.emailLabel}
            </Typography>
            <TextField value={email} onChange={handleEmailChange} fullWidth />
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}
            >
              {TEXTS.subTierLabel}
            </Typography>
            <FormControl fullWidth size="small">
              <Select value={subTier} onChange={handleSubTierChange} displayEmpty>
                <MenuItem value="Free Tier">{TEXTS.subFree}</MenuItem>
                <MenuItem value="Premium Plan (Active)">{TEXTS.subPremium}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Card>

      {/* General Settings Card */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {TEXTS.generalTitle}
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ pr: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {TEXTS.readOnlyTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {TEXTS.readOnlySubtitle}
              </Typography>
            </Box>
            <Switch checked={readOnly} onChange={handleReadOnlyChange} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {TEXTS.timezoneTitle}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                {TEXTS.timezoneSubtitle}
              </Typography>
            </Box>
            <FormControl sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }} size="small">
              <Select value={timezone} onChange={handleTimezoneChange}>
                <MenuItem value="GMT+7 (Default)">{TEXTS.tzGmt7}</MenuItem>
                <MenuItem value="GMT+0 (UTC)">{TEXTS.tzGmt0}</MenuItem>
                <MenuItem value="GMT-5 (EST)">{TEXTS.tzGmt5}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Card>

      {/* Backup & Restore Data Card */}
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
          {TEXTS.backupTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {TEXTS.backupSubtitle}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Icons.Download />}
            onClick={handleExportData}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 600,
              bgcolor: 'warning.main',
              color: 'warning.contrastText',
              '&:hover': {
                bgcolor: 'warning.dark',
              },
            }}
          >
            {TEXTS.exportBtn}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            startIcon={<Icons.Upload />}
            onClick={handleImportClick}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 600,
            }}
          >
            {TEXTS.importBtn}
          </Button>
        </Stack>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportData}
          accept=".json"
          style={{ display: 'none' }}
        />
      </Card>
    </Stack>
  )
}

export default SettingsPage
