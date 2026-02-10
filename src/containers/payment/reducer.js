import { paymentConstants } from './constants';
import { combineReducers } from 'redux';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errorMessage: null,
  data: [],
  isSuccess: false,
};
const paymentState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errorMessage: null,
  data: [],
  isSuccess: false,
};
const idState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errorMessage: null,
  data: {},
  isSuccess: false,
};
function payment(state = paymentState, action) {
  switch (action.type) {
    // Loading
    case paymentConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        message: null,
      };
    case paymentConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case paymentConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case paymentConstants.PAYMENT_LIST_SUCCESS:
      return {
        ...state,
        data: action.payments,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
function corporateAccounts(state = initialState, action) {
  switch (action.type) {
    // Loading
    case paymentConstants.CORPORATE_ACCOUNTS_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case paymentConstants.CORPORATE_ACCOUNTS_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case paymentConstants.CORPORATE_ACCOUNTS_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case paymentConstants.CORPORATE_ACCOUNTS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
function filterInvoice(state = initialState, action) {
  switch (action.type) {
    // Loading
    case paymentConstants.FILTER_INVOICES_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case paymentConstants.FILTER_INVOICES_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case paymentConstants.FILTER_INVOICES_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case paymentConstants.FILTER_INVOICES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
function unapplyInvoice(state = initialState, action) {
  switch (action.type) {
    // Loading
    case paymentConstants.UNAPPLY_INVOICES_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case paymentConstants.UNAPPLY_INVOICES_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case paymentConstants.UNAPPLY_INVOICES_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case paymentConstants.UNAPPLY_INVOICES_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
function audit(state = initialState, action) {
  switch (action.type) {
    // Loading
    case paymentConstants.AUDIT_DETAILS_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case paymentConstants.AUDIT_DETAILS_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case paymentConstants.AUDIT_DETAILS_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case paymentConstants.AUDIT_DETAILS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
function paymentId(state = idState, action) {
  switch (action.type) {
    // Loading
    case paymentConstants.PAYMENT_ID_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case paymentConstants.PAYMENT_ID_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case paymentConstants.PAYMENT_ID_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case paymentConstants.PAYMENT_ID_DETAILS_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
const reducer = combineReducers({
  payment,
  corporateAccounts,
  filterInvoice,
  unapplyInvoice,
  audit,
  paymentId,
});

export default reducer;
