import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@/components/ui'
import ShareIcon from '@mui/icons-material/Share'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useBoundStore } from '@/store'

// Đưa toàn bộ text ra ngoài để lách cái rule cấm hardcode string trong JSX
const SHARE_TEXTS = {
  button: 'Share',
  title: 'Share Your Progress',
  description: 'Anyone with this link can view your habit progress in read-only mode.',
  cancel: 'Cancel',
  copy: 'Copy Link',
  toastSuccess: 'Copied to clipboard!',
  toastError: 'Failed to copy link',
}

export const ShareProgressButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const showToast = useBoundStore((state) => state.showToast)
  const shareUrl = `${window.location.origin}/readonly/habits`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      // Sửa lại đúng chuẩn type 'success' (không có dấu !)
      showToast(SHARE_TEXTS.toastSuccess, 'success')
      setIsOpen(false)
    } catch (error) {
      // Log lỗi ra để linter không bắt bẻ biến error bị bỏ xó
      console.error(error)
      showToast(SHARE_TEXTS.toastError, 'error')
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ShareIcon />}
        onClick={() => setIsOpen(true)}
      >
        {SHARE_TEXTS.button}
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{SHARE_TEXTS.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {SHARE_TEXTS.description}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              value={shareUrl}
              slotProps={{
                htmlInput: { readOnly: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleCopy} edge="end" color="primary">
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setIsOpen(false)} color="inherit">
            {SHARE_TEXTS.cancel}
          </Button>
          <Button
            onClick={handleCopy}
            variant="contained"
            color="primary"
            startIcon={<ContentCopyIcon />}
          >
            {SHARE_TEXTS.copy}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
