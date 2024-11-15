import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Modal, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { delete_supplier, fetch_suppliers, add_supplier, edit_supplier } from "../stores/actions/supplierActions";
import { Button, TextInput, Card, Paragraph, Title, IconButton } from "react-native-paper";
import Toast from "react-native-toast-message";

function SupplierManagementScreen({ navigation }) {
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [supplierName, setSupplierName] = useState("");
    const [supplierAddress, setSupplierAddress] = useState("");
    const [supplierPhone, setSupplierPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const dispatch = useDispatch();
    const { suppliers, totalPages, currentPage } = useSelector((state) => state.suppliers);

    useEffect(() => {
        dispatch(fetch_suppliers(currentPage, search));
    }, [dispatch, currentPage, search]);

    const handleDelete = (id) => {
        Alert.alert(
            "Xóa nhà cung cấp",
            "Bạn có chắc chắn muốn xóa nhà cung cấp này không?",
            [
                { text: "Hủy", style: "cancel" },
                { text: "Xóa", onPress: () => handleDeleteConfirm(id) },
            ]
        );
    };

    const handleDeleteConfirm = async (id) => {
        try {
            await dispatch(delete_supplier(id));
            await dispatch(fetch_suppliers(1, search));

            Toast.show({
                type: "success",
                text1: "Nhà cung cấp đã được xóa thành công",
            });
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Xóa thất bại",
                text2: "Đã xảy ra lỗi",
            });
        }
    };

    const openModal = (supplier = null) => {
        if (supplier) {
            setSelectedSupplier(supplier);
            setSupplierName(supplier.supplier_name);
            setSupplierAddress(supplier.address);
            setSupplierPhone(supplier.phone);
        } else {
            setSelectedSupplier(null);
            setSupplierName("");
            setSupplierAddress("");
            setSupplierPhone("");
        }
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedSupplier(null);
        setPhoneError("");
    };

    const handleSave = async () => {
        if (isSaving) return;

        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /^0[0-9]{9}$/;
        if (!phoneRegex.test(supplierPhone)) {
            Toast.show({
                type: 'error',
                text1: 'Số điện thoại không hợp lệ',
                text2: 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số',
            });
            return;
        }

        setIsSaving(true);

        const supplierData = {
            supplier_id: selectedSupplier ? selectedSupplier.supplier_id : null,
            supplier_name: supplierName,
            address: supplierAddress,
            phone: supplierPhone,
        };

        try {
            if (selectedSupplier) {
                await dispatch(edit_supplier(supplierData));
                Toast.show({
                    type: "success",
                    text1: "Nhà cung cấp đã được cập nhật thành công",
                });
            } else {
                await dispatch(add_supplier(supplierData));
                Toast.show({
                    type: "success",
                    text1: "Nhà cung cấp đã được thêm thành công",
                });
            }
            closeModal();
            dispatch(fetch_suppliers(1, search));
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

    const renderSuppliers = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View style={styles.infoContainer}>
                    <Title style={styles.supplierName}>{item.supplier_name}</Title>
                    <Paragraph style={styles.supplierInfo}>Địa chỉ: {item.address}</Paragraph>
                    <Paragraph style={styles.supplierInfo}>Số điện thoại: {item.phone}</Paragraph>
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
                        onPress={() => handleDelete(item.supplier_id)}
                        style={styles.iconButton}
                    />
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <TextInput
                label="Tìm kiếm nhà cung cấp"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                mode="outlined"
                onSubmitEditing={() => dispatch(fetch_suppliers(1, search))}
            />
            <Button
                mode="contained"
                onPress={() => dispatch(fetch_suppliers(1, search))}
                style={styles.searchButton}
            >
                Tìm kiếm
            </Button>

            <FlatList
                data={suppliers}
                renderItem={renderSuppliers}
                keyExtractor={(item) => String(item.supplier_id)}
                style={styles.list}
            />

            <Button
                mode="contained"
                style={styles.addButton}
                onPress={() => openModal()}
            >
                Thêm Nhà Cung Cấp
            </Button>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>{selectedSupplier ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp"}</Text>
                        <TextInput
                            label="Tên"
                            value={supplierName}
                            onChangeText={setSupplierName}
                            style={styles.input}
                        />
                        <TextInput
                            label="Địa chỉ"
                            value={supplierAddress}
                            onChangeText={setSupplierAddress}
                            style={styles.input}
                        />
                        <TextInput
                            label="Số điện thoại"
                            value={supplierPhone}
                            onChangeText={(text) => {
                                setSupplierPhone(text);
                                if (!/^0[0-9]{0,9}$/.test(text)) {
                                    setPhoneError('Số điện thoại phải bắt đầu bằng 0 và chỉ chứa chữ số.');
                                } else {
                                    setPhoneError('');
                                }
                            }}
                            keyboardType="phone-pad"
                            style={styles.input}
                        />
                        {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

                        <Button
                            mode="contained"
                            onPress={handleSave}
                            style={styles.saveButton}
                            disabled={isSaving}
                        >
                            Lưu
                        </Button>
                        <Button
                            mode="contained"
                            onPress={closeModal}
                            style={styles.closeButton}
                        >
                            Hủy
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
    supplierName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    supplierInfo: {
        fontSize: 14,
    },
    iconButton: {
        marginVertical: 2,
    },
    list: {
        flex: 1,
    },
    addButton: {
        marginTop: 20,
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
    input: {
        width: "100%",
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    saveButton: {
        marginTop: 10,
    },
    closeButton: {
        marginTop: 10,
    },
});

export default SupplierManagementScreen;
