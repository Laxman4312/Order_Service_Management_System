import { TextField, InputAdornment, IconButton, Zoom } from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { LightTooltip } from 'components/Tooltip';
import PropTypes from 'prop-types';
import { memo, useCallback, useState } from 'react';

const CustomTextField = (props) => {
  const { field, formikProps } = props;
  const { values, errors, touched, handleBlur, handleChange } = formikProps;

  // For the Password Text Field
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, []);
  return (
    <TextField
      id={field.id}
      type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
      name={field.name}
      value={values[field.name]}
      onBlur={handleBlur}
      onChange={handleChange}
      disabled={field.disabled ?? false}
      fullWidth
      required={field.required ?? false}
      multiline={field.type === 'multiline'}
      rows={field.type === 'multiline' ? field.rows : 0}
      error={Boolean(touched[field.name] && errors[field.name])}
      InputProps={{
        startAdornment: field.startAdornment && (
          <InputAdornment
            position="start"
            sx={{
              color: Boolean(touched[field.name] && errors[field.name]) ? 'red' : 'none',
            }}
          >
            {field.startAdornment}
          </InputAdornment>
        ),
        ...(field.type === 'password' && {
          endAdornment: (
            <InputAdornment position="end">
              <LightTooltip
                title={showPassword ? 'Hide Password' : 'Show Password'}
                TransitionComponent={Zoom}
                TransitionProps={{ timeout: 350 }}
              >
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </IconButton>
              </LightTooltip>
            </InputAdornment>
          ),
        }),
      }}
      label={field.label}
      sx={{
        '& input[type="number"]': {
          MozAppearance: 'textfield',
          WebkitAppearance: 'textfield',
          appearance: 'textfield',
          '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
            WebkitAppearance: 'none',
          },
        },
      }}
    />
  );
};

CustomTextField.propTypes = {
  field: PropTypes.object,
  formikProps: PropTypes.object,
};

export default memo(CustomTextField);
