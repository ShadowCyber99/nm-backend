import { filterData } from './constants';

const initialState = {
  isLoadInner: false,
  isLoadPastInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  units: [],
  pastUnits: [],
  drivers: [],
  vehicles_code: [],
  invoicePrice: {},
  all_corporates: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case filterData.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case filterData.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case filterData.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case filterData.GET_INVOICE_LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case filterData.GET_INVOICE_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        invoicePrice: action.data,
      };
    case filterData.GET_INVOICE_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case filterData.FLUSH:
      return {
        ...state,
        message: null,
      };
    case filterData.ALL_UNITS:
      return {
        ...state,
        units: action.units,
        isLoadInner: true,
      };
    case filterData.PAST_UNITS:
      return {
        ...state,
        pastUnits: action.pastUnits,
        isLoadPastInner: true,
      };
    case filterData.ALL_UNIT_DRIVERS:
      return {
        ...state,
        drivers: action.drivers,
      };
    case filterData.ALL_VEHICLE_CODE:
      return {
        ...state,
        vehicles_code: action.vehicles_code,
      };
    case filterData.ALL_CORPORATE_ACCOUNT:
      return {
        ...state,
        all_corporates: action.all_corporates,
      };
    case filterData.RESET_MESSAGE:
      return {
        ...state,
        message: null,
        loadErr: null,
      };
    // Default
    default:
      return state;
  }
}
