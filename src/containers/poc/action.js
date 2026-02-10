import { decrypted } from '../../utils/common-utils';
import { pocConstants } from './constants';

export const getLoc = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: pocConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/auto-complete?value=' + data);
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: pocConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    await dispatch({
      type: pocConstants.LOAD_SUCCESS,
      data: decrypted_data,
    });
    return decrypted_data;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: pocConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getLatLng = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: pocConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/get-location?placeId=' + data);
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: pocConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    await dispatch({
      type: pocConstants.SEND_ID,
      locations: decrypted_data,
    });
    return decrypted_data;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: pocConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const pocFlush = (data) => async (dispatch, getState) => {
  dispatch({
    type: pocConstants.POC_FLUSH,
    locations: [],
  });
};
