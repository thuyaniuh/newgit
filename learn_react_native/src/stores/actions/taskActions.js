// actions/taskActions.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchTasks = (projectId) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        const response = await api.get(
            `api/tasks/projects/${projectId}?page=${1}&search=&projectId=${projectId}`,
            {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            }
        );
        dispatch({
            type: "FETCH_TASKS",
            payload: response.data,
        });
    } catch (error) {
        console.log(error);
    }
};
export const add_task = (data) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            return false;
        }
        console.log(data);
        const response = await api.post("api/tasks/store", data, {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateTask = (taskId, updatedData) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await api.post("api/tasks/update2", updatedData, {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
        });
    } catch (error) {
        console.log(error);
    }
};
export const deleteTask = (taskId) => async (dispatch) => {
    // Delete a specific task
};
