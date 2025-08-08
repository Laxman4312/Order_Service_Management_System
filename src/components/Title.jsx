import { Box, IconButton, Stack, SvgIcon, Typography, Zoom } from '@mui/material';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  IconEdit,
  IconEye,
  IconLink,
  IconPlus,
  IconQrcode,
  IconRefresh,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
const Title = (props) => {
  const { title, subtitle, transitions, handleClose } = props;
  return (
    // <Zoom
    //   in={transitions}
    //   style={{ transitionDelay: "400ms" }}
    //   {...(transitions ? { timeout: 500 } : {})}
    // >
    <Box
      height={60}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        m: 1,
        // mt: 2,
        // mb: 1,
        pl: 2,
        // backgroundColor: "#96B6C5",
        // backgroundImage: "linear-gradient(180deg, #8BC6EC 100%, #cddaf5 0%)",
        backgroundColor: '',
        borderRadius: '10px',
        boxShadow: 10,
        color: '#f7f7ff',
        opacity: '0.9',
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h6">{title}</Typography>
        {/* <Typography variant="h6">/</Typography> */}
        <Typography variant="subtitle2">{subtitle}</Typography>
      </Stack>
      {handleClose && (
        <Box>
          <IconButton onClick={handleClose} sx={{ mt: -2, mr: 1 }}>
            <SvgIcon sx={{ color: '#f7f7ff', fontSize: '30px' }}>
              <IconTrash />
            </SvgIcon>
          </IconButton>
        </Box>
      )}
    </Box>
    // </Zoom>
  );
};

Title.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  transitions: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default memo(Title);
