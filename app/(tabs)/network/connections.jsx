import { Image, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import axios from "axios";
import {
  SimpleLineIcons,
  Feather,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import moment from "moment";
import UserCard from "../../components/UserCard";

const connection = () => {
  const [connections, setConnections] = useState([]);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("authToken");
      const decodedtoken = jwtDecode(token);
      const userId = decodedtoken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchConnections();
    }
  }, [userId]);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/connections/${userId}`
      );
      setConnections(response.data.connections);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.wrapper}>
        <Text style={{ fontSize: 16, fontWeight: "500" }}>
          {connections?.length}{" "}
          {connections.length <= 1 ? "Connection" : "Connections"}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Feather name="search" size={22} color="black" />
          <SimpleLineIcons name="menu" size={22} color="black" />
        </View>
      </View>

      <View
        style={{
          height: 2,
          borderColor: "#e0e0e0",
          borderWidth: 2,
          marginTop: 12,
        }}
      />

      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        {connections.map((item, index) => (
          <UserCard
            key={index}
            uri={item?.profileImage}
            name={item?.name}
            at={item?.createdAt}
          />
        ))}
      </View>
    </View>
  );
};

export default connection;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 15,
  },
});
