import ServerError from '../assets/images/component-images/server.png';
import { Box, Typography, Zoom } from '@mui/material';
import { Image } from './MiniComponents';
import { useSelector } from 'react-redux';

const ErrorBox = (props) => {
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
          gap={2}
          display="flex"
          alignItems="center"
          sx={{ p: '1rem', boxShadow: 1, borderRadius: '0.6rem', userSelect: 'none' }}
        >
          <Box>
            <Image image={ServerError} alt="Error" width={50} />
          </Box>
          <Typography variant="h4" align="center">
            {message}
          </Typography>
        </Box>
      </Box>
    </Zoom>
  );
};
export default ErrorBox;
