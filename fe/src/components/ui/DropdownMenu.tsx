import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Button from './Button'

export interface DropdownMenuItem {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

export interface DropdownMenuProps {
  label: string
  items: DropdownMenuItem[]
  buttonVariant?: 'contained' | 'outlined' | 'text'
  buttonColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
  buttonSize?: 'small' | 'medium' | 'large'
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  items,
  buttonVariant = 'outlined',
  buttonColor = 'primary',
  buttonSize = 'small',
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleItemClick = (onClick: () => void) => {
    onClick()
    handleClose()
  }

  return (
    <div>
      <Button variant={buttonVariant} color={buttonColor} size={buttonSize} onClick={handleClick}>
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.map((item, index) => {
          const keyVal = `${item.label}-${index}`
          return (
            <MenuItem key={keyVal} onClick={() => handleItemClick(item.onClick)}>
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}

export default DropdownMenu
