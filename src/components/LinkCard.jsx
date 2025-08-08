import { Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { truncateString } from './MiniComponents';

const LinkCard = ({ linkSerial, link }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      component={Link}
      to={link}
      target="_blank"
      sx={{
        textDecoration: 'none',
        py: 0.6,
        px: 0.8,
        width: 220,
        // boxShadow: 1,
        border: '0.5px solid rgb(211, 211, 211, 0.7)',
        borderRadius: '0.4rem',
        boxSizing: 'border-box',
        gap: 2,
        transition: 'transform 0.5s ease',
        '&:hover': {
          transform: 'scale(1.040)',
          cursor: 'pointer',
        },
      }}
    >
      <Box flexGrow={0}>
        <Box
          height={50}
          width={5.5}
          sx={{
            background: 'linear-gradient(to bottom, #2eadff, #3d83ff, #7e61ff)',
            borderRadius: '0.3rem',
          }}
        />
      </Box>
      <Box flexGrow={1}>
        <Stack spacing={0.7} textAlign="left">
          <Typography variant="h4">Link 0{linkSerial}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {truncateString(link)}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default LinkCard;
