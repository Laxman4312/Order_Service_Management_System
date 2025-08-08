import { Box, Typography, Stack, Zoom } from '@mui/material';
import Loader from './loader/Loader';
import { useSelector } from 'react-redux';

const LoadingBox = (props) => {
  const { message } = props;
  const { transitions } = useSelector((state) => state.general);
  return (
    <Zoom
      in={transitions}
      style={{ transitionDelay: '400ms' }}
      {...(transitions ? { timeout: 500 } : {})}
    >
      <Box display="grid" sx={{ placeItems: 'center', height: '45vh' }}>
        <Box
          columnGap={2}
          display="flex"
          alignItems="center"
          sx={{ p: '1rem', boxShadow: 1, borderRadius: '0.6rem' }}
        >
          <Loader />
          <Stack spacing={0.5} textAlign="center" color="black" sx={{ userSelect: 'none' }}>
            <Typography variant="h4">{message}</Typography>
            <Typography variant="body1">Please wait!</Typography>
          </Stack>
        </Box>
      </Box>
    </Zoom>
  );
};
export default LoadingBox;
