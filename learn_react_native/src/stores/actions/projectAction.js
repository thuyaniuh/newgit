import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FETCH_PROJECT = "FETCH_PROJECT";
export const ADD_PROJECT = "ADD_PROJECT";
export const EDIT_PROJECT = "EDIT_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";

export const fetch_projects = (page = 1, search = "") => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get(`api/projects?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: FETCH_PROJECT,
            payload: response.data, // Cấu trúc payload này sẽ cần điều chỉnh để khớp với reducer
        });
    } catch (error) {
        console.log("Lỗi khi lấy dữ liệu dự án:", error);
    }
};

export const add_projects = (data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.post("api/projects/store", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: ADD_PROJECT,
            payload: response.data,
        });
    } catch (error) {
        console.log("Lỗi khi thêm dự án:", error);
    }
};

export const update_project = (id, data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.put(`api/projects/update/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: EDIT_PROJECT,
            payload: response.data,
        });
    } catch (error) {
        console.log("Lỗi khi cập nhật dự án:", error);
    }
};

export const delete_project = (id) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.delete(`api/projects/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch({
            type: DELETE_PROJECT,
            payload: id,
        });
    } catch (error) {
        console.log("Lỗi khi xóa dự án:", error);
    }
};
