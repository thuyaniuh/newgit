import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Modal, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { delete_materials, fetch_materials, add_materials, edit_materials } from "../stores/actions/materialAction";
import { Button, TextInput, Card, Paragraph, Title, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";

function MaterialScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [materialName, setMaterialName] = useState("");
    const [materialUnit, setMaterialUnit] = useState("");
    const [materialPrice, setMaterialPrice] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const dispatch = useDispatch();
    const { materials, totalPages, currentPage } = useSelector((state) => state.materials);

    useEffect(() => {
        dispatch(fetch_materials(1, search));
    }, [dispatch, search]);

    const formatPrice = (price) => `${price.toLocaleString("vi-VN")} VND`;

    const handleDelete = (id) => {
        Alert.alert(
            "Xóa vật tư",
            "Bạn có chắc chắn muốn xóa vật tư này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => handleDeleteConfirm(id) },
            ]
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await dispatch(delete_materials(id));
            Toast.show({
                type: "success",
                text1: "Vật tư đã được xóa thành công",
            });
            dispatch(fetch_materials(1, search));
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Xóa thất bại",
                text2: "Đã xảy ra lỗi",
            });
        }
    };

    const openModal = (data) => {
        setSelectedData(data);
        setMaterialName(data ? data.material_name : "");
        setMaterialUnit(data ? data.unit : "");
        setMaterialPrice(data ? data.price.toString() : "");
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedData(null);
    };

    const handleSaveMaterial = async () => {
        if (isSaving) return;
        setIsSaving(true);

        try {
            if (selectedData) {
                await handleEditMaterial(); // Đảm bảo rằng hàm này được gọi đúng khi chỉnh sửa
            } else {
                await handleAddMaterial();
            }
            closeModal();
            dispatch(fetch_materials(1, search));
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Lưu thất bại",
                text2: "Đã xảy ra lỗi",
            });
        } finally {
            setIsSaving(false);
        }
    };


    const handleAddMaterial = async () => {
        try {
            await dispatch(
                add_materials({
                    material_name: materialName,
                    unit: materialUnit,
                    price: parseFloat(materialPrice),
                })
            );
            Toast.show({
                type: "success",
                text1: "Vật tư đã được thêm mới thành công",
            });
            closeModal();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Thêm mới thất bại",
                text2: "Đã xảy ra lỗi",
            });
        }
    };

    const handleEditMaterial = async () => {
        try {
            await dispatch(
                edit_materials({
                    material_id: selectedData.material_id,
                    material_name: materialName,
                    unit: materialUnit,
                    price: parseFloat(materialPrice),
                })
            );
            closeModal();
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Cập nhật thất bại",
                text2: "Đã xảy ra lỗi",
            });
        }
    };


    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            dispatch(fetch_materials(page, search));
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

    const renderData = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Title style={styles.materialName}>{item.material_name}</Title>
                    <Paragraph style={styles.materialInfo}>Đơn vị: {item.unit}</Paragraph>
                    <Paragraph style={styles.materialInfo}>Giá: {formatPrice(item.price)}</Paragraph>
                </View>
                <View style={styles.actionContainer}>
                    <IconButton
                        icon="pencil"
                        onPress={() => openModal(item)}
                        style={styles.iconButton}
                    />
                    <IconButton
                        icon="delete"
                        color="red"
                        onPress={() => handleDelete(item.material_id)}
                        style={styles.iconButton}
                    />
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <TextInput
                label="Tìm kiếm vật tư"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                mode="outlined"
                onSubmitEditing={() => dispatch(fetch_materials(1, search))}
            />
            <Button
                mode="contained"
                onPress={() => dispatch(fetch_materials(1, search))}
                style={styles.searchButton}
            >
                Tìm kiếm
            </Button>

            <FlatList
                data={materials}
                renderItem={renderData}
                keyExtractor={(item) => String(item.material_id)}
                style={styles.list}
            />

            {renderPagination()}

            <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => openModal(null)}
            >
                Thêm Vật Tư
            </Button>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>
                            {selectedData ? "Chỉnh sửa vật tư" : "Thêm vật tư mới"}
                        </Text>
                        <TextInput
                            label="Tên vật tư"
                            value={materialName}
                            onChangeText={setMaterialName}
                            style={styles.modalInput}
                        />
                        <TextInput
                            label="Đơn vị"
                            value={materialUnit}
                            onChangeText={setMaterialUnit}
                            style={styles.modalInput}
                        />
                        <TextInput
                            label="Giá"
                            value={materialPrice}
                            onChangeText={setMaterialPrice}
                            keyboardType="numeric"
                            style={styles.modalInput}
                        />
                        <Button
                            mode="contained"
                            onPress={handleSaveMaterial}
                            style={styles.saveButton}
                            disabled={isSaving}
                        >
                            Lưu
                        </Button>
                        <Button
                            mode="contained"
                            onPress={closeModal}
                            style={styles.closeModalButton}
                        >
                            Đóng
                        </Button>
                    </View>
                </View>
            </Modal>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    infoContainer: {
        flex: 3,
    },
    actionContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
    },
    materialName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    materialInfo: {
        fontSize: 14,
    },
    iconButton: {
        marginVertical: 2,
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    modalInput: {
        width: "100%",
        marginBottom: 10,
    },
    saveButton: {
        marginTop: 10,
    },
    closeModalButton: {
        marginTop: 10,
    },
});

export default MaterialScreen;
