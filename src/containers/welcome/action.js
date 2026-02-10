import { userConstants } from "./constants";
import { decrypted } from '../../utils/common-utils';

export const getMyProfile = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/profile', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: userConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: userConstants.PROFILE,
      userprofile: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: userConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: userConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

