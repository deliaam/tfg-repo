import * as actionTypes from '../actions';

const initialState = { isOpen: [], opened: true };

export default function (state = initialState, action) {
    let id;

    switch (action.type) {
        case actionTypes.MENU_OPEN:
            id = action.id;
            return {
                ...state,
                isOpen: [id]
            };
        case actionTypes.SET_MENU:
            return {
                ...state,
                opened: action.opened
            };

        default:
            return state;
    }
}
