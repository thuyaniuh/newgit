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
import { fetchUsersTime } from "../stores/actions/userActions";

function EntryScreen({ route, navigation }) {
    const { users } = route.params;
    const project = route.params.item;
    const dispatch = useDispatch();
    const { users_time } = useSelector((state) => state.users_time);
    const user = useSelector((state) => state.auth.user);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTask, setCurrentTask] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    // console.log(projectId);
    useEffect(() => {
        dispatch(fetchUsersTime(users.user_id));
    }, [dispatch, users]);

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
                <Title style={styles.font_btitle}>{item.name}</Title>
                <Paragraph>Project: {item.name}</Paragraph>
                <Paragraph>Tiền công: {item.money}</Paragraph>
                <Paragraph>Trạng thái: {renderElement(item.status)}</Paragraph>
                <Paragraph>Ngày: {item.created_at}</Paragraph>
            </Card.Content>
        </Card>
    );

    const renderElement = (status) => {
        if (status == 1) {
            return "Có mặt";
        } else if (status == 2) {
            return "Trễ";
        } else {
            return "Nghỉ";
        }
    };

    return (
        <View style={styles.container}>
            {user?.role !== "worker" && (
                <Button
                    mode="contained"
                    onPress={() =>
                        navigation.navigate("AddEntry", {
                            user: users,
                            navigation: navigation,
                        })
                    }
                    style={styles.addButton}
                >
                    Add timekeeping
                </Button>
            )}

            <Title>Tổng tiền công tháng này: {users_time?.money}</Title>

            <FlatList
                data={users_time?.data}
                renderItem={renderTask}
                keyExtractor={(item) => item.id.toString()}
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
    font_btitle: {
        fontWeight: "bold",
    },
});

export default EntryScreen;
