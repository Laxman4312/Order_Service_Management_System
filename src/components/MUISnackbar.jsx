import PropTypes from 'prop-types';
import { Alert, Fade, Slide, Snackbar } from '@mui/material';

import { memo } from 'react';
import useSnackbarStore from 'hooks/useSnackbarStore';
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const MUISnackbar = () => {
  const { isOpen, config, close } = useSnackbarStore();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    return close();
  };
  return (
    <div>
      <Snackbar
        open={isOpen}
        autoHideDuration={5000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        TransitionComponent={SlideTransition}
        // TransitionComponent={Fade}
        onClose={handleClose}
      >
        <Alert severity={config.severity}>{config.message}</Alert>
      </Snackbar>
    </div>
  );
};

MUISnackbar.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.string,
  severity: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
  message: PropTypes.string,
};

export default memo(MUISnackbar);
