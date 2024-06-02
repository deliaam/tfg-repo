import { combineReducers } from 'redux';

// reducer import
import auth from './reducers/auth';
import message from './reducers/message';
import menu from './reducers/menu';
import classObj from './reducers/class';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    auth,
    message,
    menu,
    classObj
});

export default reducer;
