import { unitStatusConstants } from './constants';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // Loading
    case unitStatusConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case unitStatusConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        message: action.message,
   
      };
    case unitStatusConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };

    case unitStatusConstants.ALL_UNIT_STATUS:
      return {
        ...state,
        data: action.data,
        isLoad: false,
        isLoadInner: true,
      };
    // Default
    default:
      return state;
  }
}
