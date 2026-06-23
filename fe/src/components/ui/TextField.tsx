import React from 'react'
import MuiTextField from '@mui/material/TextField'
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'

export type TextFieldProps = MuiTextFieldProps

export const TextField: React.FC<TextFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  sx,
  ...props
}) => {
  return (
    <MuiTextField
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderRadius: 2,
          },
        },
        ...sx,
      }}
      {...props}
    />
  )
}

export default TextField
