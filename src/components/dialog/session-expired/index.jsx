import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { defaultPropGetter } from '../../../utils/common-utils';
import { resetStore } from '../../../containers/auth/resetAction';
import { useDispatch } from 'react-redux';
import store from 'store2';

const SessionExpiredDialog = ({
  isOpen,
  handleOk = defaultPropGetter,
  ...rest
}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isOpen) {
      dispatch(resetStore());
      store.clearAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{'GMTCARE New Mexico'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Your session is expired due to non activity for long time.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionExpiredDialog;
