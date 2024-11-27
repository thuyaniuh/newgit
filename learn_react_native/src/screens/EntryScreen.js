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

function EntryScreen({ route, navigation }) {
    const { projectId } = route.params;
    const project = route.params.item;
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    // console.log(projectId);
    useEffect(() => {
        dispatch(fetchTasks(projectId));
    }, [dispatch, projectId]);

    const handleAddTask = () => {
        setIsEditing(false);
        setCurrentTask({});
        setModalVisible(true);
    };

    const handleEditTask = (task) => {
        setIsEditing(true);
        setCurrentTask(task);
        setModalVisible(true);
    };

    const handleDeleteTask = (taskId) => {
        Alert.alert("Delete Task", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => dispatch(deleteTask(taskId)) },
        ]);
    };

    const handleSaveTask = () => {
        if (isEditing) {
            dispatch(updateTask(currentTask.id, currentTask));
        } else {
            dispatch(addTask(projectId, currentTask));
        }
        setModalVisible(false);
    };

    const renderTask = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>Project: {item.project.name}</Paragraph>
                <Paragraph>User: {item.user?.name}</Paragraph>
                <Paragraph>User: {item.user?.email}</Paragraph>
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
                onPress={() => navigation.navigate("AddTask", { projectId: projectId, project: project, navigation: navigation })}
                style={styles.addButton}
            >
                Add timekeeping
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
});

export default EntryScreen;
