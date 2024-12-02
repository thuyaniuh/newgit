import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Card,
    Paragraph,
    Title,
    TextInput,
    IconButton,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import {
    fetch_projects,
    delete_project,
} from "../stores/actions/projectAction";

function ProjectManagementScreen({ props, navigation }) {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();
    const { projects, totalPages } = useSelector((state) => state.projects);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        dispatch(fetch_projects(currentPage, search));
    }, [dispatch, currentPage, search]);

    const handleDeleteProject = (projectId) => {
        Alert.alert("Xóa Dự Án", "Bạn có chắc chắn muốn xóa dự án này?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Đồng ý",
                onPress: async () => {
                    await dispatch(delete_project(projectId));
                    dispatch(fetch_projects(currentPage, search));
                    Toast.show({ type: "success", text1: "Dự án đã được xóa" });
                },
            },
        ]);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.pageButton,
                        i === currentPage ? styles.pageButtonActive : {},
                    ]}
                    onPress={() => handlePageChange(i)}
                >
                    <Text style={styles.pageButtonText}>{i}</Text>
                </TouchableOpacity>
            );
        }
        return <View style={styles.paginationContainer}>{pages}</View>;
    };

    const renderProject = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Title style={styles.projectName}>{item.name}</Title>
                    <Paragraph style={styles.projectInfo}>
                        Loại dự án: {item.type}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Ngày bắt đầu: {item.start_day}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Ngày kết thúc: {item.end_day}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Ngân sách: {item.budget}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Trạng thái: {item.status}
                    </Paragraph>
                </View>
                <View style={styles.actionContainer}>
                    <Button
                        mode="contained"
                        onPress={() =>
                            navigation.navigate("TaskList", {
                                projectId: item.project_id,
                            })
                        }
                        style={styles.taskButton}
                    >
                        Quản lý Task
                    </Button>
                    {user?.role == "admin" && (
                        <>
                            <IconButton
                                icon="pencil"
                                onPress={() =>
                                    navigation.navigate("EditProjectScreen", {
                                        project: item,
                                    })
                                }
                                style={styles.iconButton}
                            />
                            <IconButton
                                icon="delete"
                                color="red"
                                onPress={() =>
                                    handleDeleteProject(item.project_id)
                                }
                                style={styles.iconButton}
                            />
                        </>
                    )}
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <TextInput
                label="Tìm kiếm dự án"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                mode="outlined"
                placeholder="Nhập tên dự án"
                right={
                    <TextInput.Icon
                        icon="magnify"
                        onPress={() => dispatch(fetch_projects(1, search))}
                    />
                }
            />
            <Button
                mode="contained"
                onPress={() => dispatch(fetch_projects(1, search))}
                style={styles.searchButton}
            >
                Tìm kiếm
            </Button>

            <FlatList
                data={projects}
                renderItem={renderProject}
                keyExtractor={(item) => item.project_id.toString()}
                style={styles.list}
            />

            {renderPagination()}

            {user?.role == "admin" && (
                <Button
                    mode="contained"
                    style={styles.addButton}
                    onPress={() => navigation.navigate("AddProjectScreen")}
                >
                    Thêm Dự Án
                </Button>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f8f8",
    },
    searchInput: {
        marginBottom: 10,
    },
    searchButton: {
        marginBottom: 20,
    },
    card: {
        marginBottom: 15,
        borderRadius: 10,
        elevation: 3,
    },
    cardContent: {
        padding: 10,
    },
    infoContainer: {
        flex: 1,
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    projectName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    projectInfo: {
        fontSize: 14,
    },
    iconButton: {
        marginHorizontal: 5,
    },
    list: {
        flex: 1,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 10,
    },
    pageButton: {
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 5,
        backgroundColor: "#ddd",
    },
    pageButtonActive: {
        backgroundColor: "#f1c40f",
    },
    pageButtonText: {
        fontSize: 16,
    },
    addButton: {
        marginTop: 10,
        backgroundColor: "#007bff",
    },
    taskButton: {
        marginRight: 10,
    },
});

export default ProjectManagementScreen;
