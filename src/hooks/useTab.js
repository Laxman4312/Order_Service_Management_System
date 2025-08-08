import { useState } from 'react';

export const useTab = (initialValue = '') => {
  const [tabValue, setTabValue] = useState(initialValue);

  const handleTabChange = (event, value) => {
    setTabValue(value);
  };
  return {
    tabValue,
    handleTabChange,
  };
};
