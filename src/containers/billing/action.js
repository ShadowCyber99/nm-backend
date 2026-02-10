import ApiClient from '../../redux/lib/api-client';
import {
  decrypted,
  encrypted,
  strictValidNumber,
  strictValidObjectWithKeys,
  validObjectWithParameterKeys,
} from '../../utils/common-utils';
import { billingConstants } from './constants';

export const getAllInvoicing = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.LOAD });

  let payload = { limit: data?.limit, skip: data?.skip, search: data?.search };
  data = encrypted(data);
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/invoice', {
      data,
      params: strictValidObjectWithKeys(payload) && payload,
    });
    let decrypted_data = decrypted(res.data);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: billingConstants.LOAD_SUCCESS,
    });
    // Else if valid response continue
    await dispatch({
      type: billingConstants.ALL_INVOICING,
      data:
        strictValidObjectWithKeys(decrypted_data) &&
        strictValidObjectWithKeys(decrypted_data.data)
          ? decrypted_data.data.data
          : [],
      total:
        strictValidObjectWithKeys(decrypted_data) &&
        strictValidObjectWithKeys(decrypted_data.data)
          ? decrypted_data.data.recordsTotal
          : 0,
      errorMessage: decrypted(res.data).active_trip_message,
    });

    return decrypted_data.data;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getCompletedTripInvoicing =
  (obj) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: billingConstants.ALL_COMPLETED_INVOICING_LOAD });
    let data = encrypted(obj.state);
    try {
      // Call api to authenticate user
      const res = await api.post('/admin/completed-trip-invoice', {
        params: obj.payload,
        data: data,
      });
      let decrypted_data = decrypted(res.data);
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.ALL_COMPLETED_INVOICING_LOAD_FAIL,
          error: res.message,
        });
        return false;
      }
      // Else if valid response continue

      await dispatch({
        type: billingConstants.ALL_COMPLETED_INVOICING,
        completed_invoice:
          strictValidObjectWithKeys(decrypted_data) &&
          strictValidObjectWithKeys(decrypted_data.data)
            ? decrypted_data.data.data
            : [],
        totalRecords:
          strictValidObjectWithKeys(decrypted_data) &&
          strictValidObjectWithKeys(decrypted_data.data)
            ? decrypted_data.data.recordsTotal
            : 0,
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: billingConstants.ALL_COMPLETED_INVOICING_LOAD_SUCCESS,
      });
      return decrypted(res.data);
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.ALL_COMPLETED_INVOICING_LOAD_FAIL,
        error,
      });
      return false;
    }
  };

// Filter invoicing

export const getFilterInvoice = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.LOAD });
  data = encrypted(data);
  try {
    // Call api to authenticate user
    const res = await api.post('/admin/temp-invoice', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: billingConstants.FILTER_INVOICING,
      data: res.data,
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: billingConstants.LOAD_SUCCESS,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
// Finalize Invoice Api

export const updateBilledInvoice =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/update-billed-invoice`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const updateDateBilledInvoice =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    // dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/update-date-billed-invoice`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const deleteBilledInvoice =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/delete-billed-invoice`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const finalizeInvoicing = (data) => async (dispatch, getState, api) => {
  // Start loading
  data = encrypted(data);
  dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/finalized-invoice`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    else {
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    }
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getPdfFromTrip = (data) => async (dispatch, getState, api) => {
  data = encrypted(data);
  // dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/invoice-pfd`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getExcelFromAccount =
  (data) => async (dispatch, getState, api) => {
    data = encrypted(data);
    // dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/download-excel`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }
      return decrypted(res.data);
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
const api = new ApiClient();
export const downloadExcel = async (data) => {
  data = encrypted(data);
  // dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/download-invoice-excel`, { data });
    // If not valid response object
    return decrypted(res.data);
  } catch (error) {
    return false;
  }
};
export const downloadAccountExcel = async (data) => {
  data = encrypted(data);
  // dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/download-account-excel`, { data });
    // If not valid response object
    return decrypted(res.data);
  } catch (error) {
    return false;
  }
};
export const downloadInvoiceExcel = async (data) => {
  data = encrypted(data);
  // dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/export-final-invoice`, { data });
    // If not valid response object
    return decrypted(res.data);
  } catch (error) {
    return false;
  }
};

export const getDownloadedInvocing =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.get(`/admin/finalized-invoice`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      else {
        await dispatch({
          type: billingConstants.FINALIZED_INVOICE,
          data: decrypted(res.data),
        });
        // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
        await dispatch({
          type: billingConstants.LOAD_SUCCESS,
          message: res.message,
        });
        return true;
      }
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
export const createInvoicing = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post('/admin/create-invoice', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    else {
      await dispatch({
        type: billingConstants.CREATE_INVOICE,
        data: { ...decrypted(res.data) },
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    }
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getTripLogs = (v) => async (dispatch, getState, api) => {
  // Start loading
  const { leg_id } = v;
  const data = { leg_id };
  dispatch({ type: billingConstants.GET_TRIPLOG_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/get-triplog/${leg_id}`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.GET_TRIPLOG_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: billingConstants.GET_TRIPLOG_SUCCESS,
      get_triplog: decrypted(res.data),
    });
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.GET_FEEDBACK_FAIL,
      error,
    });
    return false;
  }
};

export const flushLog = (data) => async (dispatch, getState) => {
  dispatch({
    type: billingConstants.TRIP_LOG_FLUSH,
    get_triplog: {},
  });
};

export const resetMessage = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.FLUSH });
};
export const billedInvoice = (obj) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.LOAD });
  const data = {
    type: obj.type,
    search: obj.search,
  };
  try {
    const res = await api.post(
      `/admin/final-invoice?limit=${obj.limit}&skip=${obj.skip}`,
      { data: encrypted(data) },
    );
    // If not valid response object
    const records = decrypted(res.data);

    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    await dispatch({
      type: billingConstants.LOAD_SUCCESS,
      // message: res.message,
    });
    await dispatch({
      type: billingConstants.BILLED_INVOICE,
      data: decrypted(res.data),
      totalRecords: strictValidNumber(records.count) ? records.count : 0,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const socketBilledInvoice = (obj) => async (dispatch, getState, api) => {
  const stateData = getState().billing.validateInvoice.saveState;
  const data = {
    type: stateData.type,
    search: stateData.search,
  };
  try {
    const res = await api.post(
      `/admin/final-invoice?limit=${stateData.limit}&skip=${stateData.skip}`,
      { data: encrypted(data) },
    );
    const records = decrypted(res.data);
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: billingConstants.BILLED_INVOICE,
      data: decrypted(res.data),
      totalRecords: strictValidNumber(records.count) ? records.count : 0,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const billedUpdateInvoice = () => async (dispatch, getState, api) => {
  // Start loading
  try {
    const res = await api.get('/admin/billed-invoice');
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
    await dispatch({
      type: billingConstants.LOAD_SUCCESS,
      // message: res.message,
    });
    await dispatch({
      type: billingConstants.BILLED_INVOICE,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const resetFilterInvoice = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.FLUSH_FILTER_INVOICING });
};
export const deleteInvoice = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.LOAD });
  try {
    // Call api to authenticate user
    data = encrypted(data);
    const res = await api.post(`/admin/invoice-status`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue

    await dispatch({
      type: billingConstants.LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const updateBillingNotesInInvoice =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/change-billing-notes`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const updateValidateInvoice =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/update-invoice`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }
      // Else if valid response continue
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
export const resetInvoiceReducer = (id) => async (dispatch, getState, api) => {
  dispatch({ type: billingConstants.All_INVOICE_FLUSH });
};
export const getPartialInvoiceById =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.PARTIAL_INVOICE_LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/get-receive-invoice`, { data });
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.PARTIAL_INVOICE_LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.PARTIAL_INVOICE_LOAD_SUCCESS,
        message: res.message,
      });
      await dispatch({
        type: billingConstants.PARTIAL_INVOICE,
        data: decrypted(res.data),
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.PARTIAL_INVOICE_LOAD_FAIL,
        error,
      });
      return false;
    }
  };
export const updatePaymentInvoice =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    data = encrypted(data);
    dispatch({ type: billingConstants.PARTIAL_INVOICE_LOAD });
    try {
      // Call api to authenticate user
      const res = await api.post(`/admin/save-receive-invoice`, { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.PARTIAL_INVOICE_LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.PARTIAL_INVOICE_LOAD_SUCCESS,
        message: res.message,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.PARTIAL_INVOICE_LOAD_FAIL,
        error,
      });
      return false;
    }
  };
export const saveInvoiceStatus = (data) => async (dispatch, getState, api) => {
  // Start loading
  data = encrypted(data);
  dispatch({ type: billingConstants.SAVE_INVOICE_STATUS_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/save-billing-payment`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.SAVE_INVOICE_STATUS_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: billingConstants.SAVE_INVOICE_STATUS_LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.SAVE_INVOICE_STATUS_LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const resetInvoiceStatus = (id) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.FLUSH_INVOICE_STATUS });
};

export const deleteInvoiceId = (data) => async (dispatch, getState, api) => {
  // Start loading
  data = encrypted(data);
  dispatch({ type: billingConstants.DELETE_INVOICE_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.post(`/admin/remove-receive-invoice`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.DELETE_INVOICE_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: billingConstants.DELETE_INVOICE_LOAD_SUCCESS,
      message: res.message,
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.DELETE_INVOICE_LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const getPaymentMethod = (data) => async (dispatch, getState, api) => {
  // Start loading
  data = encrypted(data);
  dispatch({ type: billingConstants.PAYMENT_LOAD });
  try {
    // Call api to authenticate user
    const res = await api.get(`/admin/paying-type`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.PAYMENT_FAIL,
        error: res.message,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: billingConstants.SAVE_PAYMENT_METHODS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.PAYMENT_FAIL,
      error,
    });
    return false;
  }
};

export const getAllPaymentsOnBilling =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: billingConstants.LOAD });
    data = encrypted(data);
    try {
      // Call api to authenticate user
      const res = await api.post('/admin/all-payment', { data });
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.PAYMENT_LIST_SUCCESS,
        data: decrypted(res.data),
      });
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
      });
      return decrypted(res.data);
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };

export const getCorporateAccounts =
  (data) => async (dispatch, getState, api) => {
    // Start loading
    dispatch({ type: billingConstants.LOAD });
    try {
      // Call api to authenticate user
      const api_url = strictValidNumber(data)
        ? '/admin/get-account-billing?trip_id=' + data
        : '/admin/get-account-billing';
      const res = await api.get(api_url, {
        data,
      });
      // If not valid response object
      if (!validObjectWithParameterKeys(res, ['data'])) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }

      // Else if valid response continue
      await dispatch({
        type: billingConstants.ALL_CORPORATE_ACCOUNT,
        all_corporates_billing: decrypted(res.data),
      });
      // dispatch({ type : googleAnalyticsConstants.CONNECT, _id : res.data._id})
      await dispatch({
        type: billingConstants.LOAD_SUCCESS,
      });
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
export const getValidateInvoice = (obj) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.LOAD });
  // const data = encrypted(obj);
  const data = {
    type: obj.type,
    search: obj.search,
  };

  try {
    const res = await api.post(
      `/admin/final-invoice?limit=${obj.limit}&skip=${obj.skip}`,
      { data: encrypted(data) },
    );
    // If not valid response object
    const records = decrypted(res.data);
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: billingConstants.LOAD_SUCCESS,
      // message: res.message,
    });
    if (obj.reducer === 'validate') {
      await dispatch({
        type: billingConstants.VALIDATE_INVOICE,
        [obj.reducer]: decrypted(res.data),
      });
    } else if (obj.reducer === 'locked') {
      await dispatch({
        type: billingConstants.LOCKED_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'sent') {
      await dispatch({
        type: billingConstants.SENT_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'partPaid') {
      await dispatch({
        type: billingConstants.PART_PAID_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'fullyPaid') {
      await dispatch({
        type: billingConstants.FULLY_PAID_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'refunded') {
      await dispatch({
        type: billingConstants.REFUNDED_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'uninvoiced') {
      await dispatch({
        type: billingConstants.UN_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'disputed') {
      await dispatch({
        type: billingConstants.DISPUTED_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'disputedAccepted') {
      await dispatch({
        type: billingConstants.DISPUTED_ACCEPTED_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    } else if (obj.reducer === 'canceled') {
      await dispatch({
        type: billingConstants.CANCELLED_INVOICE,
        [obj.reducer]: decrypted(res.data),
        total_invoice: strictValidNumber(records.count) ? records.count : 0,
      });
    }
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.LOAD_FAIL,
      error,
    });
    return false;
  }
};
export const socketValidateInvoice =
  (obj) => async (dispatch, getState, api) => {
    // Start loading
    const stateData = getState().billing.validateInvoice.saveState;
    const dataCustom = {
      type: stateData.type,
      search: stateData.search,
    };
    let data = encrypted(dataCustom);
    try {
      const res = await api.post(
        `/admin/final-invoice?limit=${stateData.limit}&skip=${stateData.skip}`,
        { data: data },
      );
      // If not valid response object
      if (res.status === 0) {
        await dispatch({
          type: billingConstants.LOAD_FAIL,
          error: res.message,
        });
        return false;
      }
      if (obj.reducer === 'validate') {
        await dispatch({
          type: billingConstants.VALIDATE_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'locked') {
        await dispatch({
          type: billingConstants.LOCKED_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'sent') {
        await dispatch({
          type: billingConstants.SENT_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'partPaid') {
        await dispatch({
          type: billingConstants.PART_PAID_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'fullyPaid') {
        await dispatch({
          type: billingConstants.FULLY_PAID_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'refunded') {
        await dispatch({
          type: billingConstants.REFUNDED_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'uninvoiced') {
        await dispatch({
          type: billingConstants.UN_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'disputed') {
        await dispatch({
          type: billingConstants.DISPUTED_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'disputedAccepted') {
        await dispatch({
          type: billingConstants.DISPUTED_ACCEPTED_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      } else if (obj.reducer === 'canceled') {
        await dispatch({
          type: billingConstants.CANCELLED_INVOICE,
          [obj.reducer]: decrypted(res.data),
        });
      }
      return true;
    } catch (error) {
      // If an error occurs, set error field
      dispatch({
        type: billingConstants.LOAD_FAIL,
        error,
      });
      return false;
    }
  };
// validate: [],
//   locked: [],
//   partPaid: [],
//   fullyPaid: [],
//   refunded: [],
//   uninvoiced: [],
//   disputed: [],
//   disputedAccepted: [],
//   canceled: [],
export const getBillingAudit = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.AUDIT_DETAILS_LOAD });
  data = encrypted(data);
  try {
    const res = await api.post(`/admin/billing-log`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.AUDIT_DETAILS_LOAD_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: billingConstants.AUDIT_DETAILS_LOAD_SUCCESS,
      message: res.message,
    });
    await dispatch({
      type: billingConstants.AUDIT_DETAILS_SUCCESS,
      data: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.AUDIT_DETAILS_LOAD_FAIL,
      error,
    });
    return false;
  }
};

export const getTripDetails = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.TRIP_DETAILS_LOAD });
  data = encrypted(data);
  try {
    const res = await api.post(`/admin/filter-invoice`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.TRIP_DETAILS_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: billingConstants.TRIP_DETAILS_SUCCESS,
      trip_details: decrypted(res.data),
    });
    return decrypted(res.data);
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.INVOICE_AUDIT_FAIL,
      error,
    });
    return false;
  }
};

export const invoiceAudit = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.INVOICE_AUDIT_LOAD });
  data = encrypted(data);
  try {
    const res = await api.post(`/admin/invoice-audit`, { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.INVOICE_AUDIT_FAIL,
        error: res.message,
      });
      return false;
    }
    await dispatch({
      type: billingConstants.INVOICE_AUDIT_SUCCESS,
      invoice_audit: decrypted(res.data),
    });
    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.INVOICE_AUDIT_FAIL,
      error,
    });
    return false;
  }
};

export const saveState = (data) => async (dispatch, getState, api) => {
  dispatch({
    type: billingConstants.SAVE_STATE,
    saveState: data,
  });
};

export const getState = (data) => async (dispatch, getState, api) => {
  const data = getState().billing.validateInvoice.saveState;
  dispatch({
    type: billingConstants.GET_STATE,
    getState: data,
  });
};

export const updateCharge = (data) => async (dispatch, getState, api) => {
  // Start loading
  dispatch({ type: billingConstants.VERIFY_INVOICE_LOAD });
  try {
    data = encrypted(data);
    // Call api to authenticate user
    const res = await api.post('/admin/update-charge', { data });
    // If not valid response object
    if (res.status === 0) {
      await dispatch({
        type: billingConstants.VERIFY_INVOICE_FAIL,
      });
      return false;
    }

    // Else if valid response continue
    await dispatch({
      type: billingConstants.VERIFY_INVOICE_SUCCESS,
    });

    return true;
  } catch (error) {
    // If an error occurs, set error field
    dispatch({
      type: billingConstants.VERIFY_INVOICE_FAIL,
      error,
    });
    return false;
  }
};
