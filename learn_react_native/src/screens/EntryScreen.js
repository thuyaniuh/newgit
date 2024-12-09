import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Alert, Linking } from "react-native";
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
import axios from "axios";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";

function EntryScreen({ route, navigation }) {
    const api_url = process.env.API_URL;
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

    const downloadPDF = async () => {
        try {
            let formData = new FormData();
            formData.append("user_id", users.user_id);

            const axiosInstance = await axios.create({
                baseURL: api_url,
                timeout: 60000, // 60 giây
            });
            console.log(api_url + "api/users/export");
            const data = await axiosInstance.post(
                "api/users/export",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const url = data?.data?.file_path;

            const fileUri = `${FileSystem.documentDirectory}sample.pdf`;

            try {
                console.log(url);
                // const { uri } = await FileSystem.downloadAsync(url, fileUri);
                // Alert.alert(`File saved to: ${uri} or open ${url} to download`);
                await Linking.openURL(url);
            } catch (error) {
                console.error(error);
                Alert.alert("Failed to download file.");
            }
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lỗi download",
                text2: error.message,
            });
        }
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

            <Button
                mode="contained"
                onPress={() => downloadPDF()}
                style={styles.exportButton}
            >
                Xuất file
            </Button>

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
    exportButton: {
        marginTop: 0,
        backgroundColor: "green",
    },
});

export default EntryScreen;
