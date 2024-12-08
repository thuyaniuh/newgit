import React, { useEffect, useState } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    Alert,
    PermissionsAndroid,
    Platform,
    TouchableOpacity,
    Linking,
    Image,
    Text
} from "react-native";
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
import * as FileSystem from "expo-file-system";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function RevenueExpenditureScreen({ navigation }) {
    const api_url = process.env.API_URL;
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

    // useEffect(() => {
    //     dispatch(fetchRE(currentPage, startDay.toISOString().split("T")[0]));
    // }, [startDay]);

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
        await dispatch(
            fetchRE(currentPage, startDay.toISOString().split("T")[0])
        );
    }

    const downloadPDF = async () => {
        try {
            let formData = new FormData();
            formData.append("search", startDay.toISOString().split("T")[0]);
            // formData.append("user_id", user?.user_id);

            const axiosInstance = await axios.create({
                baseURL: api_url,
                timeout: 60000, // 60 giây
            });
            console.log(api_url + "api/revenue_expenditure/export");
            const data = await axiosInstance.post(
                "api/revenue_expenditure/export",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const url = data?.data?.file_path;
            
            const fileUri = `${FileSystem.documentDirectory}sample.pdf`;

            try {
                console.log(url)
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
                        Loại tiền: 
                        {item.type_re == 0 ? "Tiền mặt" : "Chuyển khoản"}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Ngày tạo: {item.created_at}
                    </Paragraph>
                    <Paragraph style={styles.projectInfo}>
                        Mô tả: {item.note}
                    </Paragraph>
                    {/* <Text style={styles.projectInfo}>
                        { api_url + 'storage/'+ item?.images }
                    </Text>
                    <Text style={styles.projectInfo}>
                    {item?.images ? (<Image source={{ uri: api_url + 'storage/'+ item?.images }} style={styles.imagePreview} />) : ""}
                    </Text> */}

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
        const currentDate =
            selectedDate || (type === "start" ? startDay : endDay);
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
                onPress={() => dispatch(fetchRE(1, startDay.toISOString().split("T")[0]))}
                style={styles.searchButton}
            >
                Tìm kiếm
            </Button>

            <Button
                mode="contained"
                onPress={() => downloadPDF()}
                style={styles.exportButton}
            >
                Xuất file
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
    imagePreview: {
        width: "100%",
        height: 150,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
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
    exportButton: {
        marginTop: 0,
        backgroundColor: "green",
    },
    taskButton: {
        marginRight: 10,
    },
});
