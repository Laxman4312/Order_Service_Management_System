import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

const useDialogNavigation = (clearFormData) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogType, setDialogType] = useState('Add');
  const navigate = useNavigate();

  const location = useLocation();

  const handleDialogOpen = (type, dialog = 'dialog') => {
    window.history.pushState(null, '', `${location.pathname}?${dialog}=true`);
    setDialogType(type);
    setIsOpen(!isOpen);
  };

  const handleDialogClose = () => {
    window.history.replaceState(null, '', location.pathname);
    if (typeof clearFormData === 'function') {
      clearFormData();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handlePopstate = () => {
      if (isOpen) {
        handleDialogClose();
      } else {
        navigate(-1);
      }
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [isOpen, navigate]);

  return { isOpen, dialogType, handleDialogOpen, handleDialogClose };
};

export default useDialogNavigation;
