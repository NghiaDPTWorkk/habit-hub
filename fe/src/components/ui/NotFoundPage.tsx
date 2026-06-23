import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, Container, alpha } from '@/components/ui'
import { Button } from '@/components/ui'
import { Icons } from '@/components/ui/icons'
import { pxToRem } from '@/utils'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  // Declare all strings in variables to strictly comply with JSX literals lint checks
  const label404 = '404'
  const titleText = 'Oops! Page Not Found'
  const descriptionText =
    "We can't seem to find the page you're looking for. It might have been moved, deleted, or never existed."
  const buttonLabel = 'Back to Home'

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (t) =>
          `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.08)} 0%, ${alpha(
            t.palette.secondary.main,
            0.08
          )} 100%)`,
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: (t) => alpha(t.palette.background.paper, 0.7),
            backdropFilter: 'blur(20px)',
            border: (t) => `${pxToRem(1)} solid ${alpha(t.palette.divider, 0.1)}`,
            borderRadius: pxToRem(24),
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            boxShadow: (t) =>
              `0 ${pxToRem(24)} ${pxToRem(64)} ${alpha(t.palette.common.black, 0.08)}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative glowing gradient dots in background */}
          <Box
            sx={{
              position: 'absolute',
              top: pxToRem(-50),
              left: pxToRem(-50),
              width: pxToRem(150),
              height: pxToRem(150),
              borderRadius: '50%',
              background: (t) => alpha(t.palette.primary.main, 0.15),
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: pxToRem(-50),
              right: pxToRem(-50),
              width: pxToRem(150),
              height: pxToRem(150),
              borderRadius: '50%',
              background: (t) => alpha(t.palette.secondary.main, 0.15),
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: pxToRem(100), sm: pxToRem(140) },
                fontWeight: 900,
                lineHeight: 1,
                background: (t) =>
                  `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontFamily: (t) => t.typography.fontFamily,
              }}
            >
              {label404}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: 'text.primary',
                fontSize: { xs: pxToRem(20), sm: pxToRem(28) },
              }}
            >
              {titleText}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                mb: 5,
                lineHeight: 1.6,
                fontSize: { xs: pxToRem(14), sm: pxToRem(16) },
              }}
            >
              {descriptionText}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleGoHome}
              startIcon={<Icons.ChevronLeft />}
              sx={{
                borderRadius: pxToRem(50),
                px: 4,
                py: 1.5,
                fontSize: pxToRem(15),
                fontWeight: 700,
                boxShadow: (t) =>
                  `0 ${pxToRem(8)} ${pxToRem(24)} ${alpha(t.palette.primary.main, 0.25)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (t) =>
                    `0 ${pxToRem(12)} ${pxToRem(30)} ${alpha(t.palette.primary.main, 0.35)}`,
                },
              }}
            >
              {buttonLabel}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default NotFoundPage
