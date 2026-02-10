import { tripConstants } from './constants';
import {
  decrypted,
  encrypted,
  strictValidNumber,
  strictValidObjectWithKeys,
  strictValidObjWithKeysAndArrayWithLength,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';

export const createTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.LOAD });
  try {
    data = encrypted(data);
    // Call api to authenticate user ̰
    const res = await api.post('/admin/trip', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
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
      type: tripConstants.SAVE_TRIP_ACCOUNTS,
      saved_item: decrypted(res.data),
    });
    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const submitFeedback = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.ADD_FEEDBACK_LOAD });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/admin/add-feedback', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.ADD_FEEDBACK_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.ADD_FEEDBACK_SUCCESS,
      save_feedback: decrypted(res.data),
      message: res.message,
    });

    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.ADD_FEEDBACK_FAIL,
      error,
    });
    return false;
  }
};

export const createQuote = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.GET_QUOTE });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/admin/get_quotation', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.GET_QUOTE_FAIL,
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
      type: tripConstants.GET_QUOTE_SUCCESS,
      save_quotation: decrypted(res.data),
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.GET_QUOTE_FAIL,
      error,
    });
    return false;
  }
};

export const flushError = (data) => async (dispatch, getState) => {
  dispatch({
    type: tripConstants.FLUSH,
    errData: {},
    loadErr: '',
  });
};

export const flushMessage = (data) => async (dispatch, getState) => {
  dispatch({
    type: tripConstants.FEEDBACK_MESSAGE_FLUSH,
    message: null,
  });
};

export const flushQuote = (data) => async (dispatch, getState) => {
  dispatch({
    type: tripConstants.FLUSH_QUOTATION,
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
  dispatch({ type: tripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/trip/${trip_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
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
      type: tripConstants.SAVE_TRIP_ACCOUNTS,
      saved_item: decrypted(res.data),
    });
    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
      message: res.message,
    });

    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getReasons = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { leg_id } = v;
  const data = { leg_id };
  dispatch({ type: tripConstants.GET_REASONS_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/get-reasons/${leg_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.GET_REASONS_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.GET_REASONS_SUCCESS,
      get_reason: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.GET_REASONS_FAIL,
      error,
    });
    return false;
  }
};

export const getTripLogs = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { leg_id } = v;
  const data = { leg_id };
  dispatch({ type: tripConstants.GET_TRIPLOG_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/get-triplog/${leg_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.GET_TRIPLOG_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.GET_TRIPLOG_SUCCESS,
      get_triplog: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.GET_FEEDBACK_FAIL,
      error,
    });
    return false;
  }
};
export const flushLogs = (data) => async (dispatch, getState) => {
  dispatch({
    type: tripConstants.TRIP_LOGS_FLUSH,
    get_triplog: {},
  });
};

export const getUserFeedback = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { leg_id } = v;
  const data = { leg_id };
  dispatch({ type: tripConstants.GET_FEEDBACK_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/get-feedback/${leg_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.GET_FEEDBACK_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.GET_FEEDBACK_SUCCESS,
      get_feedback: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.GET_FEEDBACK_FAIL,
      error,
    });
    return false;
  }
};

export const getTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/trip', { params: data });
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.ALL_TRIP_ACCOUNTS,
      all_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getTripByFilters = () => async (dispatch, getState, api) => {
  const data = getState().trip.allTrips.getFilters;
  // Start loading
  dispatch({ type: tripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/trip', { params: data });
    // If not valid response object
    let decrypted_data = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.ALL_TRIP_ACCOUNTS,
      all_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getCompletedTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.COMPLETED_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/completed-trip', { params: data });
    let decrypted_data = decrypted(res.data);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.COMPLETED_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.ALL_COMPLETED_TRIPS,
      completed_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: tripConstants.COMPLETED_LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.COMPLETED_LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getArchivedTrips = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.ARCHIVED_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/archive-trip', { params: data });
    let decrypted_data = decrypted(res.data);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.ARCHIVED_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: tripConstants.ALL_ARCHIVED_TRIPS,
      archived_trips: strictValidObjWithKeysAndArrayWithLength(decrypted_data)
        ? decrypted_data.data
        : [],
      total_trips: strictValidObjectWithKeys(decrypted_data)
        ? decrypted_data.recordsTotal
        : 0,
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: tripConstants.ARCHIVED_LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.ARCHIVED_LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getCompletedTripByFilter =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    const data = getState().trip.completedTrips.getCompletd;
    dispatch({ type: tripConstants.COMPLETED_LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/completed-trip', { params: data });
      let decrypted_data = decrypted(res.data);
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: tripConstants.COMPLETED_LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: tripConstants.ALL_COMPLETED_TRIPS,
        completed_trips: strictValidObjWithKeysAndArrayWithLength(
          decrypted_data,
        )
          ? decrypted_data.data
          : [],
        total_trips: strictValidObjectWithKeys(decrypted_data)
          ? decrypted_data.recordsTotal
          : 0,
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: tripConstants.COMPLETED_LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: tripConstants.COMPLETED_LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const saveLeg = (data) => async (dispatch, getState, api) => {
  dispatch({
    type: tripConstants.SAVE_LEG,
    save_leg: data,
  });
};

export const saveFilters = (data) => async (dispatch, getState, api) => {
  dispatch({
    type: tripConstants.SAVE_FILTERS,
    saveFilters: data,
  });
};

export const getFilters = (data) => async (dispatch, getState, api) => {
  const data = getState().trip.allTrips.saveFilters;
  dispatch({
    type: tripConstants.GET_FILTERS,
    getFilters: data,
  });
};

export const saveFiltersArchived =
  (data) => async (dispatch, getState, api) => {
    dispatch({
      type: tripConstants.SAVE_FILTERS_ARCHIVED,
      saveArchived: data,
    });
  };

export const getFiltersArchived = (data) => async (dispatch, getState, api) => {
  const data = getState().trip.archivedTrips.saveArchived;
  dispatch({
    type: tripConstants.GET_FILTERS_ARCHIVED,
    getArchived: data,
  });
};

export const saveFilterCompleted =
  (data) => async (dispatch, getState, api) => {
    dispatch({
      type: tripConstants.SAVE_FILTER_COMPLETED,
      saveCompletd: data,
    });
  };

export const getFiltersCompleted =
  (data) => async (dispatch, getState, api) => {
    const data = getState().trip.completedTrips.saveCompletd;
    dispatch({
      type: tripConstants.GET_FILTER_COMPLETED,
      getCompletd: data,
    });
  };

export const tripIegId = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/trip/${data}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getCorporateAccount =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: tripConstants.LOAD });
    try {
      // Call api to authenticate user
      const api_url = strictValidNumber(data)
        ? '/admin/get-corporate-account?trip_id=' + data
        : '/admin/get-corporate-account';
      const res = await api.get(api_url, {
        data,
      });
      // If not valid response object
      if (!validObjectWithParameterKeys(res, ['data'])) {
        await dispatch({
          type: tripConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: tripConstants.ALL_CORPORATE_ACCOUNT,
        all_corporates: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: tripConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: tripConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const deleteTripWithReason =
  (id, data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: tripConstants.LOAD });
    try {
      data = encrypted(data);
      // Call api to authenticate user
      const res = await api.delete(`/admin/trip/${id}`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: tripConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue

      await dispatch({
        type: tripConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: tripConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
export const deleteTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.delete(`/admin/trip/${data}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue

    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const cancelledTrip = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: tripConstants.LOAD });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/admin/cancelled-trip', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: tripConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: tripConstants.LOAD_SUCCESS,
      message: '',
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: tripConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getMilesFromLatLng =
  (trip_pickup_location, trip_dropoff_location, pick_up_date_time) =>
  async (dispatch, getState, api) => {
    // Start loading
    try {
      let data = encrypted({
        trip_pickup_location: trip_pickup_location,
        trip_dropoff_location: trip_dropoff_location,
        pick_up_date_time: pick_up_date_time,
      });
      // Call api to authenticate user
      const res = await api.post('/admin/distance-two-point', { data });
      // If not valid response object
      if (res.status === 0) {
        return {};
      }
      return decrypted(res.data);
    } catch (error) {
      // If an error occurs, set error field
      return {};
    }
  };
