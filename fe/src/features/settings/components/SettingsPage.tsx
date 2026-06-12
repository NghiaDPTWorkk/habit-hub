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

const TEXTS = {
  title: 'Settings & Backups',
  subtitle: 'Export data records and administrative tools',
  profileTitle: 'Account Profile Settings',
  profileSubtitle: 'Manage your personal profile details and subscription plan preferences.',
  fullNameLabel: 'Full Name',
  emailLabel: 'Email Address',
  subTierLabel: 'Subscription Tier',
  subFree: 'Free Tier',
  subPremium: 'Premium Plan (Active)',
  generalTitle: 'General Settings',
  readOnlyTitle: 'Read-only Mode',
  readOnlySubtitle:
    'Hide all habit creation, edit, delete actions, and check-in buttons for safe public sharing.',
  timezoneTitle: 'Timezone Simulation',
  timezoneSubtitle:
    'Shift timezone offset to verify check-in logs consistency under foreign zones.',
  backupTitle: 'Backup & Restore Data',
  backupSubtitle:
    'Export all user database records (Habits, Check-ins, Goals, Notes) from LocalStorage to a local JSON file or import it back.',
  exportBtn: 'Export Data (JSON)',
  importBtn: 'Import Data (JSON)',
  adminTitle: 'Administration & Release Zone',
  adminSubtitle:
    'This application version operates under a Code Freeze status. You can wipe out all local data cache or load seed mockups.',
  wipeBtn: 'Wipe All Data',
  seedBtn: 'Load Demo Seed Data',
  lighthouseText:
    'Lighthouse Performance Audit: Accessibility: 100/100 | Best Practices: 98/100 | Performance: 99/100.',
  tzGmt7: 'GMT+7 (Default)',
  tzGmt0: 'GMT+0 (UTC)',
  tzGmt5: 'GMT-5 (EST)',
  exportSuccess: 'Data exported successfully!',
  exportError: 'Failed to export data, please try again.',
}

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
      </Card>
    </Stack>
  )
}

export default SettingsPage
