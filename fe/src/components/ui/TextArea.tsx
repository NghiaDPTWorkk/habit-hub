import React from 'react'
import MuiTextField from '@mui/material/TextField'
import type { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField'

export type TextAreaProps = Omit<MuiTextFieldProps, 'multiline'>

export const TextArea: React.FC<TextAreaProps> = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  rows = 3,
  sx,
  ...props
}) => {
  return (
    <MuiTextField
      multiline
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      rows={rows}
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

export default TextArea
