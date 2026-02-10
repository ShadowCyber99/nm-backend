import app from './app';
import auth from '../../containers/auth/reducer';
import user from '../../containers/user-management/reducer';
import vehicle from '../../containers/vehicle-management/reducer';
import drivers from '../../containers/drivers-management/reducer';
import corporateAccounts from '../../containers/corporate-account/reducer';
import trip from '../../containers/trip-management/reducer';
import unit from '../../containers/unit-management/reducer';
import admin from '../../containers/admin/reducer';
import transport from '../../containers/transport-management/reducer';
import profile from '../../containers/welcome/reducer';
import billing from '../../containers/billing/reducer';
import unitStatus from '../../containers/unit-status-board/reducer';
import account_trip from '../../containers/account-trip-management/reducer';
import cdf from '../../containers/cdf/reducer';
import payments from '../../containers/payment/reducer';
import logs from '../../containers/logs/reducer';
import { authConstants } from '../../containers/auth/constants';
import { combineReducers } from 'redux';
import passwordUpdate from '../../containers/setting/reducer';
import pocReducer from '../../containers/poc/reducer';

const appReducer = combineReducers({
  app,
  auth,
  user,
  vehicle,
  drivers,
  corporateAccounts,
  trip,
  unit,
  transport,
  profile,
  billing,
  unitStatus,
  account_trip,
  admin,
  cdf,
  payments,
  logs,
  passwordUpdate,
  pocReducer,
});
const reducers = (state, action) => {
  if (action.type === authConstants.FLUSH) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default reducers;
