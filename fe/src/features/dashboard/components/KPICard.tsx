import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { SvgIconComponent } from '@mui/icons-material'

interface Props {
  label: string
  value: string | number
  icon: SvgIconComponent
  color?: string
  subtitle?: string
}

export function KPICard({ label, value, icon: Icon, color = '#10b981', subtitle }: Props) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {label}
            </Typography>
            <Typography variant="h4" sx={{ color, lineHeight: 1.2, mt: 0.5, fontWeight: 700 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: `${color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ color, fontSize: 24 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
