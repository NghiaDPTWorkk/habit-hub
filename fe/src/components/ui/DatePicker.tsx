import React from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { Dayjs } from 'dayjs'

const SIZE_SMALL = 'small'

export interface DatePickerProps {
  value: Dayjs | null
  onChange: (value: Dayjs | null) => void
  label?: string
  disableFuture?: boolean
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  disableFuture = false,
}) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <MuiDatePicker
      value={value}
      onChange={onChange}
      label={label}
      disableFuture={disableFuture}
      slotProps={{ textField: { size: SIZE_SMALL, fullWidth: true } }}
    />
  </LocalizationProvider>
)
