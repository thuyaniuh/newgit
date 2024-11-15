import { FETCH_USERS, ADD_USER, EDIT_USER, DELETE_USER } from '../actions/userActions';

const initialState = {
    users: [],
    totalPages: 1,
    currentPage: 1,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                users: action.payload.data,
                totalPages: action.payload.last_page,
                currentPage: action.payload.current_page,
            };
        case ADD_USER:
            return {
                ...state,
                users: [...state.users, action.payload],
            };
        case EDIT_USER:
            return {
                ...state,
                users: state.users.map(user =>
                    user.user_id === action.payload.user_id ? action.payload : user
                ),
            };
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.user_id !== action.payload),
            };
        default:
            return state;
    }
};
