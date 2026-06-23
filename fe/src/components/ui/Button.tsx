import React from 'react'
import MuiButton from '@mui/material/Button'
import type { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { APP_CONSTANTS } from '@/constants'
import { pxToRem } from '@/utils'

export interface ButtonProps extends MuiButtonProps {
  loading?: boolean
  component?: React.ElementType
  to?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  disabled,
  startIcon,
  ...props
}) => {
  return (
    <MuiButton
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={pxToRem(16)} color="inherit" /> : startIcon}
      {...props}
    >
      {loading ? APP_CONSTANTS.LOADING : children}
    </MuiButton>
  )
}

export default Button
