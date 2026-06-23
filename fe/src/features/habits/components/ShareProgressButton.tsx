import React, { useState } from 'react'
import { Button, ShareDialog } from '@/components/ui'
import ShareIcon from '@mui/icons-material/Share'

const SHARE_TEXT = 'Share'

export const ShareProgressButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const shareUrl = `${window.location.origin}/readonly/habits`

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ShareIcon />}
        onClick={() => setIsOpen(true)}
      >
        {SHARE_TEXT}
      </Button>
      <ShareDialog open={isOpen} onClose={() => setIsOpen(false)} shareUrl={shareUrl} />
    </>
  )
}
