import {
  SvgIcon,
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import { IconTrash } from '@tabler/icons-react';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteModal, triggerIsSavingFlag } from 'store/slices/general';
import { showSnackbar } from 'store/slices/snackbar';

const DeleteDialog = (props) => {
  const { deleteReducer, title } = props;
  const dispatch = useDispatch();
  const { isSaving, deleteModal, deleteId } = useSelector((state) => state.general);

  const breakPoint = useMediaQuery('(min-width:900px)');
  const variant = breakPoint ? 'h4' : 'h5';
  const handleClose = () => {
    dispatch(closeDeleteModal());
  };
  const handleDelete = async () => {
    const params = {
      id: deleteId,
    };
    try {
      await dispatch(deleteReducer({ params }));
      dispatch(triggerIsSavingFlag(!isSaving));
      dispatch(showSnackbar({ message: 'Deleted Successfully!', severity: 'success' }));
      setTimeout(() => {
        handleClose();
      }, 600);
    } catch (err) {
      dispatch(showSnackbar({ message: err.message ?? 'Error while Deleting', severity: 'error' }));
    }
  };
  return (
    <Dialog open={deleteModal} maxWidth="sm" minwidth="xs">
      <Box sx={{ m: 1 }}>
        <DialogContent>
          <Box display="flex" alignItems="center" justiffy="center" columnGap={2}>
            <SvgIcon sx={{ fontSize: '45px', color: '#ED1C24' }}>
              <IconTrash />
            </SvgIcon>
            <Typography variant={variant}>Delete this {title} ?</Typography>
          </Box>
        </DialogContent>
        <DialogActions spacing={1}>
          <Button color="secondary" onClick={handleDelete}>
            Yes
          </Button>
          <Button color="error" onClick={handleClose}>
            No
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  title: PropTypes.string,
  transitions: PropTypes.bool,
  isSaving: PropTypes.bool,
  deleteReducer: PropTypes.func,
};

export default memo(DeleteDialog);
