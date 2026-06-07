import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'

const RETRY_LABEL = 'Retry'

interface Props {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: Props) {
  return (
    <Box sx={{ py: 4, px: 2 }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              {RETRY_LABEL}
            </Button>
          )
        }
      >
        {message}
      </Alert>
    </Box>
  )
}
