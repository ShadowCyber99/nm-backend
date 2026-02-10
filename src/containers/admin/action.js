import {
  decrypted,
  encrypted,
  strictValidNumber,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';
import { filterData } from './constants';

export const getDriverVehicle = (data) => async (dispatch, getState, api) => {
  // Start loading
  // dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/unit-driver-vehicle', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    // await dispatch({
    //   type: filterData.ALL_UNITS,
    //   units: res.data,
    // });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    // await dispatch({
    //   type: filterData.LOAD_SUCCESS,
    // });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const createUnit = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/unit', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
      message: res.message,
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const changeUnitStatus = (v) => async (dispatch, getState, api) => {
  const { unit_id, values } = v;
  let data = {
    ...values,
  };
  data = encrypted(data);
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/unit-change/${unit_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const updateUnit = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { unit_id, values } = v;
  let data = {
    ...values,
  };
  data = encrypted(data);
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/unit/${unit_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getDataByFilters = (data) => async (dispatch, getState, api) => {
  // Start loading
  data = encrypted(data);
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/super-admin-panel', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: filterData.ALL_UNITS,
      units: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getPastUnits = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/past_unit');
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: filterData.PAST_UNITS,
      pastUnits: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

//stg-azback.softelevation.com/admin/super-admin-panel

export const getCorporateAccountSu =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: filterData.LOAD });
    try {
      // Call api to authenticate user
      const api_url = strictValidNumber(data)
        ? '/admin/all-corporate-account?trip_id=' + data
        : '/admin/all-corporate-account';
      const res = await api.get(api_url, {
        data,
      });
      // If not valid response object
      if (!validObjectWithParameterKeys(res, ['data'])) {
        await dispatch({
          type: filterData.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: filterData.ALL_CORPORATE_ACCOUNT,
        all_corporates: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: filterData.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: filterData.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const getInvoiceCharges = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/super-admin-panel', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.GET_INVOICE_LOAD,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.GET_INVOICE_SUCCESS,
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.GET_INVOICE_FAIL,
      error,
    });
    return false;
  }
};
export const getUnitDrivers = () => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/driver');
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: filterData.ALL_UNIT_DRIVERS,
      drivers: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const deleteUnit = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.delete(`/admin/unit/${data}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    await dispatch({
      type: filterData.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getUnitVehicles = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get('/admin/vehicle');
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: filterData.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: filterData.ALL_VEHICLE_CODE,
      vehicles_code: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: filterData.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: filterData.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const resetMessage = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: filterData.RESET_MESSAGE });
};
