import { authConstants } from './constants';
import store from 'store2';
import {
  decrypted,
  typeCastToString,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';
export const login = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: authConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post('/login', { data });
    const new_res = decrypted(res.data);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: authConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    if (new_res.role_id === 3) {
      await dispatch({
        type: authConstants.LOAD_FAIL,
        error: 'Access Denied!',
      });
      return false;
    }
    if (validObjectWithParameterKeys(new_res, ['token'])) {
      store({
        authToken: typeCastToString(new_res.token),
        user: new_res,
      });
    }

    // Else if valid response continue
    await dispatch({
      type: authConstants.ASSIGN_USER,
      user: { ...new_res, isAuthenticated: true },
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({ type: authConstants.LOAD_SUCCESS });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: authConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
// export const clearUserData = (id) => async (dispatch, getState, api) => {
//   // Start loading
//   dispatch({ type: authConstants.FLUSH });
// };
