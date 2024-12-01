import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// Action types
export const FETCH_USERS = "FETCH_USERS";
export const FETCH_USERS_TIME = "FETCH_USERS_TIME";
export const ADD_USER = "ADD_USER";
export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";

// Fetch users with pagination and search
export const fetchUsers = (page = 1, search = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        console.log("aaaa", token);
        const response = await api.get(`api/users?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch({
            type: FETCH_USERS,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

export const fetchUsersTime = (user_id , page = 1, search = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        // console.log("aaaa", token);
        const response = await api.get(`api/users/times/${user_id}`, {
        // const response = await api.get(`api/users/times/${user_id}?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        console.log(response)
        dispatch({
            type: FETCH_USERS_TIME,
            payload: response,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
};

// Add a new user
export const addUser = (userData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.post("api/users", userData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: ADD_USER,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error adding user:", error);
    }
};

// Edit an existing user
export const editUser = (id, userData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.post(`api/users/update/${id}`, userData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: EDIT_USER,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error editing user:", error);
    }
};

// Delete a user
export const deleteUser = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        await api.delete(`api/users/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: DELETE_USER,
            payload: id,
        });
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};
