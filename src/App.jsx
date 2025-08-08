import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
// routing
import router from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ConfirmationDialog from 'components/ConfirmationDialogNew';
import { useEffect } from 'react';
import MUISnackbar from 'components/MUISnackbar';
import useSnackbarStore from 'hooks/useSnackbarStore';
import ErrorHandler from 'api/services/errorHandler';
import ErrorFallback from 'views/error/ErrorFallback';

// ==============================|| APP ||============================== //
const RouterErrorBoundary = () => {
  const handleError = (error, errorInfo) => {
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Optional: reset the state of your app here
      }}
      onError={(error, errorInfo) => {
        // Optional: log errors to an error reporting service
        console.error('Error:', error, errorInfo);
      }}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};
const App = () => {
  const customization = useSelector((state) => state.customization);
  const openSnackbar = useSnackbarStore((state) => state.open);

  useEffect(() => {
    ErrorHandler.setNotificationHandler(openSnackbar);
  }, [openSnackbar]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <NavigationScroll>
            <RouterErrorBoundary />
            {/* <RouterProvider router={router} /> */}
          </NavigationScroll>
          <MUISnackbar />
          <ConfirmationDialog />
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
