import {
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import TableButtons from './TableButtons';
import { IconDotsVertical, IconPlayerPlay } from '@tabler/icons-react';
import { JSWSteelLogo } from 'config/icons';
import { useDispatch, useSelector } from 'react-redux';
import useDialogNavigation from 'hooks/useDialogNavigation';
import { setId } from 'store/slices/dialog';

const DetailsCard = (props) => {
  const { image, title, description, machine, handleEdit, handleDelete, moduleName } = props;

  const dispatch = useDispatch();
  const IMAGE_PATH =
    moduleName === 'Media' ? JSWSteelLogo : `http://localhost:5000/uploads/machines/${image}`;

  //Menu
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //Handle Dialog
  const { isOpen } = useSelector((state) => state.dialog);
  const { handleDialogOpen } = useDialogNavigation(isOpen);

  //Handle View
  const handleView = () => {
    dispatch(
      setId({
        id: description, //MediaID is stored in Description Prop
      }),
    );
    dispatch(handleDialogOpen());
  };

  return (
    <Card
      sx={{
        width: 335,
        maxHeight: 400,
        borderRadius: '0.5rem',
        boxShadow: 2,
        transition: 'transform 0.5s ease',
        '&:hover': {
          transform: 'scale(1.025)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={IMAGE_PATH}
        alt={`${title} Image`}
        sx={{ aspectRatio: 3 / 2, objectFit: 'cover' }}
      />
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography gutterBottom variant="h4" component="div">
            {props?.title ?? 'Title Unavailable'}
          </Typography>
          {(handleDelete || handleEdit) && (
            <>
              <IconButton
                aria-controls="menu-machines-card"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <SvgIcon>
                  <IconDotsVertical />
                </SvgIcon>
              </IconButton>
              <Menu
                id="menu-machines-card"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <TableButtons handleDelete={handleDelete} handleEdit={handleEdit} item={machine} />
              </Menu>
            </>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="body2" color="text.secondary">
            {description ?? 'Description Unavailable'}
          </Typography>
          {moduleName === 'Media' && (
            <Box>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<IconPlayerPlay />}
                onClick={handleView}
              >
                Play
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
