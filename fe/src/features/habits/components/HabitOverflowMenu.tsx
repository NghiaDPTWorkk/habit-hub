import { useState, type FC, type MouseEvent, type ReactNode } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton } from '@/components/ui'

export interface HabitOverflowMenuItem {
  label: string
  onClick: () => void
  icon?: ReactNode
}

export interface HabitOverflowMenuProps {
  items: HabitOverflowMenuItem[]
}

export const HabitOverflowMenu: FC<HabitOverflowMenuProps> = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleItemClick = (item: HabitOverflowMenuItem) => {
    item.onClick()
    handleClose()
  }

  return (
    <>
      <IconButton size="small" onClick={handleOpen} aria-label="More actions">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {items.map((item, index) => (
          <MenuItem key={`${item.label}-${index}`} onClick={() => handleItemClick(item)}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
