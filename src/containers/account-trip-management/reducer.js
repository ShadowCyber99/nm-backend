import { accountTripConstants } from "./constants";
const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  all_trip_acounts: [],
  all_corporates: [],
  saved_item: null,
  completed: [],
  save_quotation: {},
  errData: {},
  save_leg: {},
  total_trips: 0,
  total_trips_completed:0,
  saveFilters: {},
  getFilters: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case accountTripConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case accountTripConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case accountTripConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        errData: action.errData,
      };

    case accountTripConstants.FLUSH:
      return {
        ...state,
        message: null,
        errData: {},
        loadErr: '',
      };
    case accountTripConstants.ALL_TRIP_ACCOUNTS:
      return {
        ...state,
        all_trip_acounts: action.all_trips,
        total_trips: action.total_trips,
        isLoadInner: true,
      };
    case accountTripConstants.ALL_CORPORATE_ACCOUNT:
      return {
        ...state,
        all_corporates: action.all_corporates,
      };
    case accountTripConstants.SAVE_TRIP_ACCOUNTS:
      return {
        ...state,
        saved_item: action.saved_item,
      };
    case accountTripConstants.SAVE_LEG:
      return {
        ...state,
        save_leg: action.save_leg,
      };
    case accountTripConstants.ALL_COMPLETED_TRIPS:
      return {
        ...state,
        completed: action.completed_trips,
        total_trips_completed: action.total_trips_completed,
        isLoadInner: true,
      };
    case accountTripConstants.GET_QUOTE:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case accountTripConstants.GET_QUOTE_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        save_quotation: action.save_quotation,
      };
    case accountTripConstants.GET_QUOTE_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
        errData: action.errData,
      };
    case accountTripConstants.FLUSH_QUOTATION:
      return {
        ...state,
        isLoad: false,
        message: null,
        save_quotation: {},
        errData: {},
      };
    case accountTripConstants.SAVE_FILTERS:
      return {
        ...state,
        saveFilters: action.saveFilters,
      };
    case accountTripConstants.GET_FILTERS:
      return {
        ...state,
        getFilters: action.getFilters,
      };
    // Default
    default:
      return state;
  }
}
