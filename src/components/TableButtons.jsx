import React from 'react';
import { Box, IconButton, Zoom } from '@mui/material';
import {
  IconEdit,
  IconEye,
  IconLink,
  IconPlus,
  IconQrcode,
  IconRefresh,
  IconTrash,
  IconUpload,
} from '@tabler/icons-react';
import { LightTooltip } from './Tooltip';

// Icon mapping object with MUI icons
const iconMap = {
  handleEdit: IconEdit,
  handleDelete: IconTrash,
  handleView: IconEye,
  handleDownload: IconLink,
  handleUpload: IconUpload,
  handleAdd: IconPlus,
  handleRestore: IconRefresh,
  handlePrint: IconQrcode,
  // Add more mappings as needed
};

const TableButtons = ({ buttons, item, index }) => {
  if (!buttons || !buttons.length) return null;

  return (
    <Box
      display="flex"
      gap={0.2}
      alignItems="center"
      justifyContent="center"
      sx={{ flexWrap: 'wrap' }}
    >
      {buttons.map((button, index) => {
        // Get icon based on the function name or direct icon override
        const Icon =
          button.icon || iconMap[button.handleFunction.name] || iconMap[`handle${button?.name}`];

        if (!Icon) return null;

        return (
          <LightTooltip
            key={`${button?.name || button.handleFunction.name}-${index}`}
            title={button.title ?? 'NA'}
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 350 }}
          >
            <IconButton
              size={button.size ?? 'small'}
              variant={button.variant ?? 'contained'}
              color={button.color ?? 'primary'}
              onClick={() => button.handleFunction(item, index)}
              disabled={button.disabled}
              className={button.className}
            >
              <Icon />
            </IconButton>
          </LightTooltip>
        );
      })}
    </Box>
  );
};

export default TableButtons;
