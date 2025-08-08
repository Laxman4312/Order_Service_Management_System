import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
import { Image } from './MiniComponents';
import { NoRecordIcon } from 'config/icons';

const NoRecords = (props) => {
  const { title, titleOnlyMessage } = props;
  return (
    <Box sx={{ p: 3 }}>
      <Stack textAlign="center" spacing={1} sx={{ userSelect: 'none' }}>
        <Box>
          <Image image={NoRecordIcon} alt="Error" width={75} />
        </Box>
        <Typography variant="h4">No records found !</Typography>
        {title && (
          <Typography variant="body1">
            Click on the <strong> Add</strong> button to add new {title}.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
NoRecords.propTypes = {
  title: PropTypes.string,
};
export default memo(NoRecords);
