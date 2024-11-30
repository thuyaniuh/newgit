import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchRE, deleteRE } from "../stores/actions/reAction";
import {
    Button,
    TextInput,
    Card,
    Paragraph,
    Title,
    Avatar,
    IconButton,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function RevenueExpenditureScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const dispatch = useDispatch();
    const { revenue_expenditure, totalPages, currentPage } = useSelector(
        (state) => state.revenue_expenditure
    );
    const [startDay, setStartDay] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    useEffect(() => {
        dispatch(fetchRE(currentPage, search));
    }, [dispatch, currentPage, search]);

    useEffect(() => {
        dispatch(fetchRE(currentPage, startDay.toISOString().split("T")[0]));
    }, [startDay]);

    const handleDelete = (id) => {
        Alert.alert(
            "Xóa phiếu đã chọn này",
            "Bạn có chắc chắn muốn xóa phiếu thu chi này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => callDelete(id) },
            ]
        );
    };

    async function callDelete(id) {
        await dispatch(deleteRE(id));
        await dispatch(fetchRE(currentPage, startDay.toISOString().split("T")[0]))
    }

    const renderData = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Title style={styles.projectName}>{item.name}</Title>

                    <Paragraph style={styles.projectInfo}>
                        Người tạo phiếu: {item?.user?.name}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Số tiền: {item.money}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Trạng thái:{" "}
                        {item.type_re == 0 ? "Phiếu thu" : "Phiếu chi"}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Ngày tạo: {item.created_at}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Mô tả: {item.note}
                    </Paragraph>
                </View>
                <View style={styles.actionContainer}>
                    {/* <IconButton icon="pencil" style={styles.iconButton} /> */}
                    <IconButton
                        icon="delete"
                        color="red"
                        onPress={() => handleDelete(item.id)}
                        style={styles.iconButton}
                    />
                </View>
            </View>
        </Card>
    );

    const handleDateChange = (event, selectedDate, type) => {
        const currentDate = selectedDate || (type === "start" ? startDay : endDay);
        if (type === "start") {
            setShowStartPicker(false);
            setStartDay(currentDate);
        } else {
            setShowEndPicker(false);
            setEndDay(currentDate);
        }
    };

    return (
        <View style={styles.container}>
            <Button
                mode="outlined"
                onPress={() => setShowStartPicker(true)}
                style={styles.dateButton}
            >
                Select Start Date: {startDay.toISOString().split("T")[0]}
            </Button>
            {showStartPicker && (
                <DateTimePicker
                    value={startDay}
                    mode="date"
                    display="default"
                    onChange={(e, date) => handleDateChange(e, date, "start")}
                />
            )}
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
                onPress={() =>
                    navigation.navigate("AddRevenueExpenditureScreen")
                }
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
        marginTop: 20,
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
