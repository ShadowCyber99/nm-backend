import { corporateConstants } from './constants';
import {
  decrypted,
  encrypted,
  strictValidArrayWithLength,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';

export const createCorporateAccount =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: corporateConstants.LOAD });
    try {
      // Call api to authenticate user
      data = encrypted(data);
      const res = await api.post('/admin/corporate-account', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: corporateConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: corporateConstants.SAVE_CORPORATE_ACCOUNTS,
        save_item: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: corporateConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: corporateConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const updateCorporateAccountByID =
  (v) => async (dispatch, getState, api) => {
    const { account_id, values } = v;

    let data = {
      ...values,
    };
    data = encrypted(data);
    // Start loading
    dispatch({ type: corporateConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.put(`/admin/corporate-account/${account_id}`, {
        data,
      });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: corporateConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: corporateConstants.SAVE_CORPORATE_ACCOUNTS,
        save_item: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: corporateConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: corporateConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const getInvoiceCharge = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: corporateConstants.GET_INVOICE_LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/corporate-account-charge', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: corporateConstants.GET_INVOICE_LOAD,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: corporateConstants.GET_INVOICE_SUCCESS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: corporateConstants.GET_INVOICE_FAIL,
      error,
    });
    return false;
  }
};

export const invoiceFlush = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: corporateConstants.INVOICE_FLUSH });
};

export const getCorporateAccounts =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: corporateConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/corporate-account', { data });
      // If not valid response object
      if (!validObjectWithParameterKeys(res, ['data'])) {
        await dispatch({
          type: corporateConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: corporateConstants.ALL_CORPORATE_ACCOUNTS,
        all_accounts: strictValidArrayWithLength(decrypted(res.data))
          ? decrypted(res.data)
          : [],
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: corporateConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: corporateConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const deleteCorporateAccountByID =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: corporateConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.delete(`/admin/corporate-account/${data}`);
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: corporateConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue

      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: corporateConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: corporateConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const flushError = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: corporateConstants.FLUSH_ERROR });
};
