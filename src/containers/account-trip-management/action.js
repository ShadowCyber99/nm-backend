import { accountTripConstants } from './constants';
import {
  decrypted,
  encrypted,
  strictValidObjWithKeysAndArrayWithLength,
  strictValidObjectWithKeys,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';

export const createTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: accountTripConstants.LOAD });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/account-user/trip', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error:
          'BAR Transport mode not required' !== res.message &&
          'BAR Transport mode required' !== res.message &&
          res.message,
        errData: decrypted(res.data),
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: accountTripConstants.SAVE_TRIP_ACCOUNTS,
      saved_item: decrypted(res.data),
    });
    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const createAccontQuote = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: accountTripConstants.GET_QUOTE });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/account-user/get_quotation', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.GET_QUOTE_FAIL,
        error:
          'BAR Transport mode not required' !== res.message &&
          'BAR Transport mode required' !== res.message &&
          res.message,
        errData: decrypted(res.data),
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: accountTripConstants.SAVE_QUOTATION,
      saved_item: decrypted(res.data),
    });
    await dispatch({
      type: accountTripConstants.GET_QUOTE_SUCCESS,
      save_quotation: decrypted(res.data),
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.GET_QUOTE_FAIL,
      error,
    });
    return false;
  }
};
export const flushBarError = (data) => async (dispatch, getState) => {
  dispatch({
    type: accountTripConstants.FLUSH,
    errData: {},
    loadErr: '',
  });
};
export const flushAccountQuote = (data) => async (dispatch, getState) => {
  dispatch({
    type: accountTripConstants.FLUSH_QUOTATION,
    save_quotation: {},
    errData: {},
  });
};

export const updateTrip = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { trip_id, values } = v;
  let data = {
    ...values,
  };
  data = encrypted(data);
  dispatch({ type: accountTripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/account-user/trip/${trip_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error:
          'BAR Transport mode not required' !== res.message &&
          'BAR Transport mode required' !== res.message &&
          res.message,
        errData: decrypted(res.data),
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: accountTripConstants.SAVE_TRIP_ACCOUNTS,
      saved_item: decrypted(res.data),
    });
    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: accountTripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/account-user/trip', { params: data });
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: accountTripConstants.ALL_TRIP_ACCOUNTS,
      all_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getAccTripByFilters = () => async (dispatch, getState, api) => {
  const data = getState().account_trip.getFilters;
  // Start loading
  dispatch({ type: accountTripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/account-user/trip', { params: data });
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: accountTripConstants.ALL_TRIP_ACCOUNTS,
      all_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getFilters = (data) => async (dispatch, getState, api) => {
  const data = getState().account_trip.saveFilters;
  dispatch({
    type: accountTripConstants.GET_FILTERS,
    getFilters: data,
  });
};

export const saveAccFilters = (data) => async (dispatch, getState, api) => {
  dispatch({
    type: accountTripConstants.SAVE_FILTERS,
    saveFilters: data,
  });
};

export const getCompletedTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: accountTripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/account-user/completed-trip', { params: data });
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: accountTripConstants.ALL_COMPLETED_TRIPS,
      completed_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips_completed: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const saveLeg = (data) => async (dispatch, getState, api) => {
  dispatch({
    type: accountTripConstants.SAVE_LEG,
    save_leg: data,
  });
};

export const tripIegId = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: accountTripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/trip/${data}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getCorporateAccount =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: accountTripConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/account-user/get-corporate-account', {
        data,
      });
      // If not valid response object
      if (!validObjectWithParameterKeys(res, ['data'])) {
        await dispatch({
          type: accountTripConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: accountTripConstants.ALL_CORPORATE_ACCOUNT,
        all_corporates: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: accountTripConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const deleteTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: accountTripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.delete(`/admin/trip/${data}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue

    await dispatch({
      type: accountTripConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: accountTripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const deleteTripWithReason =
  (id, data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: accountTripConstants.LOAD });
    try {
      data = encrypted(data);
      // Call api to authenticate user
      const res = await api.delete(`/admin/trip/${id}`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: accountTripConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue

      await dispatch({
        type: accountTripConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: accountTripConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
