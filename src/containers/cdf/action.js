import { decrypted, encrypted } from '../../utils/common-utils';
import { cdfConstants } from './constants';

export const getCdf = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: cdfConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/cdf', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: cdfConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: cdfConstants.ALL_CDF,
      cdf: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: cdfConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: cdfConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};


export const createCdf =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: cdfConstants.LOAD });
    try {
      data = encrypted(data);
      // Call api to authenticate user
      const res = await api.post('/admin/cdf', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: cdfConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: cdfConstants.SAVE_CDF,
        save_cdf: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: cdfConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: cdfConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };


export const updateCdf = (v) => async (dispatch, getState, api) => {
  const { id, values } = v;

  const data = encrypted(values);
  // Start loading
  dispatch({ type: cdfConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/cdf/${id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: cdfConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue

    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: cdfConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: cdfConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const deleteCdf =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: cdfConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.delete(`/admin/cdf/${data}`);
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: cdfConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue

      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: cdfConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: cdfConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const resetMessage = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: cdfConstants.FLUSH });
};

export const flushError = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: cdfConstants.FLUSH_ERR });
};