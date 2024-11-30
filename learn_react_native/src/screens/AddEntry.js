import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../stores/actions/userActions";
import { add_task, fetchTasks } from "../stores/actions/taskActions";

function AddTaskScreen({ route, navigation }) {
    const { projectId } = route.params;
    const { project } = route.params;
    const { user } = route.params;

    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [startDay, setStartDay] = useState("");
    const [endDay, setEndDay] = useState("");
    const [status, setStatus] = useState("");
    const [statusOpen, setStatusOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [userOpen, setUserOpen] = useState(false);

    const users = useSelector((state) => state.users.users);

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
        if (!name || !userId || !startDay || !endDay || !status) {
            Alert.alert("Error", "Please fill all fields correctly");
            return;
        }

        let formData = new FormData();
        formData.append("project_id", projectId);
        formData.append("user_id", userId);
        formData.append("status", status);

        try {
            await dispatch(add_task(formData));
            await dispatch(fetchTasks());
            Toast.show({
                type: "success",
                text1: "Task added successfully",
            });
            navigation.navigate("UserManagement");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Failed to add task",
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
                        open={userOpen}
                        value={userId}
                        items={users.map((user) => ({
                            label: user.name,
                            value: user.user_id,
                        }))}
                        setOpen={setUserOpen}
                        setValue={setUserId}
                        placeholder="Project"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
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
                </Card.Content>
            </Card>
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                Add Task
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
    submitButton: {
        backgroundColor: "#28a745",
        marginTop: 20,
        paddingVertical: 10,
    },
});

export default AddTaskScreen;
