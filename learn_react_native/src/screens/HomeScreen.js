import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

const Homepage = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header Image */}
            <Image
                source={{
                    uri: "https://akcgroup.vn/wp-content/uploads/2023/11/don-vi-uy-tin-xay-nha-thau.jpg",
                }}
                style={styles.headerImage}
            />

            <View style={styles.cardRow}>
                <Card style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="construction"
                            size={30}
                            color="#FF9800"
                            style={styles.icon}
                        />
                    </View>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Total Projects</Title>
                        <Paragraph style={styles.cardText}>120</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="build"
                            size={30}
                            color="#4CAF50"
                            style={styles.icon}
                        />
                    </View>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Ongoing Projects</Title>
                        <Paragraph style={styles.cardText}>80</Paragraph>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.cardRow}>
                <Card style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="done"
                            size={30}
                            color="#2196F3"
                            style={styles.icon}
                        />
                    </View>
                    <Card.Content>
                        <Title style={styles.cardTitle}>
                            Completed Projects
                        </Title>
                        <Paragraph style={styles.cardText}>40</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="group"
                            size={30}
                            color="#9C27B0"
                            style={styles.icon}
                        />
                    </View>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Suppliers</Title>
                        <Paragraph style={styles.cardText}>25</Paragraph>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.cardRow}>
                <Card style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="people"
                            size={30}
                            color="#F44336"
                            style={styles.icon}
                        />
                    </View>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Customers</Title>
                        <Paragraph style={styles.cardText}>200</Paragraph>
                    </Card.Content>
                </Card>

                <Card style={styles.card}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            name="pan-tool"
                            size={40}
                            color="#3498db"
                            style={styles.icon}
                        />
                    </View>
                    <Card.Content>
                        <Title style={styles.cardTitle}>Materials</Title>
                        <Paragraph style={styles.cardText}>30 Types</Paragraph>
                    </Card.Content>
                </Card>
            </View>

            {/* Construction-related Images */}
            <View style={styles.imagesSection}>
                <Image
                    source={{
                        uri: "https://www.vinse.vn/uploads/thumbs/tn_540x305_5253e83f1717b775d0517a56f8a100b3_z3960879674657_4dbaac797bcf807d6a8f405836776dd9.jpg",
                    }}
                    style={styles.image}
                />
                <Image
                    source={{
                        uri: "https://www.vinse.vn/uploads/chuyengiaocongnghe/cgcn_trangchu_3.jpg",
                    }}
                    style={styles.image}
                />
                <Image
                    source={{
                        uri: "https://nidco.com.vn/Media/Web/WebPost/truong-mau-giao-an-thuy-20230818155157.jpg",
                    }}
                    style={styles.image}
                />
                <Image
                    source={{
                        uri: "https://i.vnbusiness.vn/2021/05/11/IMG-20210511-202946-4701-1620745926_860x0.jpg",
                    }}
                    style={styles.image}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#F4F3EF",
    },
    headerImage: {
        width: "100%",
        height: 200,
        marginBottom: 20,
    },
    statsSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    statCard: {
        width: "48%",
        marginBottom: 15,
        borderRadius: 10,
    },
    blueCard: {
        backgroundColor: "#007bff",
    },
    greenCard: {
        backgroundColor: "#28a745",
    },
    yellowCard: {
        backgroundColor: "#ffc107",
    },
    purpleCard: {
        backgroundColor: "#6f42c1",
    },
    orangeCard: {
        backgroundColor: "#fd7e14",
    },
    imagesSection: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    image: {
        width: "48%",
        height: 150,
        marginBottom: 15,
        borderRadius: 10,
    },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    card: {
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        paddingVertical: 10,
    },
    iconContainer: {
        backgroundColor: "#fff", // White background for the icon
        borderWidth: 2, // Adding border to icon container
        borderColor: "#ddd", // Border color
        borderRadius: 50, // Rounded border
        width: 60,
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 10,
    },
    icon: {
        textAlign: "center",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    cardText: {
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
        marginTop: 5,
    },
});

export default Homepage;
