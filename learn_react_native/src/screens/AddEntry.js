import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../stores/actions/userActions";
import { add_task, fetchTasks } from "../stores/actions/taskActions";
import axios from "axios";

function AddTaskScreen({ route, navigation }) {
    const api_url = process.env.API_URL;
    const { projectId } = route.params;
    const { project } = route.params;
    const { user } = route.params;

    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [startDay, setStartDay] = useState("");
    const [endDay, setEndDay] = useState("");
    const [status, setStatus] = useState("");
    const [statusOpen, setStatusOpen] = useState(false);
    const [project_id, setProject_id] = useState("");
    const [userOpen, setUserOpen] = useState(false);

    const users = useSelector((state) => state.users.users);
    const user_time = useSelector((state) => state.auth.user);

    const taskStatuses = [
        { label: "Có mặt", value: "1" },
        { label: "Trễ", value: "2" },
        { label: "Nghỉ", value: "3" },
    ];

    useEffect(() => {
        const dataa = user?.projects?.map((item) => ({
            label: item.name,
            value: item.project_id,
        }));
    }, [user]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSubmit = async () => {
        if (!status || !project_id) {
            Alert.alert("Error", "Please fill all fields correctly");
            return;
        }

        let formData = new FormData();
        formData.append("project_id", project_id);
        formData.append("user_id", user?.user_id);
        formData.append("status", status);
        try {
            const axiosInstance = await axios.create({
                baseURL: api_url,
                timeout: 60000, // 60 giây
            });
            console.log(api_url + 'api/users/time');
            const data = await axiosInstance.post('api/users/time', formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Toast.show({
                type: "success",
                text1: data?.data?.success,
            });
            navigation.navigate("UserManagement");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Chấm công thất bại",
                text2: error.message,
            });
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title={"Chấm công cho " + (user?.name ?? "null")} />
                <Card.Content>
                    
                    <DropDownPicker
                        open={statusOpen}
                        value={status}
                        items={taskStatuses}
                        setOpen={setStatusOpen}
                        setValue={setStatus}
                        placeholder="Select Status"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                    <DropDownPicker
                        open={userOpen}
                        value={project_id}
                        items={user?.projects?.map((user) => ({
                            label: user.name,
                            value: user.project_id,
                        }))}
                        setOpen={setUserOpen}
                        setValue={setProject_id}
                        placeholder="Project"
                        style={styles.dropdown1}
                        dropDownContainerStyle={styles.dropdownContainer1}
                    />
                </Card.Content>
            </Card>
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                Chấm công
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    card: {
        padding: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    input: {
        marginBottom: 10,
    },
    dropdown: {
        marginBottom: 10,
        borderColor: "#dcdcdc",
        zIndex: 8
    },
    dropdownContainer: {
        borderColor: "#dcdcdc",
        zIndex: 10
    },

    dropdown1: {
        marginBottom: 10,
        borderColor: "#dcdcdc",
        zIndex: 5
    },
    dropdownContainer1: {
        borderColor: "#dcdcdc",
        zIndex: 6
    },
    submitButton: {
        backgroundColor: "#28a745",
        marginTop: 25,
        paddingVertical: 10,
        zIndex:1
    },
});

export default AddTaskScreen;
