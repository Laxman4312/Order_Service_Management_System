import { Card, CardContent, Divider, Stack, Typography, Zoom } from '@mui/material';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Image } from './MiniComponents';

const PageLayout = ({ pageIcon, pageTitle, bgColor, children }) => {
  const [onPageLoad, setOnPageLoad] = useState(false);

  useEffect(() => {
    setOnPageLoad(true);
    return () => {
      setOnPageLoad(false);
    };
  }, []);

  return (
    <Card
      sx={{
        height: '85dvh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          width: '0.5rem',
          height: '0.5rem',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '0.5rem',
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          {(pageIcon || pageTitle) && (
            <Zoom in={onPageLoad}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Box
                  display="flex"
                  alignItems="center"
                  gap={3}
                  sx={{
                    userSelect: 'none',
                    p: 1,
                    borderRadius: '0.6rem',
                    border: '0.5px solid rgb(211, 211, 211, 0.5)',
                    width: 'fit-content',
                    background: `linear-gradient(to bottom, ${bgColor} 0%, rgba(112, 119, 161, 0) 100%)`,
                  }}
                >
                  {pageIcon && (
                    <Image
                      image={pageIcon}
                      alt={`${pageTitle} Icon`}
                      width={50}
                      sx={{
                        transition: 'transform 0.5s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    />
                  )}
                  {pageTitle && <Typography variant="h3">{pageTitle}</Typography>}
                </Box>
              </Box>
            </Zoom>
          )}
          {/* <Box>
            <Divider sx={{ mx: { xs: 4, md: 6, lg: 8 } }} />
          </Box> */}
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

PageLayout.propTypes = {
  pageIcon: PropTypes.string,
  pageTitle: PropTypes.string,
  children: PropTypes.node,
};

export default PageLayout;
