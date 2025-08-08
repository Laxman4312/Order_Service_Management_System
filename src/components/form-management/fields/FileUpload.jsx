import { Button, Typography, Box, IconButton, SvgIcon, Zoom } from '@mui/material';
import { IconFileUpload, IconUpload, IconX } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const FileUpload = ({ field, formikProps }) => {
  const { setFieldValue, values, resetForm } = formikProps;
  const { transitions } = useSelector((state) => state.general);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleClearFile = () => {
    fileInputRef.current.value = null;
    setFieldValue(field.name, null);
  };

  useEffect(() => {
    if (resetForm) {
      fileInputRef.current.value = null;
    }
  }, [values]);

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <input
        id={field.name}
        name={field.name}
        type="file"
        ref={fileInputRef}
        accept={field.accept}
        style={{ display: 'none' }}
        onChange={(event) => {
          setFieldValue(field.name, event.currentTarget.files[0]);
        }}
      />
      {!values[field.name] && (
        <Zoom in={transitions}>
          <Box sx={{ mx: 'auto' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<IconUpload />}
              color="primary"
              onClick={handleButtonClick}
            >
              Upload
            </Button>
          </Box>
        </Zoom>
      )}
      {values[field.name] && (
        <Zoom in={transitions}>
          <Box sx={{ userSelect: 'none' }}>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ boxShadow: 1, p: 1, borderRadius: '0.7rem' }}
            >
              <SvgIcon sx={{ fontSize: '2rem', color: '#2744A0' }}>
                <IconFileUpload />
              </SvgIcon>
              <Box
                sx={{ boxShadow: 2, p: 1, m: 0.5, borderRadius: '0.5rem', width: 'fit-content' }}
              >
                <Typography align="center" textTransform="uppercase">
                  {values[field.name]?.name ?? values[field.name]}
                </Typography>
              </Box>
              <IconButton
                onClick={handleClearFile}
                size="large"
                sx={{
                  mr: 1,
                  borderRadius: '50%',
                  transition: 'transform 0.4s ease-in-out',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                <SvgIcon sx={{ fontSize: '1.2rem' }}>
                  <IconX />
                </SvgIcon>
              </IconButton>
            </Box>
          </Box>
        </Zoom>
      )}
    </Box>
  );
};

FileUpload.propTypes = {
  field: PropTypes.object,
  formikProps: PropTypes.object,
};

export default FileUpload;
