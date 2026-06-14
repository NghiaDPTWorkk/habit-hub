import React from 'react'
import { Box, ConfirmDialog, Typography } from '@/components/ui'
import { useSettings } from '../hooks/useSettings'
import { GeneralSettingsCard } from './GeneralSettingsCard'
import { BackupRestoreCard } from './BackupRestoreCard'
import { AdminZoneCard } from './AdminZoneCard'

const PAGE_TITLE = 'Settings & Backups'

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
          {PAGE_TITLE}
        </Typography>
      </Box>
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
    </Box>
  )
}

export default SettingsPage
