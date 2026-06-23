import React from 'react'
import Paper from '@mui/material/Paper'
import type { PaperProps } from '@mui/material/Paper'

const ELEVATION_VAL = 1

export interface CardProps extends PaperProps {
  variant?: 'elevation' | 'outlined'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevation',
  elevation = ELEVATION_VAL,
  sx,
  ...props
}) => {
  return (
    <Paper
      variant={variant}
      elevation={variant === 'elevation' ? elevation : 0}
      sx={{
        p: 3,
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}

export default Card
