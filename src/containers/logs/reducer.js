import { logsConstants } from "./constants";
import { combineReducers } from "redux";

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};
const initialStateAudit = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};
const initialStateSocket = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: false,
};

function application(state = initialState, action) {
  switch (action.type) {
    // Loading
    case logsConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: "",
        success_message: "",
      };
    case logsConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        success_message: "",
      };
    case logsConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        success_message: "",
      };

    case logsConstants.APPLICATION_LOGS:
      return {
        ...state,
        data: action.application_log,
        isLoadInner: true,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}

function logsAudit(state = initialStateAudit, action) {
  switch (action.type) {
    // Loading
    case logsConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: "",
        success_message: "",
      };
    case logsConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        success_message: "",
      };
    case logsConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        success_message: "",
      };

    case logsConstants.LOGS_AUDIT:
      return {
        ...state,
        logs_audit: action.logs_audit,
        isLoadInner: true,
        isLoad: false,
      };

    case logsConstants.FLUSH_APPLICATION_LOGS:
      return {
        ...state,
        logs_audit: {},
        isLoad: false,
        message: null,
      };
    // Default
    default:
      return state;
  }
}
function audit(state = initialStateSocket, action) {
  switch (action.type) {
    // Loading
    case logsConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: "",
        success_message: "",
      };
    case logsConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        success_message: "",
      };
    case logsConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        success_message: "",
      };

    case logsConstants.AUDIT_LOGS:
      return {
        ...state,
        audit_log: action.audit_log,
        isLoadInner: true,
        isLoad: false,
      };
    // Default
    default:
      return state;
  }
}
const reducer = combineReducers({
  application,
  audit,
  logsAudit,
});

export default reducer;
