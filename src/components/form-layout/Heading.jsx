import { Box, IconButton, SvgIcon, Typography } from '@mui/material';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { IconX } from '@tabler/icons-react';
import { Image } from 'components/MiniComponents';
import { BrandLogo } from 'config/icons';

const Heading = (props) => {
  const { image, title, subtitle, handleClose } = props;
  return (
    <Box height={120}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 2,
        }}
      >
        <Box sx={{ objectFit: 'cover' }}>
          <Image
            image={BrandLogo}
            alt="Logo"
            width={60}
            sx={{
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
        </Box>
        <Box>
          <IconButton
            onClick={handleClose}
            size="large"
            sx={{
              mr: 1,
              transition: 'transform 0.3s ease-in-out',
              '&:hover': {
                transform: 'rotate(180deg)',
              },
            }}
          >
            <SvgIcon sx={{ fontSize: '24px' }}>
              <IconX />
            </SvgIcon>
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
        {image && (
          <Image
            image={image}
            alt={`${title} Icon`}
            sx={{
              transition: 'transform 0.5s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
            width={60}
          />
        )}
        <Box textAlign="center">
          <Typography variant="h3">{title}</Typography>
          <Typography variant="body1">{subtitle}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

Heading.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  handleClose: PropTypes.func,
};

export default memo(Heading);
