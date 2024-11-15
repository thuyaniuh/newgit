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
        { label: "Active", value: "1" },
        { label: "Completed", value: "2" },
    ];

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleSubmit = async () => {
        if (!name || !userId || !startDay || !endDay || !status) {
            Alert.alert("Error", "Please fill all fields correctly");
            return;
        }

        let formData = new FormData();
        formData.append("name", name);
        formData.append("project_id", projectId);
        formData.append("user_id", userId);
        formData.append("start_day", startDay);
        formData.append("end_day", endDay);
        formData.append("status", status);
        

        try {
            await dispatch(add_task(formData));
            await dispatch(fetchTasks());
            Toast.show({
                type: "success",
                text1: "Task added successfully",
            });
            // navigation.goBack();
            // navigation.navigate("AddTask", { projectId: projectId, project: project, navigation: navigation })
            // navigation.navigate("TaskList", { projectId: projectId, navigation: navigation, item: project })
            navigation.navigate("ProjectManagement")
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
                <Card.Title title={"Add New Task for " + (project ?? "null") } />
                <Card.Content>
                    <TextInput
                        label="Task Name"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        mode="outlined"
                    />
                    <DropDownPicker
                        open={userOpen}
                        value={userId}
                        items={users.map((user) => ({ label: user.name, value: user.user_id }))}
                        setOpen={setUserOpen}
                        setValue={setUserId}
                        placeholder="Assign User"
                        style={styles.dropdown}
                        dropDownContainerStyle={styles.dropdownContainer}
                    />
                    <TextInput
                        label="Start Date"
                        value={startDay}
                        onChangeText={setStartDay}
                        style={styles.input}
                        mode="outlined"
                        placeholder="YYYY-MM-DD"
                    />
                    <TextInput
                        label="End Date"
                        value={endDay}
                        onChangeText={setEndDay}
                        style={styles.input}
                        mode="outlined"
                        placeholder="YYYY-MM-DD"
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
            <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
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
    },
    dropdownContainer: {
        borderColor: "#dcdcdc",
    },
    submitButton: {
        backgroundColor: "#28a745",
        marginTop: 20,
        paddingVertical: 10,
    },
});

export default AddTaskScreen;
