import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
} from "../stores/actions/taskActions";
import {
    Button,
    Card,
    Modal,
    TextInput,
    Title,
    Paragraph,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";

function TaskListScreen({ route, navigation }) {
    const { projectId } = route.params;
    const project = route.params.item;
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        dispatch(fetchTasks(projectId));
    }, [dispatch, projectId]);

    const handleAddTask = () => {
        setIsEditing(false);
        setCurrentTask({});
        setModalVisible(true);
    };

    const handleEditTask = async (task) => {
        await setIsEditing(true);
        await console.log(task.status);
        await setCurrentTask(task);
        await setStatus(task.status);
        await setModalVisible(true);
    };

    const taskStatuses = [
        { label: "Active", value: "1" },
        { label: "Completed", value: "2" },
    ];

    const handleDeleteTask = (taskId) => {
        Alert.alert("Delete Task", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => dispatch(deleteTask(taskId)) },
        ]);
    };

    const handleSaveTask = async () => {
        if (isEditing) {
            await dispatch(
                updateTask(currentTask.id, { ...currentTask, status })
            );
            await dispatch(fetchTasks(projectId));

            Toast.show({
                type: "success",
                text1: "Task added successfully",
            });
        } else {
            await dispatch(addTask(projectId, currentTask));
        }
        await setModalVisible(false);
    };

    const renderTask = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>Project: {item.project.name}</Paragraph>
                <Paragraph>User: {item.user?.name}</Paragraph>
                <Paragraph>Email: {item.user?.email}</Paragraph>
                <Paragraph>
                    Trang thái: {item.status == 1 ? "Active" : "Completed"}
                </Paragraph>
                <Paragraph>Start date: {item?.start_day}</Paragraph>
                <Paragraph>End date: {item?.end_day}</Paragraph>
                <Card.Actions style={styles.cardActions}>
                    <Button
                        mode="contained"
                        theme={{ colors: { primary: "#0d6efd" } }}
                        onPress={() => handleEditTask(item)}
                    >
                        Edit
                    </Button>
                    <Button
                        mode="contained"
                        theme={{ colors: { primary: "#dc3545" } }}
                        onPress={() => handleDeleteTask(item.task_id)}
                    >
                        Delete
                    </Button>
                </Card.Actions>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={() =>
                    navigation.navigate("AddTask", {
                        projectId: projectId,
                        project: project,
                        navigation: navigation,
                    })
                }
                style={styles.addButton}
            >
                Add Task
            </Button>
            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={(item) => item.task_id.toString()}
            />
            <Modal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
            >
                <View style={styles.modalContent}>
                    <TextInput
                        label="Task Name"
                        value={currentTask.name || ""}
                        onChangeText={(text) =>
                            setCurrentTask({ ...currentTask, name: text })
                        }
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
                    <Button onPress={handleSaveTask}>
                        {isEditing ? "Update Task" : "Save Task"}
                    </Button>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    card: { marginBottom: 10 },
    addButton: { marginBottom: 15 },
    modalContent: { padding: 20, backgroundColor: "white" },
    dropdown: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: "#dcdcdc",
        zIndex: 8,
    },
    dropdownContainer: {
        borderColor: "#dcdcdc",
        zIndex: 7,
    },
});

export default TaskListScreen;
