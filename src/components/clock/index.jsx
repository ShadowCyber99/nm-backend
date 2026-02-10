import {
  Avatar,
  Box,
  ListItemIcon,
  MenuItem,
  Stack,
  Typography,
  ListItemText,
  DialogActions,
  DialogContent,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  defaultFormatDateTime,
  strictValidObjectWithKeys,
} from '../../utils/common-utils';
import Popover from '@mui/material/Popover';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { connect } from 'react-redux';
import { createStyles, makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { resetStore } from '../../containers/auth/resetAction';
import store from 'store2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dialog from '../dialog';

const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      transform: 'rotate(180deg)',
    },
  }),
);

const Clock = ({ userprofile, children, loadErr }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const toggle = () => {
    setIsOpenDialog(!isOpenDialog);
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullScreen={false}
        fullWidth={true}
        maxWidth={'md'}
        isOpen={isOpenDialog}
        title={'App info'}
        handleClose={() => {
          toggle();
        }}
      >
        <DialogContent
          sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}
        >
          <Typography mr={1} variant="h4">
            Version:
          </Typography>
          {strictValidObjectWithKeys(userprofile) && (
            <Typography variant="h4">
              {`${userprofile.backend_version}` || 'N/A'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: 'space-evenly', display: 'flex', mt: 2 }}
        >
          <Button
            className={classes.buttonForceAction}
            color="error"
            variant="outlined"
            onClick={() => toggle()}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  function stringAvatar(profile) {
    if (strictValidObjectWithKeys(profile)) {
      return {
        children: `${profile?.first_name.split('')[0]}${
          profile?.last_name.split('')[0]
        }`,
      };
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center">
        <Typography mr={2} variant="h4">
          {defaultFormatDateTime(time)}
        </Typography>
        {children}
        {strictValidObjectWithKeys(userprofile) && (
          <Avatar
            style={{
              border: '3.5px solid black',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
            sx={{
              mx: 1,
              color: '#000000',
              width: 48,
              height: 48,
              fontWeight: '500',
              textTransform: 'uppercase',
            }}
            {...stringAvatar(userprofile)}
            onClick={handleClick}
          />
        )}
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box width={320} sx={{ my: 2, mr: 2 }}>
            {strictValidObjectWithKeys(userprofile) && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="h5">
                  {userprofile.first_name + ' ' + userprofile.last_name}
                </Typography>

                <Typography sx={{ my: 1 }} variant="h5">
                  {`${userprofile.email_id}` || 'N/A'}
                </Typography>
              </Box>
            )}
            <Box sx={{ my: 1.5, ml: 0.3 }}>
              <MenuItem onClick={() => toggle()}>
                <ListItemIcon>
                  <InfoOutlinedIcon
                    style={{ color: '#000000', fontSize: 28 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '20px',
                    color: '#000000',
                  }}
                  primary="About"
                />
              </MenuItem>
              <MenuItem onClick={() => navigate('/settings')}>
                <ListItemIcon>
                  <SettingsIcon style={{ color: '#000000', fontSize: 28 }} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '20px',
                    color: '#000000',
                  }}
                  primary="Settings"
                />
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(resetStore());
                  store.clearAll();
                  navigate('/login');
                  window.location.reload(true);
                }}
              >
                <ListItemIcon>
                  <LogoutIcon
                    className={classes.rotateIcon}
                    style={{ color: '#000000', fontSize: 28 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '20px',
                    color: '#000000',
                  }}
                  primary="Logout"
                />
              </MenuItem>
            </Box>
          </Box>
        </Popover>
      </Stack>
      {renderDialog()}
    </Box>
  );
};
const mapStateProps = (state) => {
  return {
    message: state.user.message,
    isLoad: state.user.isLoad,
    loadErr: state.user.loadErr,
    userprofile: state.profile.userprofile,
    isLoadInner: state.user.isLoadInner,
  };
};

export default connect(mapStateProps, null)(Clock);
