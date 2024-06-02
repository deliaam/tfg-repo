import { SAVE_CLASS } from '../actions';

const initialState = { classObj: null };

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SAVE_CLASS:
            return {
                classObj: payload.classObj
            };
        default:
            return state;
    }
}
