import {
    FETCH_PROJECT,
    ADD_PROJECT,
    EDIT_PROJECT,
    DELETE_PROJECT,
} from "../actions/projectAction";

const initialState = {
    projects: [],
    totalPages: 1,
    currentPage: 1,
};

export const projectReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PROJECT:
            return {
                ...state,
                projects: action.payload.data, // Điều chỉnh tùy theo cấu trúc response từ API
                totalPages: action.payload.totalPages || action.payload.last_page,
                currentPage: action.payload.currentPage || action.payload.current_page,
            };
        case ADD_PROJECT:
            return {
                ...state,
                projects: [action.payload, ...state.projects],
            };
        case EDIT_PROJECT:
            return {
                ...state,
                projects: state.projects.map((project) =>
                    project.project_id === action.payload.project_id ? action.payload : project
                ),
            };
        case DELETE_PROJECT:
            return {
                ...state,
                projects: state.projects.filter(
                    (project) => project.project_id !== action.payload
                ),
            };
        default:
            return state;
    }
};
