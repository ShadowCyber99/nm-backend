import { transportConstants } from './constants';
import { combineReducers } from 'redux';
const tripState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};
const unitState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};
const mtransportState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};
const transportState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};
const finishedTransportState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
  total_ftransport: 0,
  getFilter: {},
  saveFilter: {},
};
export function trip(state = tripState, action) {
  switch (action.type) {
    // Loading
    case transportConstants.TRIP_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case transportConstants.TRIP_LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case transportConstants.TRIP_LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case transportConstants.FLUSH:
      return {
        isLoadInner: false,
        isLoad: false,
        message: null,
        loadErr: null,
        data: [],
      };
    case transportConstants.TRIP_ACCOUNTS:
      return {
        ...state,
        data: action.trip,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}
export function unit(state = unitState, action) {
  switch (action.type) {
    // Loading
    case transportConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case transportConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case transportConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case transportConstants.FLUSH_UNITS:
      return {
        ...state,
        data: [],
        message: null,
      };
    case transportConstants.UNIT_ACCOUNTS:
      return {
        ...state,
        data: action.unit,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}
export function mtransport(state = mtransportState, action) {
  switch (action.type) {
    // Loading
    case transportConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case transportConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case transportConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case transportConstants.FLUSH:
      return {
        ...state,
        message: null,
      };
    case transportConstants.MERGE_ACCOUNTS:
      return {
        ...state,
        data: action.mtransport,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}
export function transport(state = transportState, action) {
  switch (action.type) {
    // Loading
    case transportConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case transportConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case transportConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case transportConstants.FLUSH:
      return {
        ...state,
        message: null,
      };
    case transportConstants.TRANSPORTS_ACCOUNTS:
      return {
        ...state,
        data: action.transport,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}
export function ftransport(state = finishedTransportState, action) {
  switch (action.type) {
    // Loading
    case transportConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case transportConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case transportConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case transportConstants.SAVE_FILTERS:
      return {
        ...state,
        saveFilter: action.saveFilter,
      };
    case transportConstants.GET_FILTERS:
      return {
        ...state,
        getFilter: action.getFilter,
      };

    case transportConstants.FLUSH:
      return {
        ...state,
        message: null,
      };
    case transportConstants.FINISHED_TRANSPORTS_ACCOUNTS:
      return {
        ...state,
        data: action.ftransport,
        total_ftransport: action.total_ftransport,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}

const reducer = combineReducers({
  unit,
  trip,
  transport,
  mtransport,
  ftransport,
});
export default reducer;
