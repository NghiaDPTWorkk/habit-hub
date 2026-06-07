import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const TITLE = '404'
const MESSAGE = 'Page not found.'

export function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        {TITLE}
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>{MESSAGE}</Typography>
    </Box>
  )
}
