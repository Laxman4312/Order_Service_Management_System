import React from 'react';
import { Box, Dialog, DialogContent, Typography, Zoom } from '@mui/material';
import FormLayout from 'components/form-layout/FormLayout';
// import { useDispatch, useSelector } from 'react-redux';
import { LinkIcon, NoRecordIcon } from 'config/icons';
import LinkCard from './LinkCard';
import { Image } from './MiniComponents';

const LinkDialog = ({ isOpen, links, handleCloseModal, module }) => {
  const handleClose = () => {
    handleCloseModal();
  };

  let linkSerial = 1;

  return (
    <>
      <Dialog open={isOpen} maxWidth="sm" fullWidth>
        <FormLayout
          isOpen={isOpen}
          image={LinkIcon}
          title="Links"
          subtitle={module}
          handleClose={handleClose}
        >
          <DialogContent sx={{ p: 1, m: 0 }}>
            {links.length > 0 ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={2}
                flexWrap="wrap"
              >
                {links.map((item) => (
                  <LinkCard key={item} linkSerial={linkSerial++} link={item} />
                ))}
              </Box>
            ) : (
              <Zoom in={isOpen}>
                <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                  <Image image={NoRecordIcon} alt="No Links" width={80} />
                  <Typography variant="h5">No links found!</Typography>
                </Box>
              </Zoom>
            )}
          </DialogContent>
        </FormLayout>
      </Dialog>
    </>
  );
};
export default LinkDialog;
