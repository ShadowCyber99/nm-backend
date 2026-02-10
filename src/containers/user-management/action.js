import { decrypted, encrypted } from '../../utils/common-utils';
import { userConstants } from './constants';

export const updateUser = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { user_id, values } = v;
  let data = {
    ...values,
  };
  data = encrypted(data);
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/update-user/${user_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: userConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    else {
      await dispatch({
        type: userConstants.SAVE_USER,
        saved_user: { ...decrypted(res.data) },
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: userConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    }
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: userConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const createUser = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/create-user', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: userConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    else {
      await dispatch({
        type: userConstants.SAVE_USER,
        saved_user: { ...decrypted(res.data) },
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: userConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    }
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: userConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getAllUser = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/user');
    // If not valid response object
    if (res.data.status === 0) {
      await dispatch({
        type: userConstants.LOAD_FAIL,
        error: res.data.message,
      });
      return false;
    }
    let decrypted_data = decrypted(res.data);
    // Else if valid response continue
    await dispatch({
      type: userConstants.ALL_USER,
      all_users: decrypted_data,
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

export const deleteUser = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.delete(`/admin/user/${data}`);
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
      type: userConstants.LOAD_SUCCESS,
      message: res.message,
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

export const getRoles = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/roles', { data });
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
      type: userConstants.ROLES,
      roles: decrypted(res.data),
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

export const resetMessage = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.FLUSH });
};
export const resetSuccessMessage = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: userConstants.FLUSH_MESSAGES });
};
export const updatePassword = (data) => async (dispatch, getState, api) => {
  // Start loading
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/change-password', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: userConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: userConstants.SUCCESS,
      message: res.message,
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

export const getCostCenter = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { account_id } = v;
  const data = { account_id };
  dispatch({ type: userConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/get-account-user/${account_id}`, {
      data,
    });
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
      type: userConstants.COST_CENTER,
      costCenter: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: userConstants.LOAD_SUCCESS,
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: userConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
