import React from 'react'
import { Box, Stack, ConfirmDialog } from '@/components/ui'
import { useSettings } from '../hooks/useSettings'
import { GeneralSettingsCard } from './GeneralSettingsCard'
import { BackupRestoreCard } from './BackupRestoreCard'
import { AdminZoneCard } from './AdminZoneCard'

export const SettingsPage: React.FC = () => {
  const {
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
  } = useSettings()

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', width: '100%' }}>
      <Stack spacing={3} sx={{ mt: 1, mb: 4 }}>
        {/* General Settings Card */}
        <GeneralSettingsCard readOnly={readOnly} onReadOnlyChange={handleReadOnlyChange} />

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
    </Box>
  )
}

export default SettingsPage
