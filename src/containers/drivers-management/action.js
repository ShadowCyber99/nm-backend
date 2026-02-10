import { driverConstants } from './constants';
import {
  decrypted,
  encrypted,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';

export const createDriver = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: driverConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/driver', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: driverConstants.SAVE_DRIVER,
      save_item: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const driverUserList = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: driverConstants.LOAD });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/admin/driver-user-list', { data });
    // If not valid response object
    if (!validObjectWithParameterKeys(res, ['data'])) {
      await dispatch({
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: driverConstants.USER_DRIVER_LIST,
      user_driver_list: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getAllDrivers = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: driverConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/driver', { data });
    // If not valid response object
    if (!validObjectWithParameterKeys(res, ['data'])) {
      await dispatch({
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: driverConstants.ALL_DRIVERS,
      all_drivers: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const deleteDrivers = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: driverConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.delete(`/admin/driver/${data}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue

    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getActiveCapabilityRoles =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: driverConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/active-capability', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: driverConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: driverConstants.CAPABILITY_ROLES,
        roles: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: driverConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: driverConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const getCapabilityRoles = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: driverConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/capability', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: driverConstants.CAPABILITY_ROLES,
      roles: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const updateCapability = (data) => async (dispatch, getState, api) => {
  // Start loading
  try {
    // Else if valid response continue
    await dispatch({
      type: driverConstants.CAPABILITY_ROLES,
      roles: data,
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const createCapabilityRoles =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: driverConstants.LOAD });
    try {
      data = encrypted(data);
      // Call api to authenticate user
      const res = await api.post('/admin/capability', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: driverConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: driverConstants.SAVED_CAPABILITY_ROLES,
        saved_roles: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: driverConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: driverConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const changecapabilityStatus =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    // dispatch({ type: driverConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post('/admin/capability-status', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: driverConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: driverConstants.SAVED_CAPABILITY_ROLES,
        saved_roles: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: driverConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: driverConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const updateCapabilityRoles = (v) => async (dispatch, getState, api) => {
  const { id, values } = v;

  const data = encrypted({
    name: values.name,
    description: values.description,
    enabled: values.enabled,
    clarification: values.clarification,
    color: values.color,
  });
  // Start loading
  dispatch({ type: driverConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/capability/${id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: driverConstants.SAVED_CAPABILITY_ROLES,
      saved_roles: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const deleteCapabilityRoles =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: driverConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.delete(`/admin/capability/${data}`);
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: driverConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue

      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: driverConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: driverConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
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
        type: driverConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: driverConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: driverConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const resetMessage = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: driverConstants.FLUSH });
};
