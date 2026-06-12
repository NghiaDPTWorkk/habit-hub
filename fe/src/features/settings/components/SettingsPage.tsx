import React from 'react'
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
  Divider,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { TEXTS } from '../constants'
import { useSettings } from '../hooks/useSettings'

export const SettingsPage: React.FC = () => {
  const {
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
  } = useSettings()

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

      {/* Administration & Release Zone Card */}
      <Card variant="outlined" sx={{ p: 3, border: '1px solid', borderColor: 'error.light' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main', mb: 0.5 }}>
          {TEXTS.adminTitle}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {TEXTS.adminSubtitle}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleWipeData}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 600,
            }}
          >
            {TEXTS.wipeBtn}
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            onClick={handleLoadSeedData}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.25,
              fontWeight: 600,
            }}
          >
            {TEXTS.seedBtn}
          </Button>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {TEXTS.lighthouseText}
        </Typography>
      </Card>
    </Stack>
  )
}

export default SettingsPage
