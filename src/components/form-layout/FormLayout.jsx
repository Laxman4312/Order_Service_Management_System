import PropTypes from 'prop-types';
import { Box, Stack, Divider } from '@mui/material';
import Heading from './Heading';

const FormLayout = (props) => {
  const { children, title, image, subtitle, handleClose } = props;
  return (
    <Stack spacing={2} sx={{ overflowX: 'hidden', userSelect: 'none' }}>
      <Heading image={image} title={title} subtitle={subtitle} handleClose={handleClose} />
      <Divider variant="middle" />
      <Box
        sx={{
          p: 2,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '0.5rem',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            borderRadius: '1rem',
          },
        }}
      >
        {children}
      </Box>
    </Stack>
  );
};

FormLayout.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  handleClose: PropTypes.func,
  children: PropTypes.node,
};

export default FormLayout;
