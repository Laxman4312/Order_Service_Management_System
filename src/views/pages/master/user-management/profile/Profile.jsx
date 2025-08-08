import { Avatar, Box, Button, Container, Grid, Stack } from '@mui/material';
import { IconPassword, IconUserEdit } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { LogoIcon as Logo } from 'config/icons';
import { ListItem } from 'components/MiniComponents';
import UpdateProfile from './UpdateProfile';
import useDialogNavigation from 'custom-hooks/useDialogNavigation';
import { setUserFormData } from 'redux/slices/user';
import ChangePassword from './ChangePassword';
import { IMAGE_BASEURL } from 'api/APIUrl';

const Profile = () => {
  const dispatch = useDispatch();
  const [passwordDialog, setPasswordDialog] = useState(false);
  const { userData } = useSelector((state) => state.auth);
  const { isSaving } = useSelector((state) => state.general);
  const [profilePictureLink, setProfilePictureLink] = useState('');

  //Handle Dialog
  const { dialogType, isOpen } = useSelector((state) => state.dialog);
  const { handleDialogOpen, handleDialogClose } = useDialogNavigation(isOpen);

  //Edit Operation
  const handleProfileUpdate = () => {
    handleDialogOpen('Edit');
    dispatch(
      setUserFormData({
        id: userData?._id,
        profilePictureLink: userData?.profilePictureLink,
        usrName: userData?.usrName,
        emailUsr: userData?.emailUsr,
        usrNumb: userData?.usrNumb
      })
    );
  };

  //Change Password
  const handlePasswordChange = () => {
    setPasswordDialog(true);
  };

  useEffect(() => {
    let imageURL = userData?.profilePictureLink;
    if (typeof imageURL === 'string') {
      if (imageURL.startsWith('uploads')) {
        imageURL = imageURL.slice(8); // Remove 'uploads/'
      }
      setProfilePictureLink(` ${IMAGE_BASEURL}/${imageURL}`);
    }
  }, [userData?.profilePictureLink]);

  return (
    <Container maxWidth="md" sx={{ mt: 5, p: 2, border: '0.5px solid rgb(211, 211, 211, 0.7)', borderRadius: '0.5rem' }}>
      <Grid container rowSpacing={2} columnSpacing={1.75} alignItems="center">
        <Grid item xs={12} align="center">
          <Avatar
            alt={`${userData?.usrName} Image`}
            src={profilePictureLink ?? Logo}
            slotProps={{
              img: {
                onContextMenu: (e) => e.preventDefault(),
                draggable: false,
                style: {
                  objectFit: 'cover'
                }
              }
            }}
            sx={{ width: 150, height: 150 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" sx={{ flexDirection: { xs: 'column-reverse', sm: 'column' } }}>
            <Box display="flex" gap={2} justifyContent="right">
              <Button startIcon={<IconUserEdit />} color="primary" onClick={handleProfileUpdate}>
                Update Profile
              </Button>
              <Button startIcon={<IconPassword />} color="primary" onClick={handlePasswordChange}>
                Change Password
              </Button>
            </Box>
            <Box>
              <Stack spacing={1}>
                <ListItem title="Full Name" value={userData?.usrName ?? 'NA'} />
                <ListItem title="Email Address" value={userData?.emailUsr ?? 'NA'} />
                <ListItem title="Contact Number" value={userData?.usrNumb ?? 'NA'} />
              </Stack>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {isOpen && <UpdateProfile isOpen={isOpen} dialogType={dialogType} handleCloseModal={handleDialogClose} isSaving={isSaving} />}
      {passwordDialog && <ChangePassword isOpen={passwordDialog} handleCloseModal={setPasswordDialog} isSaving={isSaving} />}
    </Container>
  );
};

Profile.propTypes = {
  Logo: PropTypes.string
};

export default Profile;
