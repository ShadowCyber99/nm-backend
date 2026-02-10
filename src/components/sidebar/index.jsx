import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DirectionIcon,
  FirstAidIcon,
  TruckIcon,
  UboardIcon,
  Caccount,
  UserIcon,
  SUPanelIcon,
  TableViewIcon,
} from '../../assets/icons';
import './sidebar.css';
import LogoutIcon from '@mui/icons-material/Logout';
import store from 'store2';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import { useDispatch, useSelector } from 'react-redux';
import {
  defaultPropGetter,
  strictValidNumber,
  strictValidObjectWithKeys,
} from '../../utils/common-utils';
import { makeStyles } from '@mui/styles';
import GroupIcon from '@mui/icons-material/Group';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { Box, Divider, Drawer, List } from '@mui/material';
import MainLogo from '../../assets/fav.png';
import Logo from '../../assets/STAGE.png';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { resetStore } from '../../containers/auth/resetAction';
import PaymentsIcon from '@mui/icons-material/CreditScore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DevicesFoldIcon from '@mui/icons-material/DevicesFold';
import { useNavigate } from 'react-router-dom';
const APP_LOGO = process.env.REACT_APP_LOGO;
const useStyles = makeStyles((theme) => ({
  leftArrow: {
    cursor: 'pointer',
    width: 60,
    justifyContent: 'flex-start',
    display: 'flex',
    height: 25,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    paddingLeft: 3,
  },
  title: {
    margin: theme.spacing(0.5, 2),
    fontSize: 20,
  },
  buttonForceAction: {
    width: 120,
    textTransform: 'capitalize',
  },
  rightArrow: {
    position: 'absolute',
    zIndex: '99',
    bottom: 20,
    left: 10,
    textAlign: 'center',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: 60,
    justifyContent: 'end',
    height: 25,
    paddingRight: 3,
  },
}));
const Sidebar = ({ onChange = defaultPropGetter }) => {
  let history = useLocation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [isActive, setActive] = useState({ id: 0, status: false });
  const navLinks = [];
  const navigate = useNavigate();
  const classes = useStyles();

  // Role Id = 1  Driver Manager
  if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 1
  ) {
    navLinks.push(
      {
        link: '/units',
        id: 'unit_sidebar',
        name: 'Units',
        icon: <FirstAidIcon />,
      },
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/drivers',
        id: 'sidebar_drivers',
        name: 'Drivers',
        icon: <UserIcon />,
      },
      {
        link: '/vehicle',
        id: 'sidebar_vehicle',
        name: 'Vehicles',
        icon: <TruckIcon />,
      },
      {
        link: '/unit-status',
        id: 'sidebar_unit_status',
        name: 'U-Board',
        icon: <UboardIcon />,
      },
      {
        link: '/transport',
        id: 'sidebar_transport',
        name: 'Transport',
        icon: <AirportShuttleIcon />,
      },

      { link: '#', name: 'Logout', id: 'sidebar_logout', icon: <LogoutIcon /> },
    );
  }
  // Role Id = 2  Dispatcher
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 2
  ) {
    navLinks.push(
      {
        link: '/units',
        id: 'unit_sidebar',
        name: 'Units',
        icon: <FirstAidIcon />,
      },
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/transport',
        id: 'sidebar_transport',
        name: 'Transport',
        icon: <AirportShuttleIcon />,
      },
      {
        link: '/unit-status',
        id: 'sidebar_unit_status',
        name: 'U-Board',
        icon: <UboardIcon />,
      },
      { link: '#', name: 'Logout', id: 'sidebar_logout', icon: <LogoutIcon /> },
    );
  }
  // Role Id = 4  Reservationist
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 4
  ) {
    navLinks.push(
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      { link: '#', name: 'Logout', id: 'sidebar_logout', icon: <LogoutIcon /> },
    );
  }
  // Role Id = 6  Manager
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 6
  ) {
    navLinks.push(
      {
        link: '/units',
        id: 'unit_sidebar',
        name: 'Units',
        icon: <FirstAidIcon />,
      },
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/drivers',
        id: 'sidebar_drivers',
        name: 'Drivers',
        icon: <UserIcon />,
      },
      {
        link: '/vehicle',
        id: 'sidebar_vehicle',
        name: 'Vehicles',
        icon: <TruckIcon />,
      },
      {
        link: '/transport',
        id: 'sidebar_transport',
        name: 'Transport',
        icon: <AirportShuttleIcon />,
      },
      {
        link: '/unit-status',
        id: 'sidebar_unit_status',
        name: 'U-Board',
        icon: <UboardIcon />,
      },
      {
        link: '/corporate-account',
        id: 'sidebar_corporate_account',
        name: 'C-Account',
        icon: <Caccount />,
      },

      // {
      //   link: '/billing', id: "sidebar_billing",
      //   name: 'Billing',
      //   icon: <Caccount />,
      // },

      { link: '#', name: 'Logout', id: 'sidebar_logout', icon: <LogoutIcon /> },
    );
  }
  // Role Id = 7  Account User
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 7
  ) {
    navLinks.push(
      {
        link: '/account-trips',
        id: 'sidebar_account_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/login',
        name: 'Logout',
        id: 'sidebar_logout',
        icon: <LogoutIcon />,
      },
    );
  } // Role Id = 9  Account User
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 9
  ) {
    navLinks.push(
      {
        link: '/unit-status',
        id: 'sidebar_unit_status',
        name: 'U-Board',
        icon: <UboardIcon />,
      },
      {
        link: '/login',
        name: 'Logout',
        id: 'sidebar_logout',
        icon: <LogoutIcon />,
      },
    );
  } // Role Id = 10  Billing Clerk
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 10
  ) {
    navLinks.push(
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/billing',
        id: 'sidebar_billing',
        name: 'Billing',
        icon: <ReceiptLongIcon />,
      },
      {
        link: '/login',
        name: 'Logout',
        id: 'sidebar_logout',
        icon: <LogoutIcon />,
      },
    );
  } // Role Id = 11  Billing Manager
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 11
  ) {
    navLinks.push(
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/corporate-account',
        id: 'sidebar_corporate_account',
        name: 'C-Account',
        icon: <Caccount />,
      },
      {
        link: '/billing',
        id: 'sidebar_billing',
        name: 'Billing',
        icon: <ReceiptLongIcon />,
      },
      {
        link: '/login',
        name: 'Logout',
        id: 'sidebar_logout',
        icon: <LogoutIcon />,
      },
    );
  } // Role Id = 12  Account Receivable
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 12
  ) {
    navLinks.push(
      {
        link: '/billing',
        id: 'sidebar_billing',
        name: 'Billing',
        icon: <ReceiptLongIcon />,
      },
      {
        link: '/payments',
        id: 'payment_tab',
        name: 'Payments',
        icon: <PaymentsIcon />,
      },
      {
        link: '/login',
        name: 'Logout',
        id: 'sidebar_logout',
        icon: <LogoutIcon />,
      },
    );
  } // Role Id = 13  Account Payable
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 13
  ) {
    navLinks.push(
      {
        link: '/billing',
        id: 'sidebar_billing',
        name: 'Billing',
        icon: <ReceiptLongIcon />,
      },
      {
        link: '/login',
        name: 'Logout',
        id: 'sidebar_logout',
        icon: <LogoutIcon />,
      },
    );
  }

  // Role Id = 8  Super Admin
  else if (
    strictValidObjectWithKeys(user) &&
    strictValidNumber(user.role_id) &&
    user.role_id === 8
  ) {
    navLinks.push(
      {
        link: '/units',
        id: 'unit_sidebar',
        name: 'Units',
        icon: <FirstAidIcon />,
      },
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/drivers',
        id: 'sidebar_drivers',
        name: 'Drivers',
        icon: <UserIcon />,
      },
      {
        link: '/vehicle',
        id: 'sidebar_vehicle',
        name: 'Vehicles',
        icon: <TruckIcon />,
      },
      {
        link: '/transport',
        id: 'sidebar_transport',
        name: 'Transport',
        icon: <AirportShuttleIcon />,
      },
      {
        link: '/capability',
        id: 'sidebar_capability',
        name: 'Capabilities',
        icon: <BatchPredictionIcon />,
      },
      {
        link: '/unit-status',
        id: 'sidebar_unit_status',
        name: 'U-Board',
        icon: <UboardIcon />,
      },
      {
        link: '/corporate-account',
        id: 'sidebar_corporate_account',
        name: 'C-Account',
        icon: <Caccount />,
      },
      {
        link: '/users',
        id: 'sidebar_users',
        name: 'Users',
        icon: <GroupIcon />,
      },
      {
        link: '/billing',
        id: 'sidebar_billing',
        name: 'Billing',
        icon: <ReceiptLongIcon />,
      },
      {
        link: '/payments',
        id: 'payment_tab',
        name: 'Payments',
        icon: <PaymentsIcon />,
      },
      {
        link: '/admin-panel',
        id: 'sidebar_admin_panel',
        name: 'SU Panel',
        icon: <SUPanelIcon />,
      },
      {
        link: '/cdf',
        id: 'sidebar_cdf',
        name: 'CDF',
        icon: <TableViewIcon />,
      },
      {
        link: '/logs',
        id: 'sidebar_cdf',
        name: 'Logs',
        icon: <DevicesFoldIcon />,
      },
      { link: '#', name: 'Logout', id: 'sidebar_logout', icon: <LogoutIcon /> },
    );
  }
  // Role Id = 5  Admin
  else {
    navLinks.push(
      {
        link: '/units',
        id: 'unit_sidebar',
        name: 'Units',
        icon: <FirstAidIcon />,
      },
      {
        link: '/trips',
        id: 'sidebar_trips',
        name: 'Trips',
        icon: <DirectionIcon />,
      },
      {
        link: '/drivers',
        id: 'sidebar_drivers',
        name: 'Drivers',
        icon: <UserIcon />,
      },
      {
        link: '/vehicle',
        id: 'sidebar_vehicle',
        name: 'Vehicles',
        icon: <TruckIcon />,
      },
      {
        link: '/transport',
        id: 'sidebar_transport',
        name: 'Transport',
        icon: <AirportShuttleIcon />,
      },

      {
        link: '/capability',
        id: 'sidebar_capability',
        name: 'Capabilities',
        icon: <BatchPredictionIcon />,
      },
      {
        link: '/unit-status',
        id: 'sidebar_unit_status',
        name: 'U-Board',
        icon: <UboardIcon />,
      },
      {
        link: '/corporate-account',
        id: 'sidebar_corporate_account',
        name: 'C-Account',
        icon: <Caccount />,
      },
      {
        link: '/users',
        name: 'Users',
        id: 'sidebar_users',
        icon: <GroupIcon />,
      },
      {
        link: '/billing',
        name: 'Billing',
        id: 'sidebar_billing',
        icon: <ReceiptLongIcon />,
      },
      {
        link: '/payments',
        id: 'payment_tab',
        name: 'Payments',
        icon: <PaymentsIcon />,
      },
      {
        link: '/cdf',
        id: 'sidebar_cdf',
        name: 'CDF',
        icon: <TableViewIcon />,
      },
      {
        link: '/logs',
        id: 'sidebar_cdf',
        name: 'Logs',
        icon: <DevicesFoldIcon />,
      },
      { link: '#', name: 'Logout', id: 'sidebar_logout', icon: <LogoutIcon /> },
    );
  }
  const drawerWidth = 90;
  const [isOpen, changeIsOpen] = useState(true);
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        open={isOpen}
        className={isOpen ? 'boxShadow' : ''}
        variant={isOpen ? 'permanent' : ''}
        anchor="left"
      >
        {/* {/ <Toolbar /> /} */}
        <Box py={2} style={{ alignSelf: 'center' }}>
          <Link to={'/'}>
            {APP_LOGO !== 'staging' ? (
              <img
                src={MainLogo}
                alt="Logo"
                style={{ height: 70, width: 70 }}
              />
            ) : (
              <img src={Logo} alt="Logo" style={{ height: 100, width: 90 }} />
            )}
            {/**/}

            {/* {/ <SidebarLogo /> /} */}
          </Link>
        </Box>
        <Divider />
        <List
          className="sidebarCol"
          sx={{
            width: '100%',
            maxWidth: 360,
            height: '100%',
            bgcolor: 'background.paper',
            position: 'relative',
            overflow: 'auto', //can remove this to hide scroll bar in all logins(superadmin,admin)
          }}
        >
          <div className="dashboardNav">
            {navLinks.map((item, index) => (
              <React.Fragment>
                {item?.name === 'Logout' ? (
                  <div key={index} className="navigationCol">
                    <Link
                      onClick={() => {
                        dispatch(resetStore());
                        store.clearAll();
                        navigate('/login');
                        window.location.reload(true);
                      }}
                      to={'/login'}
                      className={
                        new RegExp(`${item.link}/?.*`).test(history.pathname) &&
                        'active'
                      }
                      id={item.id}
                    >
                      {item.icon}
                      <p>{item?.name}</p>
                    </Link>
                  </div>
                ) : (
                  <div
                    key={index}
                    className={'navigationCol'}
                    onClick={() => {
                      setActive({
                        ...isActive,
                        id: index,
                        status: true,
                      });
                      onChange();
                    }}
                  >
                    <Link
                      to={item.link}
                      id={item.id}
                      className={
                        new RegExp(`${item.link}/?.*`).test(history.pathname) &&
                        'active'
                      }
                    >
                      {item.icon}
                      <p>{item?.name}</p>
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <Box
            sx={{
              boxShadow: 3,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20,
            }}
            onClick={() => {
              changeIsOpen(!isOpen);
            }}
            className={classes.leftArrow}
          >
            <ArrowBackIosIcon />
          </Box>
        </List>
      </Drawer>
      {!isOpen ? (
        <Box
          sx={{
            boxShadow: 3,
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
          }}
          onClick={() => {
            changeIsOpen(!isOpen);
          }}
          className={classes.rightArrow}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </Box>
      ) : (
        ''
      )}
    </>
  );
};

export default Sidebar;
