import { Button, Container, Grid, Stack, styled, Typography, useMediaQuery } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { IconInfoOctagon } from '@tabler/icons-react';
import { IconSquareRoundedArrowLeft } from '@tabler/icons-react';
import { AjinkyaLogo, RunTimeIcon } from 'config/icons';
import { Image, ReusableAccordion } from 'components/MiniComponents';
import { useRouteError, useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/system';

// Styled component remains the same
const StyledPre = styled('pre')(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
  overflowX: 'auto',
  maxWidth: '100%',
  maxHeight: '100px',
  color: 'red',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  '&::-webkit-scrollbar': {
    height: '8px',
    width: '0.5rem',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[200],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: '4px',
  },
}));

const ErrorFallback = ({ error }) => {
  const routeError = useRouteError();
  const serverOrRouteError = error ? error : routeError;
  console.log('error', serverOrRouteError);

  const navigate = useNavigate();
  const location = useLocation();
  const downSM = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [expanded, setExpanded] = useState(false);

  // Function to extract error path from stack trace or error object
  const getErrorPath = () => {
    if (serverOrRouteError?.stack) {
      // Try to extract file path from stack trace
      const stackLines = serverOrRouteError.stack.split('\n');
      for (const line of stackLines) {
        // Look for application file paths in the stack trace
        if (line.includes('/src/') || line.includes('/pages/') || line.includes('/components/')) {
          const match = line.match(/\((.*?):\d+:\d+\)/);
          if (match) {
            return match[1];
          }
        }
      }
    }

    // Fallbacks in order of preference
    return (
      serverOrRouteError?.fileName || // If error contains fileName
      serverOrRouteError?.sourceURL || // If error contains sourceURL
      location.pathname
    ); // Current path as last resort
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const resetErrorPage = useCallback(() => {
    setTimeout(() => {
      navigate(-1);
    }, 0);
  }, [navigate]);

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      navigate(-1);
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  const errorPath = getErrorPath();

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', height: '96dvh' }}>
      <Grid container rowSpacing={1.5} justifyContent="center">
        <Grid item xs={12} align="center">
          <Image image={AjinkyaLogo} width={50} alt="Ajinkya Logo" />
        </Grid>
        <Grid item xs={12} align="center">
          <Image image={RunTimeIcon} width={downSM ? 300 : 450} alt="Runtime Error View" />
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button startIcon={<IconSquareRoundedArrowLeft />} onClick={resetErrorPage} size="medium">
            Go Back
          </Button>
          <Button color="primary" size="medium" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
        <Grid item xs={12} align="center">
          <Stack spacing={1}>
            <Typography variant="h5" color="error">
              Error found in:{' '}
              <span
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#A5BFCC',
                  padding: 2,
                  borderRadius: '0.2rem',
                }}
              >
                {errorPath}
              </span>
            </Typography>
            <Typography variant="body1" color="#000000">
              Please contact technical support to resolve this issue!
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={8}>
          <ReusableAccordion
            title="Error Stack"
            icon={<IconInfoOctagon />}
            handleChange={handleChange}
            panelId="panel1"
            expanded={expanded}
          >
            <StyledPre>{serverOrRouteError.message}</StyledPre>
            <StyledPre>{serverOrRouteError.stack}</StyledPre>
          </ReusableAccordion>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ErrorFallback;
