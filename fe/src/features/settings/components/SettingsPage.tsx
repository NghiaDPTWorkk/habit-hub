import React from 'react'
import { Stack, ConfirmDialog } from '@/components/ui'
import { useSettings } from '../hooks/useSettings'
import { AccountProfileCard } from './AccountProfileCard'
import { GeneralSettingsCard } from './GeneralSettingsCard'
import { BackupRestoreCard } from './BackupRestoreCard'
import { AdminZoneCard } from './AdminZoneCard'

export const SettingsPage: React.FC = () => {
  const {
    fullName,
    email,
    subTier,
    readOnly,
    timezone,
    fileInputRef,
    confirmOpen,
    confirmConfig,
    handleConfirmClose,
    handleConfirmAction,
    handleReadOnlyChange,
    handleTimezoneChange,
    handleExportData,
    handleImportClick,
    handleImportData,
    handleWipeData,
    handleLoadSeedData,
  } = useSettings()

  return (
    <Stack spacing={3} sx={{ width: '100%', mt: 1, mb: 4 }}>
      {/* Account Profile Settings Card (Read-only) */}
      <AccountProfileCard fullName={fullName} email={email} subTier={subTier} />

      {/* General Settings Card */}
      <GeneralSettingsCard
        readOnly={readOnly}
        timezone={timezone}
        onReadOnlyChange={handleReadOnlyChange}
        onTimezoneChange={handleTimezoneChange}
      />

      {/* Backup & Restore Data Card */}
      <BackupRestoreCard
        onExportData={handleExportData}
        onImportClick={handleImportClick}
        onImportData={handleImportData}
        fileInputRef={fileInputRef}
      />

      {/* Administration & Release Zone Card */}
      <AdminZoneCard onWipeData={handleWipeData} onLoadSeedData={handleLoadSeedData} />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmConfig?.title || ''}
        content={confirmConfig?.content || ''}
        severity={confirmConfig?.severity}
        onConfirm={handleConfirmAction}
        onClose={handleConfirmClose}
      />
    </Stack>
  )
}

export default SettingsPage
