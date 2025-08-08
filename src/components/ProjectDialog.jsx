import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@mui/material';

const ProjectDialog = (props) => {
  // Added a additional functionality to close the dialog with the Escape button
  const { children, open, maxWidth, handleClose } = props;

  const handleKeyDown = (event = React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };
  return (
    <Dialog open={open} maxWidth={maxWidth} minwidth="xs" onKeyDown={handleKeyDown} fullWidth>
      {children}
    </Dialog>
  );
};

ProjectDialog.propTypes = {
  children: PropTypes.node,
  open: PropTypes.bool,
  maxWidth: PropTypes.string,
  handleClose: PropTypes.func,
};

export default ProjectDialog;
