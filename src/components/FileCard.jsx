import { Box, Button, Stack, Typography } from '@mui/material';
import { IconCaretRightFilled } from '@tabler/icons-react';
import axios from 'axios';

const FileCard = ({ fileName }) => {
  const handleFileOpen = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sop/files/${fileName.id}/display`, {
        responseType: 'blob',
      });
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error('Error fetching PDF file', error);
    }
  };
  return (
    <Box
      display="flex"
      alignItems="center"
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
        <Stack direction="row" spacing={2} textAlign="left">
          <Typography variant="h3">{fileName.title}</Typography>
          <Box display="flex">
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<IconCaretRightFilled />}
              onClick={handleFileOpen}
            >
              Open
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default FileCard;
