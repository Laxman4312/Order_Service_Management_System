import { Box, FormHelperText, InputLabel, Stack, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ColorField = (props) => {
  const { field, formikProps } = props;
  const { handleBlur, handleChange, touched, errors, values } = formikProps;
  return (
    <Stack spacing={1}>
      <InputLabel required>{field.label}</InputLabel>
      <Box alignItems="center" sx={{ display: 'flex', gap: 1 }}>
        <Box flexGrow={0.5}>
          <TextField
            id={field.id}
            name={field.name}
            type="color"
            value={values[field.name]}
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={field.disabled ?? false}
            fullWidth
            error={Boolean(touched[field.name] && errors[field.name])}
          />
        </Box>
        <Box flexGrow={2}>
          <Stack spacing={1}>
            <Box sx={{ border: '0.5px solid #D3D3D3', p: 0.8, borderRadius: '0.2rem' }}>
              {String(values[field.name]).length > 1 && (
                <Typography variant="h6">Selected Color</Typography>
              )}
              <Typography variant={String(values[field.name]).length > 1 ? 'caption' : 'subtitle1'}>
                {values[field.name] || 'Please select a color shade'}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
      {touched[field.name] && errors[field.name] && (
        <FormHelperText error id={`helper-text-${field.name}`}>
          {errors[field.name]}
        </FormHelperText>
      )}
    </Stack>
  );
};

ColorField.propTypes = {
  field: PropTypes.object,
  formikProps: PropTypes.object,
};

export default ColorField;
