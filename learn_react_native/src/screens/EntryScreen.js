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
    const { users } = route.params;
    const project = route.params.item;
    const dispatch = useDispatch();
    const { tasks } = useSelector((state) => state.tasks);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    // console.log(projectId);
    // useEffect(() => {
    //     dispatch(fetchTasks(users));
    // }, [dispatch, users]);

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
                <Paragraph>Project: {item.name}</Paragraph>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={() => navigation.navigate("AddEntry", { user: users, navigation: navigation })}
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
