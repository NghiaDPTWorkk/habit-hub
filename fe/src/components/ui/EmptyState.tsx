import React from 'react'
import { Box, Typography, Card } from '@/components/ui'
import { pxToRem } from '@/utils'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { alpha } from '@mui/material/styles'

interface EmptyStateProps {
  message?: string
}

const DEFAULT_MESSAGE = 'Không có dữ liệu nào'

export const EmptyState: React.FC<EmptyStateProps> = ({ message = DEFAULT_MESSAGE }) => {
  return (
    <Card
      sx={{
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'divider',
        textAlign: 'center',
        width: '100%',
        boxShadow: 'none',
        bgcolor: 'transparent',
        py: 6,
        px: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: 1.75,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            display: 'inline-flex',
            color: 'primary.main',
          }}
        >
          <InboxOutlinedIcon sx={{ fontSize: 28 }} />
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: pxToRem(14),
          }}
        >
          {message}
        </Typography>
      </Box>
    </Card>
  )
}
