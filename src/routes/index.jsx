import React, { useContext, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import {
  DriverManagerRoutes,
  AdminRoutes,
  ReservationRoutes,
  DispatcherRoutes,
  ManagerRoutes,
  AccountUserRoutes,
  StatusBoardRoutes,
  BillingClerkRoutes,
  BillingManagerRoutes,
  AccountReceivableRoutes,
  AccountPayableRoutes,
  SuperAdminRoutes,
  UnderMaintainenceRoutes,
} from './routes';
import store from 'store2';
import {
  strictValidArrayWithKey,
  strictValidObjectWithKeys,
  strictValidString,
} from '../utils/common-utils';
import { useSnackbar } from 'notistack';
import { SocketContext } from '../hooks/useSocketContext';

const routes = (isLoggedIn, role) => {
  switch (role) {
    case 1:
      return DriverManagerRoutes(isLoggedIn);
    case 2:
      return DispatcherRoutes(isLoggedIn);
    case 4:
      return ReservationRoutes(isLoggedIn);
    case 5:
      return AdminRoutes(isLoggedIn);
    case 6:
      return ManagerRoutes(isLoggedIn);
    case 7:
      return AccountUserRoutes(isLoggedIn);
    case 8:
      return SuperAdminRoutes(isLoggedIn);
    case 9:
      return StatusBoardRoutes(isLoggedIn);
    case 10:
      return BillingClerkRoutes(isLoggedIn);
    case 11:
      return BillingManagerRoutes(isLoggedIn);
    case 12:
      return AccountReceivableRoutes(isLoggedIn);
    case 13:
      return AccountPayableRoutes(isLoggedIn);
    case 'maintainence':
      return UnderMaintainenceRoutes(isLoggedIn);
    default:
      return AdminRoutes(isLoggedIn);
  }
};

function AppRoutes() {
  const isAuthTokenFlag = !!store('authToken');
  const userValue = store.get('user') || {};
  const role = strictValidObjectWithKeys(userValue) ? userValue.role_id : 5;
  // let maintainence = 'maintainence';
  // let isValidRole = maintainence ? maintainence : role;
  const routing = useRoutes(routes(isAuthTokenFlag, role));
  const socket = useContext(SocketContext);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    socket.on('transport_status', (callback) => {
      if (
        strictValidArrayWithKey([5, 3, 2, 1, 6, 8], role) &&
        isAuthTokenFlag
      ) {
        if (
          strictValidObjectWithKeys(callback) &&
          strictValidString(callback.message)
        ) {
          success(callback.message);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const success = (message) => {
    enqueueSnackbar(message, {
      variant: 'success',
      preventDuplicate: true,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right',
      },
    });
  };

  return <React.Fragment>{routing}</React.Fragment>;
}

export default AppRoutes;
