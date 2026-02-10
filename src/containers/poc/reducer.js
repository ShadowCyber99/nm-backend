import { pocConstants } from './constants';
import { combineReducers } from 'redux';

const initialState = {
  isLoadInner: false,
  isLoad: false,
  message: null,
  loadErr: null,
  data: [],
  locations: [],
};
function getLocation(state = initialState, action) {
  switch (action.type) {
    // Loading
    case pocConstants.LOAD:
      return {
        ...state,
        isLoad: true,
        loadErr: null,
        isLoadInner: false,
      };
    case pocConstants.LOAD_SUCCESS:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        data: action.data,
      };
    case pocConstants.LOAD_FAIL:
      return {
        ...state,
        isLoad: false,
        loadErr: action.error,
        message: null,
      };
    case pocConstants.POC_FLUSH:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        locations: [],
      };
    case pocConstants.SEND_ID:
      return {
        ...state,
        isLoad: false,
        loadErr: null,
        locations: action.locations,
      };
    default:
      return state;
  }
}
const reducer = combineReducers({
  getLocation,
});

export default reducer;
