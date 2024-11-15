import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetch_purchases } from "../stores/actions/purchaseAction";
import { Card, Paragraph, TextInput, Title } from "react-native-paper";

function PurchaseListScreen({ navigation }) {
  const dispatch = useDispatch();
  const { purchases } = useSelector((state) => state.purchases);

  useEffect(() => {
    dispatch(fetch_purchases());
  }, [dispatch]);

  const handlePress = (purchase) => {
    navigation.navigate("PurchaseDetailScreen", { purchase });
  };

  const renderPurchase = ({ item }) => {
    // Đảm bảo tất cả các thuộc tính được sử dụng đều không phải là undefined
    return (
      <TouchableOpacity onPress={() => handlePress(item)}>
        <Card style={styles.card}>
          <View style={styles.cardContent}>
            <Title style={styles.title}>{item.project?.name || "Dự án không xác định"}</Title>
            <Paragraph>Ngày: {item.date || "Không có ngày"}</Paragraph>
            <Paragraph>
              Nhà cung cấp: {item.supplier ? item.supplier.supplier_name : "Không có nhà cung cấp"}
            </Paragraph>
            <Paragraph>Người dùng: {item.user?.name || "Không có thông tin người dùng"}</Paragraph>
            <Paragraph>
              Tổng giá: {item.total_price ? `${item.total_price.toString()} VND` : "0 VND"}
            </Paragraph>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {purchases && purchases.length > 0 ? (
        <FlatList
          data={purchases}
          renderItem={renderPurchase}
          keyExtractor={(item) => item.purchase_id?.toString() || Math.random().toString()}
        />
      ) : (
        <Text style={styles.noDataText}>Không có giao dịch nào</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});

export default PurchaseListScreen;
