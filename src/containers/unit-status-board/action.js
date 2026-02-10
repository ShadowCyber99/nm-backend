import { decrypted } from '../../utils/common-utils';
import { unitStatusConstants } from './constants';

export const getUnitStatus = () => async (dispatch, getState, api) => {
  // Start loadin
  dispatch({ type: unitStatusConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/unit-status`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: unitStatusConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    else {
      await dispatch({
        type: unitStatusConstants.ALL_UNIT_STATUS,
        data: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: unitStatusConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    }
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: unitStatusConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
