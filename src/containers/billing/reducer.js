import { billingConstants } from './constants';
import { combineReducers } from 'redux';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errorMessage: null,
  data: [],
  isSuccess: false,
  payments: [],
  completed_invoice: [],
  totalRecords: 0,
  all_corporates_billing: [],
  get_triplog: {},
  invoice_audit: {},
  logs_load: false,
  trip_details: {},
  save_state: {},
  get_state: {},
};
const validateInitialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errorMessage: null,
  data: [],
  total_invoice: 0,
  isSuccess: false,
  sent: [],
  validate: [],
  locked: [],
  partPaid: [],
  fullyPaid: [],
  refunded: [],
  uninvoiced: [],
  disputed: [],
  disputedAccepted: [],
  canceled: [],
};
const filterInitialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: {},
};
const partialInvoiceInitialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errorMessage: null,
  data: [],
  isSuccess: false,
};
function invoice(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isLoadInner: false,
      };
    case billingConstants.ALL_CORPORATE_ACCOUNT:
      return {
        ...state,
        all_corporates_billing: action.all_corporates_billing,
      };

    case billingConstants.ALL_INVOICING:
      return {
        ...state,
        data: action.data,
        total: action.total,
        isLoadInner: false,
        isLoad: false,
        errorMessage: action.errorMessage,
      };

    case billingConstants.ALL_COMPLETED_INVOICING:
      return {
        ...state,
        completed_invoice: action.completed_invoice,
        totalRecords: action.totalRecords,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}

function completedInvoice(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.ALL_COMPLETED_INVOICING_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.ALL_COMPLETED_INVOICING_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.ALL_COMPLETED_INVOICING_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isLoadInner: false,
      };

    case billingConstants.ALL_COMPLETED_INVOICING:
      return {
        ...state,
        completed_invoice: action.completed_invoice,
        totalRecords: action.totalRecords,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}

function getTripLogs(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.GET_TRIPLOG_LOAD:
      return {
        ...state,
        logs_load: true,
        loadErr: null,
        isLoadInner: false,
      };
    case billingConstants.GET_TRIPLOG_SUCCESS:
      return {
        ...state,
        logs_load: false,
        loadErr: null,
        message: action.message,
        get_triplog: action.get_triplog,
      };
    case billingConstants.GET_TRIPLOG_FAIL:
      return {
        ...state,
        logs_load: false,
        loadErr: action.error,
        message: null,
      };
    case billingConstants.TRIP_LOG_FLUSH:
      return {
        ...state,
        logs_load: false,
        loadErr: null,
        message: null,
        get_triplog: {},
      };
    // Default
    default:
      return state;
  }
}
function filterInvoice(state = filterInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        data: [],
      };
    case billingConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case billingConstants.FILTER_INVOICING:
      return {
        ...state,
        data: action.data,
        isLoadInner: false,
        isLoad: false,
      };
    case billingConstants.FLUSH_FILTER_INVOICING:
      return initialState;
    // Default
    default:
      return state;
  }
}
function billedInvoice(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case billingConstants.BILLED_INVOICE:
      return {
        ...state,
        data: action.data,
        totalRecords: action.totalRecords,
        isLoadInner: false,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
function tripDetails(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.TRIP_DETAILS_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.TRIP_DETAILS_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        trip_details: action.trip_details,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.TRIP_DETAILS_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    // Default
    default:
      return state;
  }
}

function downloadedInvoice(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case billingConstants.FINALIZED_INVOICE:
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
function validateInvoice(state = validateInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
        isLoadInner: false,
      };
    case billingConstants.SAVE_STATE:
      return {
        ...state,
        saveState: action.saveState,
      };
    case billingConstants.GET_STATE:
      return {
        ...state,
        getState: action.getState,
      };

    case billingConstants.VALIDATE_INVOICE:
      return {
        ...state,
        validate: action.validate || [],
        isLoadInner: true,
        total_invoice: action.validate.count,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.SENT_INVOICE:
      return {
        ...state,
        sent: action.sent || [],
        total_invoice: action.sent.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.LOCKED_INVOICE:
      return {
        ...state,
        locked: action.locked || [],
        total_invoice: action.locked.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.PART_PAID_INVOICE:
      return {
        ...state,
        partPaid: action.partPaid || [],
        total_invoice: action.partPaid.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.FULLY_PAID_INVOICE:
      return {
        ...state,
        fullyPaid: action.fullyPaid || [],
        total_invoice: action.fullyPaid.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.REFUNDED_INVOICE:
      return {
        ...state,
        refunded: action.refunded || [],
        total_invoice: action.refunded.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.UN_INVOICE:
      return {
        ...state,
        uninvoiced: action.uninvoiced || [],
        total_invoice: action.uninvoiced.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.DISPUTED_ACCEPTED_INVOICE:
      return {
        ...state,
        disputedAccepted: action.disputedAccepted || [],
        total_invoice: action.disputedAccepted.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.DISPUTED_INVOICE:
      return {
        ...state,
        disputed: action.disputed || [],
        total_invoice: action.disputed.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.CANCELLED_INVOICE:
      return {
        ...state,
        canceled: action.canceled || [],
        total_invoice: action.canceled.count,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
        loadErr: null,
        message: null,
      };
    // case billingConstants.All_INVOICE_FLUSH:
    //   return {
    //     ...validateInitialState,
    //   };
    // Default
    default:
      return state;
  }
}
function partialInvoice(state = partialInvoiceInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.PARTIAL_INVOICE_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.PARTIAL_INVOICE_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        // message: action.message,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.PARTIAL_INVOICE_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
      };

    case billingConstants.PARTIAL_INVOICE:
      return {
        ...state,
        data: action.data,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
      };
    // Default
    default:
      return state;
  }
}
function invoiceStatus(state = partialInvoiceInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.SAVE_INVOICE_STATUS_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        message: null,
      };
    case billingConstants.SAVE_INVOICE_STATUS_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.SAVE_INVOICE_STATUS_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
      };

    case billingConstants.SAVE_INVOICE_STATUS:
      return {
        ...state,
        data: action.data,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
      };
    case billingConstants.FLUSH_INVOICE_STATUS:
      return {
        ...partialInvoiceInitialState,
      };
    // Default
    default:
      return state;
  }
}
function deleteInvoiceStatus(state = partialInvoiceInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.DELETE_INVOICE_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.DELETE_INVOICE_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        // message: action.message,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.DELETE_INVOICE_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
      };
    // Default
    default:
      return state;
  }
}
function paymentMethod(state = partialInvoiceInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.PAYMENT_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.PAYMENT_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        // message: action.message,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.PAYMENT_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
      };
    case billingConstants.SAVE_PAYMENT_METHODS:
      return {
        ...state,
        data: action.data,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
      };
    // Default
    default:
      return state;
  }
}
function payments(state = partialInvoiceInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.PAYMENT_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.PAYMENT_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        // message: action.message,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.PAYMENT_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
      };
    case billingConstants.PAYMENT_LIST_SUCCESS:
      return {
        ...state,
        data: action.data,
        isLoadInner: true,
        isLoad: false,
        isSuccess: true,
      };
    // Default
    default:
      return state;
  }
}

function audit(state = initialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.AUDIT_DETAILS_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.AUDIT_DETAILS_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        isLoadInner: true,
      };
    case billingConstants.AUDIT_DETAILS_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case billingConstants.AUDIT_DETAILS_SUCCESS:
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

function invoiceAudit(state = partialInvoiceInitialState, action) {
  switch (action.type) {
    // Loading
    case billingConstants.INVOICE_AUDIT_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case billingConstants.INVOICE_AUDIT_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        invoice_audit: action.invoice_audit,
        isLoadInner: true,
        isSuccess: true,
      };
    case billingConstants.INVOICE_AUDIT_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        isSuccess: false,
      };
    // Default
    default:
      return state;
  }
}
const reducer = combineReducers({
  invoice,
  filterInvoice,
  billedInvoice,
  downloadedInvoice,
  validateInvoice,
  partialInvoice,
  invoiceStatus,
  deleteInvoiceStatus,
  paymentMethod,
  payments,
  audit,
  completedInvoice,
  getTripLogs,
  invoiceAudit,
  tripDetails,
});

export default reducer;
