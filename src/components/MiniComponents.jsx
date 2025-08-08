import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Icon,
  Typography,
} from '@mui/material';
import { IconSquareRoundedArrowDown } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import Logo from 'ui-component/Logo';

export const Image = ({ image, alt, width = 20, sx }) => {
  return (
    <Box sx={{ ...sx }}>
      <img
        src={image}
        alt={alt}
        width={width}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
    </Box>
  );
};

export const FormatDateTime = (dateTimeString) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    hour12: true,
  };
  return new Date(dateTimeString).toLocaleString('en-GB', options);
};

export const formatDateOnly = (dateTimeString) => {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    // hour12: true,
  };
  return new Date(dateTimeString).toLocaleString('en-GB', options);
};
export function truncateString(str) {
  if (str.length <= 25) {
    return str;
  } else {
    return str.slice(0, 25) + '..';
  }
}

// isObjectEmpty Function
export const isObjectEmpty = (obj) => Object.keys(obj).length === 0;

export const scrollBarStyling = {
  '&::-webkit-scrollbar': {
    width: '0.5rem',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: '1rem',
    transition: 'background-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.2)',
    },
    '&:active': {
      backgroundColor: 'rgba(0,0,0,.3)',
    },
  },
};

export const ReusableText = ({ color, heading, value, variant = 'body1' }) => {
  return (
    <Typography variant={variant} color={color}>
      <strong>{heading ?? 'NA'} :</strong> {value ?? 'NA'}
    </Typography>
  );
};

ReusableText.propTypes = {
  heading: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.string,
};

//Field container
export const FieldContainer = ({ children }) => {
  return (
    <Box height={90} display="flex" alignItems="center">
      {children}
    </Box>
  );
};

export const ReusableAccordion = ({ expanded, handleChange, panelId, title, icon, children }) => {
  return (
    <Accordion expanded={expanded === panelId} onChange={handleChange(panelId)}>
      <AccordionSummary
        expandIcon={<IconSquareRoundedArrowDown />}
        aria-controls={`${panelId}-content`}
        id={`${panelId}-header`}
      >
        <Box display="flex" gap={1}>
          <Icon>{icon}</Icon>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

// Capitalize First Letter
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Cookies Expiry Time
const currentDate = new Date();
export const cookieExpiryTime = new Date(currentDate.getTime() + 4 * 60 * 60 * 1000); // 4 hours

// Access Deined Card
export const AccessDeinedCard = ({ moduleName }) => {
  return (
    <Box display="flex" height="70dvh" alignItems="center" justifyContent="center">
      <Card sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
        <Logo width={90} />
        <Typography variant="h5">Access is deined.</Typography>
        <Typography variant="body1">
          Sorry, but you don't have access to {moduleName} Module.
        </Typography>
      </Card>
    </Box>
  );
};
