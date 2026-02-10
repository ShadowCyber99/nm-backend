/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllUser, deleteUser } from './../action';
import PropTypes from 'prop-types';
import {
  limitWords,
  strictValidArrayWithLength,
  strictValidObjectWithKeys,
  strictValidString,
} from '../../../utils/common-utils';
import ReactTable from '../../../components/react-table';
import EditableButton from '../../../components/react-table/components/editable-button';
import { formatPhoneNumber } from '../../../utils/regexs';
import Dialog from '../../../components/dialog';
import {
  PhoneFilters,
  SelectColumnFilter,
} from '../../../components/react-table/helper';
import { useSnackbar } from 'notistack';
import MDTooltip from '../../../components/tooltip';

const UserList = ({
  isLoad,
  isLoadInner,
  message,
  setValue,
  setData,
  callAllUserApi,
  callDeleteUserApi,
  all_users,
  total_users,
  loadErr,
}) => {
  const [current, setCurrent] = useState({});
  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    callAllUserApi();
  }, []);

  const deleteToggle = () => {
    setIsDeleteDialog(!isDeleteDialog);
  };

  const deleteUserData = async (val) => {
    const result = await callDeleteUserApi(val);
    if (result) {
      callAllUserApi();
      deleteToggle();
    }
  };
  useEffect(() => {
    if (loadErr)
      enqueueSnackbar(loadErr, {
        variant: 'error',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [loadErr]);

  useEffect(() => {
    if (message)
      enqueueSnackbar(message, {
        variant: 'success',
        preventDuplicate: true,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
      });
  }, [message]);
  const deleteDialog = (id) => {
    return (
      <Dialog
        fullScreen={false}
        isOpen={isDeleteDialog}
        title={'Are you sure ?'}
        handleClose={() => {
          deleteToggle();
        }}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want to delete the user {current.email_id} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => deleteToggle()}
          >
            No
          </Button>
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteUserData(current.user_id)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div>
      <Grid>
        <ReactTable
          loading={isLoad}
          isLoadInner={isLoadInner}
          customText={'You do not have any configured Users'}
          columnDefs={[
            {
              Header: 'First Name',
              accessor: 'first_name',
            },
            {
              Header: 'Last Name',
              accessor: 'last_name',
            },
            {
              Header: 'Physical Address',
              accessor: 'address',
              width: 270,
              Cell: (props) => (
                <MDTooltip title={props.row.original.address}>
                  <Typography height={55}>
                    {strictValidString(props.row.original.address)
                      ? props.row.original.address
                      : 'N/A'}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Email',
              accessor: 'email_id',
              width: 240,
            },
            {
              Header: 'Phone Number',
              accessor: 'phone_number',
              Filter: PhoneFilters,
              Cell: (props) => (
                <Typography>
                  {formatPhoneNumber(props.row.original.phone_number)}
                </Typography>
              ),
            },
            {
              Header: 'Account',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  originalRow.role_id === 7
                  ? originalRow.name
                  : 'System';
              },
              Filter: SelectColumnFilter,
              Cell: (props) => (
                <MDTooltip
                  title={
                    props.row.original.role_id === 7
                      ? limitWords(props.row.original.name, 25)
                      : 'System'
                  }
                >
                  <Typography height={55}>
                    {props.row.original.role_id === 7
                      ? limitWords(props.row.original.name, 25)
                      : 'System'}
                  </Typography>
                </MDTooltip>
              ),
            },
            {
              Header: 'Role',
              accessor: 'role_name',
              Filter: SelectColumnFilter,
              width: 150,
            },
            {
              Header: 'Send Sms',
              accessor: (originalRow, rowIndex) => {
                return strictValidObjectWithKeys(originalRow) &&
                  strictValidArrayWithLength(originalRow.send_sms_of_trip)
                  ? 'Yes'
                  : 'No';
              },
              width: 80,
            },
            {
              Header: 'Actions',
              accessor: '',
              Filter: false,
              width: 100,
              Cell: (props) => (
                <>
                  <EditableButton
                    editButtonClicked={() => {
                      const field = props.row.original;
                      setValue('2');
                      setData(field);
                    }}
                    deleteButtonClicked={() => {
                      const field = props.row.original;
                      deleteToggle();
                      setCurrent(field);
                    }}
                  />
                </>
              ),
            },
          ]}
          rowData={Array.isArray(all_users) ? all_users : []}
        />
      </Grid>
      {deleteDialog()}
    </div>
  );
};

UserList.propTypes = {
  callAllUserApi: PropTypes.func,
  isLoad: PropTypes.bool,
  isLoadInner: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

UserList.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.user.message,
    isLoad: state.user.isLoad,
    loadErr: state.user.loadErr,
    all_users: state.user.all_users,
    total_users: state.user.total_users,
    isLoadInner: state.user.isLoadInner,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAllUserApi: (...params) => dispatch(getAllUser(...params)),
  callDeleteUserApi: (...params) => dispatch(deleteUser(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(UserList);
