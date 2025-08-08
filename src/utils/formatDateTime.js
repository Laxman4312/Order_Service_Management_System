import { parse, isValid } from 'date-fns';

export const formatDateTime = (dateTimeString) => {
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

export const FormatDateWithoutTime = (dateTimeString) => {
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

export const FormatDateWithStyle = (dateTimeString) => {
  if (!dateTimeString) return 'Invalid date';

  let date;

  // Check if the date is in ISO format
  if (!isNaN(Date.parse(dateTimeString))) {
    date = new Date(dateTimeString);
  } else {
    // Try to parse non-ISO formats (DD-MM-YYYY or DD/MM/YYYY)
    const parts = dateTimeString.split(/[-/]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Months are 0-based in JavaScript
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    }
  }

  if (!date || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatExpiryDate = (dateString) => {
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/');
    return `${day}-${month}-${year}`;
  }
  return dateString;
};

export function formatSortExpiryDate(dateString) {
  const formats = ['dd/MM/yyyy', 'dd-MM-yyyy', 'yyyy-MM-dd'];
  for (const format of formats) {
    const parsedDate = parse(dateString, format, new Date());
    if (isValid(parsedDate)) {
      return parsedDate.getTime(); // Returns the time in milliseconds since the Unix Epoch
    }
  }
  return null;
}
