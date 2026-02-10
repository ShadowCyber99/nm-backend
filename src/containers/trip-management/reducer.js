import { tripConstants } from './constants';
import { combineReducers } from 'redux';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  errData: {},
  data: [],
  total_trips: 0,
  all_corporates: [],
  saved_item: null,
  save_quotation: {},
  save_feedback: {},
  get_feedback: {},
  get_reason: {},
  save_leg: {},
  saveFilters: {},
  getFilters: {},
  saveCompletd: {},
  getCompletd: {},
  saveArchived: {},
  getArchived: {},
  get_triplog: {},
  logs_load: false,
  archived_trips: [],
};

function allTrips(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case tripConstants.SAVE_TRIP_ACCOUNTS:
      return {
        ...state,
        saved_item: action.saved_item,
      };
    case tripConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        errData: action.errData,
        message: null,
      };

    case tripConstants.FLUSH:
      return {
        ...state,
        message: null,
        errData: {},
        loadErr: null,
      };

    case tripConstants.SAVE_FILTERS:
      return {
        ...state,
        saveFilters: action.saveFilters,
      };
    case tripConstants.GET_FILTERS:
      return {
        ...state,
        getFilters: action.getFilters,
      };
    case tripConstants.ALL_TRIP_ACCOUNTS:
      return {
        ...state,
        data: action.all_trips,
        total_trips: action.total_trips,
        isLoadInner: true,
      };
    case tripConstants.SAVE_LEG:
      return {
        ...state,
        save_leg: action.save_leg,
      };
    case tripConstants.ALL_CORPORATE_ACCOUNT:
      return {
        ...state,
        all_corporates: action.all_corporates,
      };
    // Default
    default:
      return state;
  }
}
function getQuotation(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.GET_QUOTE:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.GET_QUOTE_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        save_quotation: action.save_quotation,
      };
    case tripConstants.GET_QUOTE_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        errData: action.errData,
      };
    case tripConstants.FLUSH_QUOTATION:
      return {
        ...state,
        isLoad: false,
        message: null,
        save_quotation: {},
        errData: {},
      };
    default:
      return state;
  }
}

function addFeedback(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.ADD_FEEDBACK_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.ADD_FEEDBACK_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        save_feedback: action.save_feedback,
      };
    case tripConstants.ADD_FEEDBACK_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case tripConstants.FEEDBACK_MESSAGE_FLUSH:
      return {
        ...state,
        isLoad: false,
        message: null,
      };
    // Default
    default:
      return state;
  }
}

function getReasons(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.GET_REASONS_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.GET_REASONS_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        get_reason: action.get_reason,
      };
    case tripConstants.GET_REASONS_FAIL:
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

function archivedTrips(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.ARCHIVED_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.ARCHIVED_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case tripConstants.ARCHIVED_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case tripConstants.SAVE_FILTERS_ARCHIVED:
      return {
        ...state,
        saveArchived: action.saveArchived,
      };
    case tripConstants.GET_FILTERS_ARCHIVED:
      return {
        ...state,
        getArchived: action.getArchived,
      };
    case tripConstants.ALL_ARCHIVED_TRIPS:
      return {
        ...state,
        archived_trips: action.archived_trips,
        total_trips: action.total_trips,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}

function getTripLogs(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.GET_TRIPLOG_LOAD:
      return {
        ...state,
        logs_load: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.GET_TRIPLOG_SUCCESS:
      return {
        ...state,
        logs_load: false,
        loadErr: null,
        message: action.message,
        get_triplog: action.get_triplog,
      };
    case tripConstants.GET_TRIPLOG_FAIL:
      return {
        ...state,
        logs_load: false,
        loadErr: action.error,
        message: null,
      };
    case tripConstants.TRIP_LOGS_FLUSH:
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

function getFeedback(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.GET_FEEDBACK_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.GET_FEEDBACK_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
        get_feedback: action.get_feedback,
      };
    case tripConstants.GET_FEEDBACK_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case tripConstants.GET_FEEDBACK_FLUSH:
      return {
        ...state,
        isLoad: false,
        message: null,
        get_feedback: {},
      };
    // Default
    default:
      return state;
  }
}

function completedTrips(state = initialState, action) {
  switch (action.type) {
    // Loading
    case tripConstants.COMPLETED_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case tripConstants.COMPLETED_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case tripConstants.COMPLETED_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case tripConstants.SAVE_FILTER_COMPLETED:
      return {
        ...state,
        saveCompletd: action.saveCompletd,
      };
    case tripConstants.GET_FILTER_COMPLETED:
      return {
        ...state,
        getCompletd: action.getCompletd,
      };
    case tripConstants.ALL_COMPLETED_TRIPS:
      return {
        ...state,
        data: action.completed_trips,
        total_trips: action.total_trips,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}
const reducer = combineReducers({
  allTrips,
  completedTrips,
  getQuotation,
  addFeedback,
  getFeedback,
  getReasons,
  getTripLogs,
  archivedTrips,
});

export default reducer;
