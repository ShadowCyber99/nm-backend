import {
  decrypted,
  encrypted,
  strictValidObjectWithKeys,
} from '../../utils/common-utils';
import { transportConstants } from './constants';

// Create Transport

export const addTransport = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: transportConstants.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/transport', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: transportConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: transportConstants.LOAD_SUCCESS,
      message: res.message,
    });
    await dispatch({
      type: transportConstants.SAVE_TRANSPORT,
      save_transport: decrypted(res.data),
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: transportConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

// Merge Transport

export const mergeTransport = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { trip_id, values } = v;
  let data = {
    ...values,
  };
  data = encrypted(data);

  dispatch({ type: transportConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/trip/${trip_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: transportConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: transportConstants.MERGE_ACCOUNTS,
      mtransport: decrypted(res.data),
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: transportConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

// Get all trips accounts

export const getTrip = (data) => async (dispatch, getState, api) => {
  data = encrypted(data);
  // Start loading
  dispatch({ type: transportConstants.TRIP_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/available-trip', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: transportConstants.TRIP_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: transportConstants.TRIP_ACCOUNTS,
      trip: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: transportConstants.TRIP_LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: transportConstants.TRIP_LOAD_FAIL,
      error,
    });
    return false;
  }
};

// Get All Units

export const getUnits = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: transportConstants.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/available-units', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: transportConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: transportConstants.UNIT_ACCOUNTS,
      unit: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: transportConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: transportConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const saveFilters = (data) => async (dispatch, getState, api) => {
  dispatch({
    type: transportConstants.SAVE_FILTERS,
    saveFilter: data,
  });
};

export const getFilters = (data) => async (dispatch, getState, api) => {
  const data = getState().transport.ftransport.saveFilter;
  dispatch({
    type: transportConstants.GET_FILTERS,
    getFilter: data,
  });
};

export const flushUnits = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: transportConstants.FLUSH_UNITS });
};

export const flushtrips = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: transportConstants.FLUSH });
};

// Get all Merge accounts

export const getMergeTransportAccount =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: transportConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/get-corporate-account', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: transportConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: transportConstants.MERGE_ACCOUNTS,
        mtransport: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: transportConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: transportConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

// Get All FinishedTransports List

export const getFinishedTransportAccount =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: transportConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/finished-transport', { params: data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: transportConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }
      let decrypted_data = decrypted(res.data);
      // Else if valid response continue
      await dispatch({
        type: transportConstants.FINISHED_TRANSPORTS_ACCOUNTS,
        ftransport: strictValidObjectWithKeys(decrypted_data)
          ? decrypted_data.data
          : [],
        total_ftransport: strictValidObjectWithKeys(decrypted_data)
          ? decrypted_data.recordsTotal
          : 0,
      });
      await dispatch({
        type: transportConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: transportConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

// Get All Transports List

export const getTransportAccount =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: transportConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/transport', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: transportConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: transportConstants.TRANSPORTS_ACCOUNTS,
        transport: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: transportConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: transportConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

// Delete Transport Account By Id

export const deleteTransportById =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: transportConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.delete(`/admin/trip/${data}`);
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: transportConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      await dispatch({
        type: transportConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: transportConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
