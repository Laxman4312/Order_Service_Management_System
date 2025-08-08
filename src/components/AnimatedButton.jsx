import React from 'react';
import { LightTooltip } from './Tooltip';
import { Button, Zoom } from '@mui/material';

const AnimatedButton = (props) => {
  const {
    title,
    transitions,
    buttonName,
    startIcon,
    endIcon,
    handleChange,
    variant,
    color,
    size,
    disabled,
    sx,
    autoFocus = false,
  } = props;
  return (
    <LightTooltip title={title} TransitionComponent={Zoom} TransitionProps={{ timeout: 350 }}>
      <Zoom
        in={transitions}
        style={{ transitionDelay: '400ms' }}
        {...(transitions ? { timeout: 500 } : {})}
      >
        <Button
          variant={variant || 'contained'}
          color={color || 'primary'}
          size={size || 'medium'}
          startIcon={startIcon}
          endIcon={endIcon}
          onClick={handleChange}
          disabled={disabled}
          sx={{ ...(sx || {}) }}
          autoFocus={autoFocus}
        >
          {buttonName}
        </Button>
      </Zoom>
    </LightTooltip>
  );
};

export default AnimatedButton;
