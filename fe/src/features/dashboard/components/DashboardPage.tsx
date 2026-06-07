import React from 'react'
import {
  Button,
  Box,
  StatusPill,
  Typography,
  ConfirmDialog,
  ProgressBar,
  Card,
  TextField,
  TextArea,
  DropdownMenu,
  StatCard,
  ShareDialog,
  MiniChart,
  CalendarHeatmap,
} from '@/components/ui'
import { Icons } from '@/components/ui/icons'

const PAGE_TITLE = 'Dashboard Page'
const PAGE_DESC = 'System overview dashboard.'
const BTN_PRIMARY = 'Primary (Purple)'
const BTN_SECONDARY = 'Secondary (Grey)'
const BTN_ERROR = 'Error (Red)'
const BTN_WARNING = 'Warning (Yellow)'
const BTN_SUCCESS = 'Success (Green)'
const BTN_LOADING = 'Loading'
const SECTION_BUTTONS = 'Custom Buttons:'
const SECTION_PILLS = 'Status Pills:'
const SECTION_DIALOGS = 'Confirm Dialog:'
const SECTION_PROGRESS = 'Progress Bars:'
const SECTION_CARDS = 'Custom Cards:'
const SECTION_INPUTS = 'Text Fields:'
const SECTION_TEXTAREA = 'Text Area (Notes):'
const SECTION_DROPDOWN = 'Dropdown Menu (Export):'
const SECTION_STATCARDS = 'Stat Cards:'
const SECTION_SHARE = 'Share Dialog:'
const SECTION_MINICHART = 'Weekly Progress Chart:'
const SECTION_HEATMAP = 'Check-in Activity Grid:'
const BTN_TRIGGER_DIALOG = 'Open Confirm Dialog'
const DIALOG_TITLE = 'Delete Habit'
const DIALOG_CONTENT = 'Are you sure you want to delete this habit? This action cannot be undone.'
const DIALOG_CONFIRM = 'Delete'
const DIALOG_CANCEL = 'Cancel'
const DIALOG_SEVERITY = 'error'

const COLOR_SUCCESS = 'success'
const COLOR_WARNING = 'warning'
const COLOR_ERROR = 'error'

const CARD_TITLE_1 = 'Elevation Card'
const CARD_DESC_1 = 'This card has a subtle shadow elevation and rounded borders.'
const CARD_TITLE_2 = 'Outlined Card'
const CARD_DESC_2 = 'This card has an outlined border style.'
const CARD_VARIANT_OUTLINED = 'outlined'

const INPUT_LABEL = 'Habit Name'
const INPUT_PLACEHOLDER = 'e.g. Drink 2L water'

const TEXTAREA_LABEL = 'Daily Reflection Note'
const TEXTAREA_PLACEHOLDER = 'e.g. Felt focused today, completed all goals.'

const BTN_EXPORT_DATA = 'Export Habit Data'
const EXPORT_JSON_LABEL = 'Export as JSON'
const EXPORT_CSV_LABEL = 'Export as CSV'

const STAT_CARD_TITLE_1 = 'Current Streak'
const STAT_CARD_VALUE_1 = '7 Days'
const STAT_CARD_TREND_1 = '+2 days vs last week'
const STAT_CARD_TITLE_2 = 'Completion Rate'
const STAT_CARD_VALUE_2 = '85%'
const STAT_CARD_TREND_2 = '-3% vs last week'
const TREND_DOWN = 'down'

const BTN_OPEN_SHARE = 'Open Share Dialog'
const SHARE_URL = 'https://habithub.com/share/user_profile'

const CHART_LABEL_HEALTH = 'Health & Fitness'
const CHART_LABEL_WORK = 'Work & Study'
const CHART_LABEL_MIND = 'Mindset & Reading'
const CHART_COLOR_PRIMARY = 'primary'

export const DashboardPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDialogLoading, setIsDialogLoading] = React.useState(false)
  const [isShareOpen, setIsShareOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [textValue, setTextValue] = React.useState('')

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setIsDialogLoading(false)
  }

  const handleConfirmDialog = () => {
    setIsDialogLoading(true)
    setTimeout(() => {
      setIsDialogOpen(false)
      setIsDialogLoading(false)
    }, 1500)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value)
  }

  const handleExportJSON = () => {
    alert(EXPORT_JSON_LABEL)
  }

  const handleExportCSV = () => {
    alert(EXPORT_CSV_LABEL)
  }

  const handleOpenShare = () => {
    setIsShareOpen(true)
  }

  const handleCloseShare = () => {
    setIsShareOpen(false)
  }

  const exportMenuItems = [
    { label: EXPORT_JSON_LABEL, onClick: handleExportJSON },
    { label: EXPORT_CSV_LABEL, onClick: handleExportCSV },
  ]

  const chartData = [
    { label: CHART_LABEL_HEALTH, value: 90, color: COLOR_SUCCESS as 'success' },
    { label: CHART_LABEL_WORK, value: 65, color: CHART_COLOR_PRIMARY as 'primary' },
    { label: CHART_LABEL_MIND, value: 40, color: COLOR_WARNING as 'warning' },
  ]

  const heatmapData = React.useMemo(() => {
    const dataList = []
    const today = new Date()
    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const count = i % 3 === 0 ? 2 : i % 5 === 0 ? 1 : i % 7 === 0 ? 3 : 0
      dataList.push({ date: dateStr, count })
    }
    return dataList
  }, [])

  return (
    <div>
      <h2>{PAGE_TITLE}</h2>
      <p>{PAGE_DESC}</p>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_BUTTONS}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="contained" color="primary">
          {BTN_PRIMARY}
        </Button>

        <Button variant="contained" color="secondary">
          {BTN_SECONDARY}
        </Button>

        <Button variant="contained" color="error">
          {BTN_ERROR}
        </Button>

        <Button variant="contained" color="warning">
          {BTN_WARNING}
        </Button>

        <Button variant="contained" color="success">
          {BTN_SUCCESS}
        </Button>

        <Button variant="contained" color="primary" loading>
          {BTN_LOADING}
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_PILLS}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusPill status="active" />
        <StatusPill status="paused" />
        <StatusPill status="archived" />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_DIALOGS}
      </Typography>
      <Box>
        <Button variant="outlined" color="primary" onClick={handleOpenDialog}>
          {BTN_TRIGGER_DIALOG}
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_PROGRESS}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
        <ProgressBar value={30} />
        <ProgressBar value={75} color={COLOR_SUCCESS} />
        <ProgressBar value={100} color={COLOR_WARNING} />
        <ProgressBar value={45} color={COLOR_ERROR} height={12} />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_STATCARDS}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 800, mb: 3 }}>
        <StatCard
          title={STAT_CARD_TITLE_1}
          value={STAT_CARD_VALUE_1}
          trend={STAT_CARD_TREND_1}
          icon={<Icons.Play />}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <StatCard
          title={STAT_CARD_TITLE_2}
          value={STAT_CARD_VALUE_2}
          trend={STAT_CARD_TREND_2}
          trendDirection={TREND_DOWN}
          icon={<Icons.Check />}
          sx={{ flex: 1, minWidth: 250 }}
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_MINICHART}
      </Typography>
      <Box sx={{ maxWidth: 400, mb: 3 }}>
        <MiniChart data={chartData} />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_HEATMAP}
      </Typography>
      <Box sx={{ mb: 3, overflowX: 'auto', maxWidth: '100%' }}>
        <CalendarHeatmap data={heatmapData} />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_CARDS}
      </Typography>
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', maxWidth: 800 }}>
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {CARD_TITLE_1}
          </Typography>
          <Typography variant="body2">{CARD_DESC_1}</Typography>
        </Card>
        <Card variant={CARD_VARIANT_OUTLINED} sx={{ flex: 1, minWidth: 250 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {CARD_TITLE_2}
          </Typography>
          <Typography variant="body2">{CARD_DESC_2}</Typography>
        </Card>
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_INPUTS}
      </Typography>
      <Box sx={{ maxWidth: 400 }}>
        <TextField
          label={INPUT_LABEL}
          placeholder={INPUT_PLACEHOLDER}
          value={inputValue}
          onChange={handleInputChange}
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_TEXTAREA}
      </Typography>
      <Box sx={{ maxWidth: 400 }}>
        <TextArea
          label={TEXTAREA_LABEL}
          placeholder={TEXTAREA_PLACEHOLDER}
          value={textValue}
          onChange={handleTextChange}
        />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_DROPDOWN}
      </Typography>
      <Box>
        <DropdownMenu label={BTN_EXPORT_DATA} items={exportMenuItems} />
      </Box>

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        {SECTION_SHARE}
      </Typography>
      <Box>
        <Button variant="outlined" color="primary" onClick={handleOpenShare}>
          {BTN_OPEN_SHARE}
        </Button>
      </Box>

      <ConfirmDialog
        open={isDialogOpen}
        title={DIALOG_TITLE}
        content={DIALOG_CONTENT}
        confirmText={DIALOG_CONFIRM}
        cancelText={DIALOG_CANCEL}
        onConfirm={handleConfirmDialog}
        onClose={handleCloseDialog}
        severity={DIALOG_SEVERITY}
        loading={isDialogLoading}
      />

      <ShareDialog open={isShareOpen} onClose={handleCloseShare} shareUrl={SHARE_URL} />
    </div>
  )
}
export default DashboardPage
