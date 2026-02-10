import { cdfConstants } from "./constants";

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  save_cdf: [],
  cdf: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case cdfConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
      };
    case cdfConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
      };
    case cdfConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case cdfConstants.ALL_CDF:
      return {
        ...state,
        cdf: action.cdf,
        isLoadInner: true,
      };

    case cdfConstants.SAVE_CDF:
      return {
        ...state,
        save_cdf: action.save_cdf,
        isLoadInner: true,
      };
    case cdfConstants.FLUSH:
      return {
        ...state,
        message: null,
      };
    case cdfConstants.FLUSH_ERR:
      return {
        ...state,
        loadErr: null,
      };
    // Default
    default:
      return state;
  }
}
