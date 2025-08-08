import {
  Box,
  FormControl,
  Checkbox,
  SvgIcon,
  Zoom,
  FormHelperText,
  Stack,
  Alert,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { IconShieldCheckFilled } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import { triggerTransitionsFlag } from 'store/slices/general';
import { useEffect } from 'react';

const CheckBox = (props) => {
  const { field, formikProps } = props;
  const { values, setValues, touched, errors } = formikProps;
  const { transitions } = useSelector((state) => state.general);
  const isChecked = Boolean(values[field.name]);

  useEffect(() => {
    triggerTransitionsFlag();

    return () => {
      triggerTransitionsFlag();
    };
  }, []);

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          width: '100%',
          alignItems: 'center',
          borderRadius: '0.7rem',
          backgroundColor: '#F8FAFC',
          border: `0.5px solid rgba(0, 0, 0, 0.3)`,
        }}
      >
        <FormControl sx={{ width: 'fit-content' }}>
          <Checkbox
            id={field.id}
            name={field.name}
            checked={isChecked}
            onChange={() =>
              setValues((prevValues) => ({
                ...prevValues,
                [field.name]: !isChecked,
              }))
            }
            color="secondary"
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </FormControl>
        <Typography variant="h6">{field.label}</Typography>
        {(values[field.name] === 1 || values[field.name] === true) && (
          <Zoom in={transitions}>
            <SvgIcon sx={{ fontSize: '2rem', color: 'green' }}>
              <IconShieldCheckFilled />
            </SvgIcon>
          </Zoom>
        )}
      </Box>
      {touched[field.name] && errors[field.name] && (
        <FormHelperText error id={`helper-text-${field.name}`}>
          {errors[field.name]}
        </FormHelperText>
      )}
      {field.infoMessage && <Alert severity="info">{field.infoMessage}</Alert>}
    </Stack>
  );
};
CheckBox.propTypes = {
  field: PropTypes.object,
  formikProps: PropTypes.object,
};

export default CheckBox;
