import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useMultiDialogNavigation = (clearFormDataMap = {}) => {
  const [dialogStack, setDialogStack] = useState([]);
  const [dialogStates, setDialogStates] = useState({});
  const [dialogData, setDialogData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const updateURL = (stack) => {
    const searchParams = new URLSearchParams(location.search);

    for (const [key] of searchParams.entries()) {
      if (key.endsWith('_dialog')) {
        searchParams.delete(key);
      }
    }

    stack.forEach((dialogId) => {
      searchParams.set(dialogId, 'true');
    });

    const newSearch = searchParams.toString();
    return `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
  };

  const handleDialogOpen = (dialogId, dialogType = 'Add', data = null) => {
    const newStack = [...dialogStack, dialogId];
    window.history.pushState({ dialogStack: newStack }, '', updateURL(newStack));

    setDialogStack(newStack);
    setDialogStates((prev) => ({
      ...prev,
      [dialogId]: { isOpen: true, dialogType },
    }));

    if (data) {
      setDialogData((prev) => ({
        ...prev,
        [dialogId]: data,
      }));
    }
  };

  const handleDialogClose = (dialogId) => {
    const dialogIndex = dialogStack.indexOf(dialogId);
    if (dialogIndex === -1) return;

    const newStack = dialogStack.slice(0, dialogIndex);
    window.history.replaceState({ dialogStack: newStack }, '', updateURL(newStack));

    if (typeof clearFormDataMap[dialogId] === 'function') {
      clearFormDataMap[dialogId]();
    }

    const updatedStates = { ...dialogStates };
    const updatedData = { ...dialogData };

    dialogStack.slice(dialogIndex).forEach((id) => {
      updatedStates[id] = { isOpen: false, dialogType: null };
      delete updatedData[id];

      if (typeof clearFormDataMap[id] === 'function') {
        clearFormDataMap[id]();
      }
    });

    setDialogStack(newStack);
    setDialogStates(updatedStates);
    setDialogData(updatedData);
  };

  const clearAllDialogs = () => {
    setDialogStack([]);
    setDialogStates({});
    setDialogData({});
  };

  useEffect(() => {
    const handlePopstate = (event) => {
      const previousStack = event.state?.dialogStack || [];

      if (previousStack.length < dialogStack.length) {
        const dialogToClose = dialogStack[dialogStack.length - 1];
        handleDialogClose(dialogToClose);
      } else if (dialogStack.length === 0 && previousStack.length === 0) {
        navigate(-1);
      } else {
        setDialogStack(previousStack);
        const newStates = {};
        previousStack.forEach((dialogId) => {
          newStates[dialogId] = {
            isOpen: true,
            dialogType: dialogStates[dialogId]?.dialogType || 'Add',
          };
        });
        setDialogStates(newStates);
      }
    };

    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, [dialogStack, dialogStates, navigate]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const initialStack = [];
    const initialStates = {};

    for (const [key, value] of searchParams.entries()) {
      if (value === 'true' && key.endsWith('_dialog')) {
        initialStack.push(key);
        initialStates[key] = { isOpen: true, dialogType: 'Add' };
      }
    }

    setDialogStack(initialStack);
    setDialogStates(initialStates);
  }, [location.search]);

  const getDialogState = (dialogId) => ({
    isOpen: dialogStates[dialogId]?.isOpen || false,
    dialogType: dialogStates[dialogId]?.dialogType || 'Add',
    data: dialogData[dialogId] || null,
  });

  return {
    getDialogState,
    handleDialogOpen,
    handleDialogClose,
    clearAllDialogs,
    dialogStack,
  };
};

export default useMultiDialogNavigation;

// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const LOCAL_STORAGE_KEY = 'dialogState_';

// const useMultiDialogNavigation = (clearFormDataMap = {}, options = { persistData: true }) => {
//   const [dialogStack, setDialogStack] = useState([]);
//   const [dialogStates, setDialogStates] = useState({});
//   const [dialogData, setDialogData] = useState({});
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Initialize from localStorage on mount
//   useEffect(() => {
//     if (options.persistData) {
//       const savedDialogStack = localStorage.getItem(`${LOCAL_STORAGE_KEY}stack`);
//       const savedDialogStates = localStorage.getItem(`${LOCAL_STORAGE_KEY}states`);
//       const savedDialogData = localStorage.getItem(`${LOCAL_STORAGE_KEY}data`);

//       if (savedDialogStack) setDialogStack(JSON.parse(savedDialogStack));
//       if (savedDialogStates) setDialogStates(JSON.parse(savedDialogStates));
//       if (savedDialogData) setDialogData(JSON.parse(savedDialogData));
//     }
//   }, [options.persistData]);

//   // Persist to localStorage when state changes
//   useEffect(() => {
//     if (options.persistData) {
//       if (dialogStack.length > 0) {
//         localStorage.setItem(`${LOCAL_STORAGE_KEY}stack`, JSON.stringify(dialogStack));
//         localStorage.setItem(`${LOCAL_STORAGE_KEY}states`, JSON.stringify(dialogStates));
//         localStorage.setItem(`${LOCAL_STORAGE_KEY}data`, JSON.stringify(dialogData));
//       } else {
//         localStorage.removeItem(`${LOCAL_STORAGE_KEY}stack`);
//         localStorage.removeItem(`${LOCAL_STORAGE_KEY}states`);
//         localStorage.removeItem(`${LOCAL_STORAGE_KEY}data`);
//       }
//     }
//   }, [dialogStack, dialogStates, dialogData, options.persistData]);

//   const updateURL = (stack) => {
//     const searchParams = new URLSearchParams(location.search);

//     // Clear all existing dialog params
//     for (const [key] of searchParams.entries()) {
//       if (key.endsWith('_dialog')) {
//         searchParams.delete(key);
//       }
//     }

//     // Add current stack to URL
//     stack.forEach((dialogId) => {
//       searchParams.set(dialogId, 'true');
//     });

//     const newSearch = searchParams.toString();
//     return `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
//   };

//   const handleDialogOpen = (dialogId, dialogType = 'Add', data = null) => {
//     // Add new dialog to stack
//     const newStack = [...dialogStack, dialogId];

//     // Update browser history
//     window.history.pushState({ dialogStack: newStack }, '', updateURL(newStack));

//     // Update state
//     setDialogStack(newStack);
//     setDialogStates((prev) => ({
//       ...prev,
//       [dialogId]: { isOpen: true, dialogType },
//     }));

//     // Store associated data if provided
//     if (data) {
//       setDialogData((prev) => ({
//         ...prev,
//         [dialogId]: data,
//       }));
//     }
//   };

//   const handleDialogClose = (dialogId) => {
//     // Find the index of the dialog to close
//     const dialogIndex = dialogStack.indexOf(dialogId);
//     if (dialogIndex === -1) return;

//     // Remove the closed dialog and all dialogs that were opened after it
//     const newStack = dialogStack.slice(0, dialogIndex);

//     // Update URL and history
//     window.history.replaceState({ dialogStack: newStack }, '', updateURL(newStack));

//     // Clear form data if cleanup function exists
//     if (typeof clearFormDataMap[dialogId] === 'function') {
//       clearFormDataMap[dialogId]();
//     }

//     // Close this dialog and all child dialogs
//     const updatedStates = { ...dialogStates };
//     const updatedData = { ...dialogData };

//     dialogStack.slice(dialogIndex).forEach((id) => {
//       updatedStates[id] = { isOpen: false, dialogType: null };
//       delete updatedData[id];

//       if (typeof clearFormDataMap[id] === 'function') {
//         clearFormDataMap[id]();
//       }
//     });

//     setDialogStack(newStack);
//     setDialogStates(updatedStates);
//     setDialogData(updatedData);
//   };

//   const clearAllDialogs = () => {
//     setDialogStack([]);
//     setDialogStates({});
//     setDialogData({});
//     if (options.persistData) {
//       localStorage.removeItem(`${LOCAL_STORAGE_KEY}stack`);
//       localStorage.removeItem(`${LOCAL_STORAGE_KEY}states`);
//       localStorage.removeItem(`${LOCAL_STORAGE_KEY}data`);
//     }
//   };

//   useEffect(() => {
//     const handlePopstate = (event) => {
//       const previousStack = event.state?.dialogStack || [];

//       if (previousStack.length < dialogStack.length) {
//         // Close the most recently opened dialog
//         const dialogToClose = dialogStack[dialogStack.length - 1];
//         handleDialogClose(dialogToClose);
//       } else if (dialogStack.length === 0 && previousStack.length === 0) {
//         // If no dialogs are open and we're going back, navigate away
//         navigate(-1);
//       } else {
//         // Sync state with history state
//         setDialogStack(previousStack);
//         const newStates = {};
//         previousStack.forEach((dialogId) => {
//           newStates[dialogId] = {
//             isOpen: true,
//             dialogType: dialogStates[dialogId]?.dialogType || 'Add',
//           };
//         });
//         setDialogStates(newStates);
//       }
//     };

//     window.addEventListener('popstate', handlePopstate);
//     return () => window.removeEventListener('popstate', handlePopstate);
//   }, [dialogStack, dialogStates, navigate]);

//   // Initialize dialog states from URL on mount
//   useEffect(() => {
//     const searchParams = new URLSearchParams(location.search);
//     const initialStack = [];
//     const initialStates = {};

//     for (const [key, value] of searchParams.entries()) {
//       if (value === 'true' && key.endsWith('_dialog')) {
//         initialStack.push(key);
//         initialStates[key] = { isOpen: true, dialogType: 'Add' };
//       }
//     }

//     setDialogStack(initialStack);
//     setDialogStates(initialStates);
//   }, [location.search]);

//   const getDialogState = (dialogId) => ({
//     isOpen: dialogStates[dialogId]?.isOpen || false,
//     dialogType: dialogStates[dialogId]?.dialogType || 'Add',
//     data: dialogData[dialogId] || null,
//   });

//   return {
//     getDialogState,
//     handleDialogOpen,
//     handleDialogClose,
//     clearAllDialogs,
//     dialogStack,
//   };
// };

// export default useMultiDialogNavigation;
