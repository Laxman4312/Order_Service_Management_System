import React from 'react';
import ProjectDialog from './ProjectDialog';
import {
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  SvgIcon,
  Box,
} from '@mui/material';
import { IconChecks, IconRefresh, IconTrash, IconUpload } from '@tabler/icons-react';
import useConfirmationStore from 'hooks/useConfirmationStore';
import AnimatedButton from './AnimatedButton';

const ConfirmationDialog = () => {
  const { isOpen, config, close } = useConfirmationStore();

  const iconMap = {
    restore: IconRefresh,
    delete: IconTrash,
    upload: IconUpload,
    confirm: IconChecks,
  };

  const iconColor = {
    restore: 'info',
    delete: 'error',
    upload: 'info',
    confirm: 'info',
  };

  // Only render icon if type exists and has a valid mapping
  const IconComponent = config?.type ? iconMap[config.type] : undefined;
  const color = config?.type ? iconColor[config.type] ?? 'info' : 'info';

  const handleConfirm = () => {
    if (config?.onConfirm) {
      config.onConfirm();
    }
    close();
  };

  // Default values for optional props
  const {
    maxWidth = 'xs',
    title = '',
    description = '',
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    variant = 'contained',
    color: buttonColor = 'info',
  } = config || {};

  return (
    <ProjectDialog open={isOpen} onClose={close} maxWidth={maxWidth} handleClose={close}>
      <DialogTitle sx={{ userSelect: 'none' }}>{title}</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={1} alignItems="center">
          {IconComponent && (
            <SvgIcon color={color}>
              <IconComponent />
            </SvgIcon>
          )}
          <DialogContentText sx={{ userSelect: 'none' }}>{description}</DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <AnimatedButton
          title={confirmButtonText}
          buttonName={confirmButtonText}
          startIcon={IconComponent ? <IconComponent size={20} /> : null}
          handleChange={handleConfirm}
          variant={variant}
          color={buttonColor}
          size="small"
          transitions={true}
          autoFocus={true}
        />
        <AnimatedButton
          title={cancelButtonText}
          buttonName={cancelButtonText}
          handleChange={close}
          variant={variant}
          color="error"
          size="small"
          transitions={true}
          autoFocus={false}
        />
      </DialogActions>
    </ProjectDialog>
  );
};

export default ConfirmationDialog;
// import React from 'react';
// import ProjectDialog from './ProjectDialog';
// import {
//   DialogContent,
//   DialogContentText,
//   DialogActions,
//   DialogTitle,
//   SvgIcon,
//   Box,
// } from '@mui/material';
// import { IconChecks, IconRefresh, IconTrash, IconUpload } from '@tabler/icons-react';
// import useConfirmationStore from 'hooks/useConfirmationStore';
// import AnimatedButton from './AnimatedButton';

// const ConfirmationDialog = () => {
//   const { isOpen, config, close } = useConfirmationStore();

//   const iconMap = {
//     restore: IconRefresh,
//     delete: IconTrash,
//     upload: IconUpload,
//     confirm: IconChecks,
//     // Add more mappings as needed
//   };
//   const iconColor = {
//     restore: 'info',
//     delete: 'error',
//     upload: 'info',
//     confirm: 'info',
//     // Add more mappings as needed
//   };

//   const Icon = iconMap[config.type] ?? null;
//   const Color = iconColor[config.type] ?? null;

//   const handleConfirm = () => {
//     config.onConfirm();
//     close();
//   };

//   return (
//     <ProjectDialog
//       open={isOpen}
//       onClose={close}
//       maxWidth={config.maxWidth ?? 'xs'}
//       handleClose={() => close()}
//     >
//       <DialogTitle sx={{ userSelect: 'none' }}>{config.title}</DialogTitle>
//       <DialogContent>
//         <Box display="flex" gap={1} alignItems="center">
//           {config.type && (
//             <SvgIcon color={Color}>
//               <Icon />
//             </SvgIcon>
//           )}
//           <DialogContentText sx={{ userSelect: 'none' }}>{config.description}</DialogContentText>
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <AnimatedButton
//           title={config.confirmButtonText}
//           buttonName={config.confirmButtonText}
//           startIcon={config.type ? <Icon size={20} /> : null}
//           handleChange={handleConfirm}
//           variant={config.variant}
//           color={config.color || 'info'}
//           size="small"
//           transitions={true}
//           autoFocus={true}
//         />
//         <AnimatedButton
//           title={config.cancelButtonText}
//           buttonName={config.cancelButtonText}
//           handleChange={close}
//           variant={config.variant}
//           color="error"
//           size="small"
//           transitions={true}
//           autoFocus={true}
//         />
//       </DialogActions>
//     </ProjectDialog>
//   );
// };

// export default ConfirmationDialog;
