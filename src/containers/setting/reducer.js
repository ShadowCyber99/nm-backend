import { passwordConstants } from './constants';
import { combineReducers } from 'redux';

const initialState = {
    isLoadInner: false,
    isLoad: false,
    message: null,
    loadErr: null,
    data: [],
    success_message: '',
};

function changePass(state = initialState, action) {
    switch (action.type) {
        // Loading
        case passwordConstants.LOAD:
            return {
                ...state,
                isLoad: true,
                loadErr: '',
                success_message: '',
            };
        case passwordConstants.LOAD_SUCCESS:
            return {
                ...state,
                isLoad: false,
                loadErr: null,
                message: action.message,
                success_message: '',
            };
        case passwordConstants.LOAD_FAIL:
            return {
                ...state,
                isLoad: false,
                loadErr: action.error,
                message: null,
                success_message: '',
            };

        case passwordConstants.SUCCESS:
            return {
                ...state,
                isLoad: false,
                loadErr: null,
                success_message: action.message,
            };
        case passwordConstants.FLUSH_MESSAGES:
            return {
                ...state,
                message: null,
                loadErr: null,
                isLoad: false,
                success_message: '',
            };
        // Default
        default:
            return state;
    }
}
const reducer = combineReducers({
    changePass,
});

export default reducer;