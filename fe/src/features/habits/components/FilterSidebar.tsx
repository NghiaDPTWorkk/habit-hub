import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import { useSearchParams } from 'react-router-dom'
import type { Category, Priority, HabitStatus, FrequencyType } from '@/types'
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS, FREQUENCY_LABELS } from '@/types'

const FILTER_TITLE = 'Filters'
const CLEAR_ALL_LABEL = 'Clear all'
const SECTION_CATEGORY = 'Category'
const SECTION_PRIORITY = 'Priority'
const SECTION_STATUS = 'Status'
const SECTION_FREQUENCY = 'Frequency'

const CATEGORIES: Category[] = ['HEALTH', 'STUDY', 'WORK', 'MINDFULNESS', 'OTHER']
const PRIORITIES: Priority[] = ['HIGH', 'MEDIUM', 'LOW']
const STATUSES: HabitStatus[] = ['ACTIVE', 'PAUSED', 'ARCHIVED']
const FREQUENCIES: FrequencyType[] = ['DAILY', 'SPECIFIC_DAYS']

export function FilterSidebar() {
  const [params, setParams] = useSearchParams()

  const category = params.get('category') as Category | null
  const priority = params.get('priority') as Priority | null
  const status = params.get('status') as HabitStatus | null
  const frequencyType = params.get('frequencyType') as FrequencyType | null

  function toggle<T extends string>(key: string, value: T, current: T | null) {
    const next = new URLSearchParams(params)
    if (current === value) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setParams(next, { replace: true })
  }

  function clearAll() {
    setParams({}, { replace: true })
  }

  const hasFilters = Boolean(category || priority || status || frequencyType)

  const headerStyle = {
    variant: 'caption' as const,
    sx: {
      fontWeight: 600,
      color: 'text.secondary',
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
  }

  return (
    <Box sx={{ width: 200, flexShrink: 0 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          {FILTER_TITLE}
        </Typography>
        {hasFilters && (
          <Button size="small" onClick={clearAll} sx={{ fontSize: 11 }}>
            {CLEAR_ALL_LABEL}
          </Button>
        )}
      </Box>

      <Stack spacing={2} divider={<Divider />}>
        <Box>
          <Typography {...headerStyle}>{SECTION_CATEGORY}</Typography>
          <FormGroup>
            {CATEGORIES.map((c) => (
              <FormControlLabel
                key={c}
                control={
                  <Checkbox
                    size="small"
                    checked={category === c}
                    onChange={() => toggle('category', c, category)}
                  />
                }
                label={<Typography variant="body2">{CATEGORY_LABELS[c]}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>

        <Box>
          <Typography {...headerStyle}>{SECTION_PRIORITY}</Typography>
          <FormGroup>
            {PRIORITIES.map((p) => (
              <FormControlLabel
                key={p}
                control={
                  <Checkbox
                    size="small"
                    checked={priority === p}
                    onChange={() => toggle('priority', p, priority)}
                  />
                }
                label={<Typography variant="body2">{PRIORITY_LABELS[p]}</Typography>}
              />
            ))}
          </FormGroup>
        </Box>

        <Box>
          <Typography {...headerStyle}>{SECTION_STATUS}</Typography>
          <RadioGroup
            value={status ?? ''}
            onChange={(e) => toggle('status', e.target.value as HabitStatus, status)}
          >
            {STATUSES.map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{STATUS_LABELS[s]}</Typography>}
              />
            ))}
          </RadioGroup>
        </Box>

        <Box>
          <Typography {...headerStyle}>{SECTION_FREQUENCY}</Typography>
          <RadioGroup
            value={frequencyType ?? ''}
            onChange={(e) =>
              toggle('frequencyType', e.target.value as FrequencyType, frequencyType)
            }
          >
            {FREQUENCIES.map((f) => (
              <FormControlLabel
                key={f}
                value={f}
                control={<Radio size="small" />}
                label={<Typography variant="body2">{FREQUENCY_LABELS[f]}</Typography>}
              />
            ))}
          </RadioGroup>
        </Box>
      </Stack>
    </Box>
  )
}
