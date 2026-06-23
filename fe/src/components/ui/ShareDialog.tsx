import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Button from './Button'
import TextField from './TextField'
import { useBoundStore } from '@/store'

const DIALOG_TITLE = 'Share Progress'
const HELPER_TEXT = 'Copy the link below to share your progress with others:'
const BTN_COPY = 'Copy'
const BTN_COPIED = 'Copied!'
const BTN_CLOSE = 'Close'
const DIALOG_MAX_WIDTH_SM = 'sm'
const BUTTON_COLOR_SECONDARY = 'secondary'
const BUTTON_COLOR_SUCCESS = 'success'
const BUTTON_VARIANT_CONTAINED = 'contained'
const BUTTON_COLOR_PRIMARY = 'primary'
const TOAST_SUCCESS_MSG = 'Copied to clipboard!'

export interface ShareDialogProps {
  open: boolean
  onClose: () => void
  shareUrl: string
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, shareUrl }) => {
  const [copied, setCopied] = React.useState(false)
  const showToast = useBoundStore((state) => state.showToast)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      showToast(TOAST_SUCCESS_MSG, 'success')
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.warn(err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={DIALOG_MAX_WIDTH_SM}>
      <DialogTitle>{DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{HELPER_TEXT}</DialogContentText>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            value={shareUrl}
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
            fullWidth
          />
          <Button
            variant={BUTTON_VARIANT_CONTAINED}
            color={copied ? BUTTON_COLOR_SUCCESS : BUTTON_COLOR_PRIMARY}
            onClick={handleCopy}
            sx={{ minWidth: 80, height: 40 }}
          >
            {copied ? BTN_COPIED : BTN_COPY}
          </Button>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color={BUTTON_COLOR_SECONDARY}>
          {BTN_CLOSE}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShareDialog
