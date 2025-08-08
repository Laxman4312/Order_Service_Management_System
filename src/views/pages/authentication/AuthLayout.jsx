import React from 'react';
import { Box, Card, Typography } from '@mui/material';

// components
import PropTypes from 'prop-types';

import { BrandLogo, Favicon } from 'config/icons';
import PageContainer from 'components/container/PageContainer';
import { Image } from 'components/MiniComponents';

const AuthLayout = ({ title, pageTitle, description, children }) => {
  return (
    <PageContainer title={title} description={description}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:before': {
            content: '""',
            background: 'radial-gradient(, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.6',
          },
          height: '100vh',
        }}
      >
        <Card elevation={16} sx={{ p: 3.5, width: '100%', maxWidth: '400px' }}>
          <Box display="flex" alignItems="center" justifyContent="right" sx={{ mt: -2, mr: -2 }}>
            <Image image={Favicon} alt="Thamra Dhatu Impression" width={45} />
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Image image={BrandLogo} alt="Thamra Dhatu Logo" width={140} />
          </Box>
          <Box mb={4}>
            {pageTitle && (
              <Typography fontWeight="600" variant="h3" align="center">
                {pageTitle}
              </Typography>
            )}
          </Box>
          {children}
        </Card>
      </Box>
    </PageContainer>
  );
};

AuthLayout.propTypes = {
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default AuthLayout;
