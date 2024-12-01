import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Text } from "react-native";
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

    useEffect(() => {
        dispatch(fetchUsers(currentPage, search));
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
                            source={{ uri: item.avatar_url }}
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

            <View style={styles.infoContainer1}>
                <Title style={styles.projectName}>Dự án đang làm</Title>

                <Paragraph style={styles.projectInfo}>
                    {/* Người tạo phiếu: {item?.user?.name} */}
                    <FlatList
                        data={item?.projects}
                        renderItem={renderProject}
                        keyExtractor={(item) => getRandomInt(1, 10000)}
                        style={styles.list}
                    />
                </Paragraph>
            </View>
        </Card>
    );

    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const renderProject = ({ item }) => (
        <View style={styles.infoContainer}>
            <Text>{item?.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
        color: "blue",
        backgroundColor: "blue",
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
        marginBottom: 20,
    },
    projectInfo: {
        fontSize: 14,
    },
    infoContainer1: {
        paddingLeft: 10,
        marginLeft: 10,
        marginBottom: 20,
    },
});
