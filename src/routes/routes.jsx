/* eslint-disable import/no-unresolved */
import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  Login,
  UnitManagement,
  TripManagement,
  DriversManagement,
  VehicleManagement,
  Welcome,
  TransportAccount,
  UnitStatusBoard,
  Capability,
  NotFound,
  UserManagement,
  CorporateAccount,
  AccountTripManagement,
  Invoicing,
  AdminPanel,
  CDF,
  Payments,
  SettingScreen,
  Logs,
  Poc,
} from './loadable-components';
import UnderMaintainence from '../components/maintainence';
import { BILLING_ROUTES_MAP } from '../containers/billing/index.jsx';

const billingRoute = (isLoggedIn) => ({
  path: '/billing', // protected routes
  children: [
    {
      index: true,
      element: isLoggedIn ? <Invoicing /> : <Navigate to="/login" />,
    },
    ...Object.values(BILLING_ROUTES_MAP).map((path) => ({
      path,
      element: isLoggedIn ? <Invoicing /> : <Navigate to="/login" />,
    })),
  ],
});

const DriverManagerRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/units', // protected routes
      element: isLoggedIn ? <UnitManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/transport', // protected routes
      element: isLoggedIn ? <TransportAccount /> : <Navigate to="/login" />,
    },
    {
      path: '/unit-status', // protected routes
      element: isLoggedIn ? <UnitStatusBoard /> : <Navigate to="/login" />,
    },
    {
      path: '/vehicle', // protected routes
      element: isLoggedIn ? <VehicleManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/drivers', // protected routes
      element: isLoggedIn ? <DriversManagement /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const ReservationRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const DispatcherRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/units', // protected routes
      element: isLoggedIn ? <UnitManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/transport', // protected routes
      element: isLoggedIn ? <TransportAccount /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      path: '/unit-status', // protected routes
      element: isLoggedIn ? <UnitStatusBoard /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const AdminRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/units', // protected routes
      element: isLoggedIn ? <UnitManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/users', // protected routes
      element: isLoggedIn ? <UserManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/vehicle', // protected routes
      element: isLoggedIn ? <VehicleManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/drivers', // protected routes
      element: isLoggedIn ? <DriversManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/unit-status', // protected routes
      element: isLoggedIn ? <UnitStatusBoard /> : <Navigate to="/login" />,
    },
    {
      path: '/capability', // protected routes
      element: isLoggedIn ? <Capability /> : <Navigate to="/login" />,
    },
    {
      path: '/corporate-account', // protected routes
      element: isLoggedIn ? <CorporateAccount /> : <Navigate to="/login" />,
    },
    {
      path: '/transport', // protected routes
      element: isLoggedIn ? <TransportAccount /> : <Navigate to="/login" />,
    },
    // {
    //   path: '/enc-dec-personal', // protected routes
    //   element: isLoggedIn ? <EncryptDecrypt /> : <Navigate to="/login" />,
    // },
    billingRoute(isLoggedIn),
    {
      path: '/payments', // protected routes
      element: isLoggedIn ? <Payments /> : <Navigate to="/login" />,
    },
    {
      path: '/logs', // protected routes
      element: isLoggedIn ? <Logs /> : <Navigate to="/login" />,
    },
    {
      path: '/cdf', // protected routes
      element: isLoggedIn ? <CDF /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const ManagerRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/units', // protected routes
      element: isLoggedIn ? <UnitManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/vehicle', // protected routes
      element: isLoggedIn ? <VehicleManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/drivers', // protected routes
      element: isLoggedIn ? <DriversManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/transport', // protected routes
      element: isLoggedIn ? <TransportAccount /> : <Navigate to="/login" />,
    },
    {
      path: '/corporate-account', // protected routes
      element: isLoggedIn ? <CorporateAccount /> : <Navigate to="/login" />,
    },
    // billingRoute(isLoggedIn), // protected route
    {
      path: '/unit-status', // protected routes
      element: isLoggedIn ? <UnitStatusBoard /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};
const AccountUserRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/account-trips', // protected routes
      element: isLoggedIn ? (
        <AccountTripManagement />
      ) : (
        <Navigate to="/login" />
      ),
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const StatusBoardRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/unit-status', // protected routes
      element: isLoggedIn ? <UnitStatusBoard /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const BillingClerkRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    billingRoute(isLoggedIn),
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const BillingManagerRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/corporate-account', // protected routes
      element: isLoggedIn ? <CorporateAccount /> : <Navigate to="/login" />,
    },
    billingRoute(isLoggedIn),
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const AccountReceivableRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    billingRoute(isLoggedIn),
    {
      path: '/payments', // protected routes
      element: isLoggedIn ? <Payments /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const AccountPayableRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    billingRoute(isLoggedIn),
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
  ];
};

const SuperAdminRoutes = (isLoggedIn) => {
  return [
    {
      path: '/', // protected routes
      element: isLoggedIn ? <Welcome /> : <Navigate to="/login" />,
    },
    {
      path: '/units', // protected routes
      element: isLoggedIn ? <UnitManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/trips', // protected routes
      element: isLoggedIn ? <TripManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/users', // protected routes
      element: isLoggedIn ? <UserManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/vehicle', // protected routes
      element: isLoggedIn ? <VehicleManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/drivers', // protected routes
      element: isLoggedIn ? <DriversManagement /> : <Navigate to="/login" />,
    },
    {
      path: '/unit-status', // protected routes
      element: isLoggedIn ? <UnitStatusBoard /> : <Navigate to="/login" />,
    },
    {
      path: '/capability', // protected routes
      element: isLoggedIn ? <Capability /> : <Navigate to="/login" />,
    },
    {
      path: '/corporate-account', // protected routes
      element: isLoggedIn ? <CorporateAccount /> : <Navigate to="/login" />,
    },
    {
      path: '/transport', // protected routes
      element: isLoggedIn ? <TransportAccount /> : <Navigate to="/login" />,
    },
    billingRoute(isLoggedIn),
    {
      path: '/payments', // protected routes
      element: isLoggedIn ? <Payments /> : <Navigate to="/login" />,
    },
    {
      path: '/admin-panel', // protected routes
      element: isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />,
    },
    {
      path: '/cdf', // protected routes
      element: isLoggedIn ? <CDF /> : <Navigate to="/login" />,
    },
    {
      path: '/logs', // protected routes
      element: isLoggedIn ? <Logs /> : <Navigate to="/login" />,
    },
    {
      // public routes
      path: '/login',
      element: !isLoggedIn ? <Login /> : <Navigate to="/" />,
    },
    {
      // public routes
      path: '*',
      element: <NotFound />,
    },
    {
      path: '/settings', // protected routes
      element: isLoggedIn ? <SettingScreen /> : <Navigate to="/login" />,
    },
    {
      path: '/poc', // protected routes
      element: isLoggedIn ? <Poc /> : <Navigate to="/login" />,
    },
  ];
};

const UnderMaintainenceRoutes = (isLoggedIn) => {
  return [
    {
      // public routes
      path: '*',
      element: <UnderMaintainence />,
    },
  ];
};

export {
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
};
