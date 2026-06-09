import React, { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { Box, Typography } from '@/components/ui'
import { DatePicker } from '@/components/ui'
import { pxToRem } from '@/utils'
import { CHECKIN_CONTENT } from '../constants'
import { MOCK_HISTORY } from '../mock'
import { CheckinHistoryCard } from './CheckinHistoryCard'

const VARIANT_H5 = 'h5'
const VARIANT_BODY2 = 'body2'
const VARIANT_BODY1 = 'body1'
const COLOR_TEXT_SECONDARY = 'text.secondary'
const PICKER_LABEL = 'Select date'
const EMPTY_MESSAGE = 'No data found for this date'

export const CheckinsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())

  const dateStr = selectedDate?.format('YYYY-MM-DD') ?? ''
  const records = MOCK_HISTORY[dateStr] ?? []

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant={VARIANT_H5} sx={{ mb: 1 }}>
        {CHECKIN_CONTENT.TITLE}
      </Typography>
      <Typography variant={VARIANT_BODY2} color={COLOR_TEXT_SECONDARY} sx={{ mb: 3 }}>
        {CHECKIN_CONTENT.SUBTITLE}
      </Typography>

      <Box sx={{ mb: 3, maxWidth: pxToRem(256) }}>
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          label={PICKER_LABEL}
          disableFuture
        />
      </Box>

      {records.length === 0 ? (
        <Typography variant={VARIANT_BODY1} color={COLOR_TEXT_SECONDARY}>
          {EMPTY_MESSAGE}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {records.map(({ id, ...rest }) => (
            <CheckinHistoryCard key={id} {...rest} />
          ))}
        </Box>
      )}
    </Box>
  )
}
