import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

interface Props {
  count: number
}

const SESSION_KEY = 'habit-hub:atRiskDismissed'
const VIEW_LABEL = 'View habits'
const DISMISS_LABEL = 'Dismiss'

export function AtRiskBanner({ count }: Props) {
  const navigate = useNavigate()

  if (count === 0) {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }

  if (sessionStorage.getItem(SESSION_KEY) === 'true') return null

  function handleDismiss() {
    sessionStorage.setItem(SESSION_KEY, 'true')
    navigate(0)
  }

  const habitWord = count !== 1 ? 'habits' : 'habit'
  const alertText = `${count} ${habitWord} at risk of breaking a streak — check in today to keep it going!`

  return (
    <Alert
      severity="warning"
      sx={{ mb: 3 }}
      action={
        <>
          <Button color="inherit" size="small" onClick={() => navigate('/habits?status=ACTIVE')}>
            {VIEW_LABEL}
          </Button>
          <Button color="inherit" size="small" onClick={handleDismiss}>
            {DISMISS_LABEL}
          </Button>
        </>
      }
    >
      {alertText}
    </Alert>
  )
}
