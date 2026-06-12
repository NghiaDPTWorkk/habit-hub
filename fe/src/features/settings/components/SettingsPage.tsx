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
} from '@/components/ui'

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
    </Stack>
  )
}

export default SettingsPage
