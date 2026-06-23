import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { Box, Typography } from '@/components/ui'
import { pxToRem } from '@/utils'

const LOADING_TEXT = 'Đang tải dữ liệu...'

export const LoadingState: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        gap: 2,
      }}
    >
      <CircularProgress color="primary" size={40} />
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          fontSize: pxToRem(14),
        }}
      >
        {LOADING_TEXT}
      </Typography>
    </Box>
  )
}
