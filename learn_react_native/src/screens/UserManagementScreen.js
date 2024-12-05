import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Text, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../stores/actions/userActions";
import {
    Button,
    TextInput,
    Card,
    Paragraph,
    Title,
    Avatar,
    IconButton,
} from "react-native-paper";

export default function UserManagementScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const { users, totalPages, currentPage } = useSelector(
        (state) => state.users
    );
    const user = useSelector((state) => state.auth.user);
    const api_url = process.env.API_URL;

    useEffect(() => {
        if (user?.role === "worker") {
            dispatch(fetchUsers(currentPage, search, user?.user_id));
        } else {
            dispatch(fetchUsers(currentPage, search, 0));
        }
    }, [dispatch, currentPage, search]);

    const handleDelete = (id) => {
        Alert.alert(
            "Xóa người dùng",
            "Bạn có chắc chắn muốn xóa người dùng này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => dispatch(deleteUser(id)) },
            ]
        );
    };

    const renderUser = ({ item }) => (
        
        <Card style={styles.card}>
            <Card.Title
                title={item.name}
                subtitle={item.email}
                left={(props) =>
                    item.avatar_url ? (
                        <Avatar.Image
                            {...props}
                            source={{ uri: api_url + 'storage/' + item.avatar }}
                        />
                    ) : (
                        <Avatar.Icon {...props} icon="account" />
                    )
                }
                right={(props) => (
                    <>
                        <IconButton
                            {...props}
                            icon="calendar"
                            onPress={() =>
                                navigation.navigate("EntryScreen", {
                                    users: item,
                                })
                            }
                        />
                        {user?.role !== "worker" && (
                            <>
                                <IconButton
                                    {...props}
                                    icon="pencil"
                                    onPress={() =>
                                        navigation.navigate("EditUser", {
                                            user: item,
                                        })
                                    }
                                />
                                <IconButton
                                    {...props}
                                    icon="delete"
                                    color="red"
                                    onPress={() => handleDelete(item.user_id)}
                                />
                            </>
                        )}
                    </>
                )}
            />
            <View style={styles.infoContainer}>
                <Title style={styles.projectName}>Dự án đang làm</Title>
                {item.projects && item.projects.length > 0 ? (
                    item.projects.map((project, index) => (
                        <Text key={index} style={styles.projectInfo}>
                            {project.name}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noProjects}>Không có dự án</Text>
                )}
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            {user?.role !== "worker" && (
                <>
                    <TextInput
                        label="Tìm kiếm người dùng"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.searchInput}
                        mode="outlined"
                        onSubmitEditing={() => dispatch(fetchUsers(1, search))}
                    />
                    <Button
                        mode="contained"
                        onPress={() => dispatch(fetchUsers(1, search))}
                        style={styles.searchButton}
                    >
                        Tìm kiếm
                    </Button>

                    <Button
                        mode="contained"
                        style={styles.addButton}
                        onPress={() => navigation.navigate("AddUser")}
                    >
                        Thêm Người Dùng
                    </Button>
                </>
            )}

            <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item.user_id.toString()}
                style={styles.list}
            />

            {/* Phân trang */}
            <View style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i}
                        mode={i + 1 === currentPage ? "contained" : "text"}
                        onPress={() => dispatch(fetchUsers(i + 1, search))}
                    >
                        {i + 1}
                    </Button>
                ))}
            </View>
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
    list: {
        flex: 1,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
    },
    addButton: {
        marginBottom: 20,
        backgroundColor: "blue",
    },
    projectName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    projectInfo: {
        fontSize: 14,
        marginVertical: 5,
    },
    noProjects: {
        fontStyle: "italic",
        color: "#888",
    },
    infoContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
});
