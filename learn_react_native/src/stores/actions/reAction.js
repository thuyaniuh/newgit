import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

// Action types
export const FETCH_RE = "FETCH_RE";
export const ADD_USER = "ADD_USER";
export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";

// Fetch RE with pagination and search
export const fetchRE = (page = 1, search = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        // console.log("aaaa", token);
        const response = await api.get(`api/revenue_expenditure?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        dispatch({
            type: FETCH_RE,
            payload: response.data,
        });
    } catch (error) {
        console.error("Error fetching RE:", error);
    }
};

// Add a new user
export const addUser = (userData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.post("api/revenue_expenditure", userData, {
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
        const response = await api.put(`api/RE/${id}`, userData, {
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
        await api.delete(`api/RE/${id}`, {
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
