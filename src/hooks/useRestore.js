import { useState } from 'react';

export const useRestore = () => {
  const [restoreIsDeleted, setRestoreIsDeleted] = useState(false);

  const handleRestoreChange = () => {
    setRestoreIsDeleted(!restoreIsDeleted);
  };
  return {
    restoreIsDeleted,
    handleRestoreChange,
  };
};
