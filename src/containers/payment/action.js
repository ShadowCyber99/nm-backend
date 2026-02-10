import { decrypted, encrypted } from '../../utils/common-utils';
import { paymentConstants } from './constants';

export const getAllPayments = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.LOAD });
  data = encrypted(data);
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/all-payment', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: paymentConstants.PAYMENT_LIST_SUCCESS,
      payments: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: paymentConstants.LOAD_SUCCESS,
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getCorporateAccounts =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: paymentConstants.CORPORATE_ACCOUNTS_LOAD });
    data = encrypted(data);
    try {
      // Call api to authenticate user
      const res = await api.get('/admin/all-corporate-account', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: paymentConstants.CORPORATE_ACCOUNTS_LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: paymentConstants.CORPORATE_ACCOUNTS_SUCCESS,
        data: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: paymentConstants.CORPORATE_ACCOUNTS_LOAD_SUCCESS,
      });
      return decrypted(res.data);
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: paymentConstants.CORPORATE_ACCOUNTS_LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const addPaymentDetails = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.LOAD });
  data = encrypted(data);
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/add-payment', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: paymentConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const updatePaymentDetails = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { id, values } = v;
  let data = {
    ...values,
  };
  dispatch({ type: paymentConstants.LOAD });
  data = encrypted(data);
  try {
    // Call api to authenticate user
    const res = await api.put(`/admin/add-payment/${id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: paymentConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getFilterInvoice = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.FILTER_INVOICES_LOAD });

  data = encrypted(data);
  try {
    const res = await api.post('/admin/payment-invoice', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.FILTER_INVOICES_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.FILTER_INVOICES_SUCCESS,
      // message: res.message,
    });
    await dispatch({
      type: paymentConstants.FILTER_INVOICES_SUCCESS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.FILTER_INVOICES_LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const deletePaymentId = (id) => async (dispatch, getState, api) => {
  try {
    const res = await api.delete(`/admin/all-payment/${id}`);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const applyInvoiceId = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.LOAD });
  data = encrypted(data);
  try {
    const res = await api.post(`/admin/save-payment`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getUnApplyInvoice = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.UNAPPLY_INVOICES_LOAD });

  data = encrypted(data);
  try {
    const res = await api.post('/admin/payment-invoice', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.UNAPPLY_INVOICES_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.UNAPPLY_INVOICES_LOAD_SUCCESS,
      // message: res.message,
    });
    await dispatch({
      type: paymentConstants.UNAPPLY_INVOICES_SUCCESS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.UNAPPLY_INVOICES_LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const unApplyInvoiceId = (data) => async (dispatch, getState, api) => {
  // Start loading
  // dispatch({ type: paymentConstants.LOAD });
  data = encrypted(data);
  try {
    const res = await api.post(`/admin/un-apply-payment`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getPaymentAudit = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.AUDIT_DETAILS_LOAD });
  data = encrypted(data);
  try {
    const res = await api.post(`/admin/payment-audit`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.AUDIT_DETAILS_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.AUDIT_DETAILS_LOAD_SUCCESS,
      message: res.message,
    });
    await dispatch({
      type: paymentConstants.AUDIT_DETAILS_SUCCESS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.AUDIT_DETAILS_LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getPaymentByID = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: paymentConstants.PAYMENT_ID_LOAD });
  try {
    const res = await api.get(`/admin/payment/${data}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: paymentConstants.PAYMENT_ID_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: paymentConstants.PAYMENT_ID_LOAD_SUCCESS,
      message: res.message,
    });
    await dispatch({
      type: paymentConstants.PAYMENT_ID_DETAILS_SUCCESS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: paymentConstants.PAYMENT_ID_LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const flushPaymentId = (data) => async (dispatch, getState, api) => {
  // Start loading
  try {
    await dispatch({
      type: paymentConstants.PAYMENT_ID_DETAILS_SUCCESS,
      data: {},
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    return false;
  }
};
