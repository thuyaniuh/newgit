import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRE, deleteUser } from "../stores/actions/reAction";
import {
    Button,
    TextInput,
    Card,
    Paragraph,
    Title,
    Avatar,
    IconButton,
} from "react-native-paper";

export default function RevenueExpenditureScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const { revenue_expenditure, totalPages, currentPage } = useSelector(
        (state) => state.revenue_expenditure
    );

    useEffect(() => {
        dispatch(fetchRE(currentPage, search));
    }, [dispatch, currentPage, search]);

    const handleDelete = (id) => {
        Alert.alert(
            "Xóa người dùng",
            "Bạn có chắc chắn muốn phiếu thu chi này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => dispatch(deleteUser(id)) },
            ]
        );
    };

    const renderData = ({ item }) => (
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
                    <IconButton icon="pencil" style={styles.iconButton} />
                    <IconButton
                        icon="delete"
                        color="red"
                        onPress={() => handleDelete(item.project_id)}
                        style={styles.iconButton}
                    />
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <TextInput
                label="Tìm kiếm người dùng"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                mode="outlined"
                onSubmitEditing={() => dispatch(fetchRE(1, search))}
            />
            <Button
                mode="contained"
                onPress={() => dispatch(fetchRE(1, search))}
                style={styles.searchButton}
            >
                Tìm kiếm
            </Button>

            <FlatList
                data={revenue_expenditure}
                renderItem={renderData}
                keyExtractor={(item) => item.id}
                style={styles.list}
            />

            {/* Phân trang */}
            <View style={styles.pagination}>
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i}
                        mode={i + 1 === currentPage ? "contained" : "text"}
                        onPress={() => dispatch(fetchRE(i + 1, search))}
                    >
                        {i + 1}
                    </Button>
                ))}
            </View>

            <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => navigation.navigate("AddUser")}
            >
                Thêm Phiếu Thu Chi mới
            </Button>
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
        marginTop: 20,
    },
});
