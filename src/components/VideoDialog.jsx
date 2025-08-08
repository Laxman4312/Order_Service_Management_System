import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import FormLayout from 'components/form-layout/FormLayout';
import { MediaIcon } from 'config/icons';
import ReactPlayer from 'react-player';
import useDialogNavigation from 'hooks/useDialogNavigation';
import { useSelector } from 'react-redux';

const VideoDialog = () => {
  const { isOpen, mediaId } = useSelector((state) => state.dialog);
  const { handleDialogClose } = useDialogNavigation(isOpen);
  const handleClose = () => {
    handleDialogClose();
  };
  const VIDEO_URL = `http://localhost:5000/api/media/video/${mediaId}`;
  return (
    <>
      <Dialog open={isOpen} fullScreen fullWidth>
        <FormLayout
          isOpen={isOpen}
          image={MediaIcon}
          title="V-SOP"
          //   subtitle={module}
          handleClose={handleClose}
        >
          <DialogContent sx={{ p: 1, m: 0 }}>
            <ReactPlayer
              url={VIDEO_URL}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              style={{ borderRadius: '0.5rem' }}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload',
                  },
                },
              }}
            />
          </DialogContent>
        </FormLayout>
      </Dialog>
    </>
  );
};
export default VideoDialog;
