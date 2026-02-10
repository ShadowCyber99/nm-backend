/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react';
import { CssBaseline, Grid, Stack } from '@mui/material';
import Sidebar from '../../components/sidebar';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { connect } from 'react-redux';
import {
  createUser,
  updateUser,
  getRoles,
  resetMessage,
  updatePassword,
  resetSuccessMessage,
} from './action';
import TopTab from '../../components/top-tab';

import UserList from './list';
import { strictValidObjectWithKeys } from '../../utils/common-utils';
import AddIcon from '@mui/icons-material/Add';
import WindowTitle from '../../components/window-name';
import { getCorporateAccount } from '../trip-management/action';
import Clock from '../../components/clock';
import { tablePadding } from '../../assets/styles';
import AddUser from './add-user';
// import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    height: '94vh',
    overflow: 'auto',
    backgroundColor: '#F3F3F3',
  },
  mainRoot: {
    width: '100vw',
  },
  tabStyle: {
    backgroundColor: '#E3E3E3',
  },
  margin: {
    margin: theme.spacing(4, 0, 1),
  },
  generalMargin: {
    margin: theme.spacing(1, 0, 0),
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  mainHeaderText: {
    fontSize: 16,
    fontWeight: '700',
  },
  button: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FAFAFA',
  },
  textField: {
    width: '100%',
  },
  input: {
    fontSize: 14,
  },
  helperText: {
    margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
    backgroundColor: '#F3F3F3',
  },
  disabledCheckbox: {
    backgroundColor: '#F3F3F3',
  },
}));

const UserManagement = ({
  callAddUserApi,
  callUpdateUser,
  isLoad,
  loadErr,
  message,
  callResetMessageApi,
  callUserRolesApi,
  roles,
  callUpdatePasswprdApi,
  callCorporateAccountApi,
  corporateAccountFromState,
  callResetSuccessMessageApi,
}) => {
  const [value, setValue] = useState('1');

  const [userdata, setUserData] = useState({});
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    if (newValue === '2') {
      setValue(newValue);
    } else {
      setValue(newValue);
      setUserData({});
    }
  };

  useEffect(() => {
    callUserRolesApi();
    callCorporateAccountApi();
    return () => {
      callResetMessageApi();
    };
  }, []);

  const addColumn = () => {
    setUserData({});
    setValue('2');
  };

  return (
    <div className={classes.root}>
      <WindowTitle title="User Management" />
      <CssBaseline />
      <Sidebar onChange={() => setValue('1')} />
      <main className={classes.mainRoot}>
        <Grid item>
          <TabContext value={value}>
            <Box
              style={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
              className={classes.tabStyle}
              flexDirection={'row'}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <TopTab label="User List" value={'1'} ids="user_list" />
                <TopTab
                  label={
                    strictValidObjectWithKeys(userdata)
                      ? 'Edit User'
                      : 'Create User'
                  }
                  value={`2`}
                  ids={
                    strictValidObjectWithKeys(userdata)
                      ? 'user_edit'
                      : 'user_create'
                  }
                />
              </TabList>
              <Stack direction="row" alignItems="center">
                <Clock>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => addColumn()}
                    color="primary"
                    startIcon={<AddIcon />}
                    className={classes.button}
                    disabled={value === '2'}
                  >
                    Add User
                  </Button>
                </Clock>
              </Stack>
            </Box>
            <main className={classes.content}>
              <TabPanel sx={tablePadding} value={'1'}>
                <UserList
                  setData={(a) => setUserData(a)}
                  setValue={(e) => setValue(e)}
                />
              </TabPanel>
              <TabPanel value={'2'}>
                <AddUser
                  userdata={userdata}
                  setUserData={(a) => setUserData(a)}
                  setValue={(e) => setValue(e)}
                />
              </TabPanel>
            </main>
          </TabContext>
        </Grid>
      </main>
    </div>
  );
};

UserManagement.propTypes = {
  callAddUserApi: PropTypes.func,
  callResetMessageApi: PropTypes.func,
  callUserRolesApi: PropTypes.func,
  isLoad: PropTypes.bool,
  loadErr: PropTypes.string,
  message: PropTypes.string,
};

UserManagement.defaultProps = {
  isLoad: false,
  loadErr: '',
  message: '',
};

const mapStateProps = (state) => {
  return {
    message: state.user.success_message,
    isLoad: state.user.isLoad,
    loadErr: state.user.loadErr,
    roles: state.user.roles,
    corporateAccountFromState: state.trip.allTrips.all_corporates,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  callAddUserApi: (...params) => dispatch(createUser(...params)),
  callUpdateUser: (...params) => dispatch(updateUser(...params)),
  callUserRolesApi: (...params) => dispatch(getRoles(...params)),
  callCorporateAccountApi: (...params) =>
    dispatch(getCorporateAccount(...params)),
  callResetMessageApi: (...params) => dispatch(resetMessage(...params)),
  callResetSuccessMessageApi: (...params) =>
    dispatch(resetSuccessMessage(...params)),
  callUpdatePasswprdApi: (...params) => dispatch(updatePassword(...params)),
});

export default connect(mapStateProps, mapDispatchToProps)(UserManagement);
