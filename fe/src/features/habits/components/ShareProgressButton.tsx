import React, { useState } from 'react'
import { Button, ShareDialog } from '@/components/ui'
import ShareIcon from '@mui/icons-material/Share'
// LƯU Ý: Mày tự gõ lại đường dẫn import file ShareDialog cho đúng cấu trúc thư mục nha

const SHARE_TEXT = 'Share'

export const ShareProgressButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const shareUrl = `${window.location.origin}/readonly/habits`

  return (
    <>
      {/* Chỉ còn lại đúng cái nút kích hoạt */}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<ShareIcon />}
        onClick={() => setIsOpen(true)}
      >
        {SHARE_TEXT}
      </Button>

      {/* Gọi component có sẵn của dự án ra xài */}
      <ShareDialog open={isOpen} onClose={() => setIsOpen(false)} shareUrl={shareUrl} />
    </>
  )
}
