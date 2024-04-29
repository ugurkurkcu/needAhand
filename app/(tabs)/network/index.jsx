import { ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import axios from "axios";
import PressableLine from "../../components/PressableLine";
import { Entypo } from "@expo/vector-icons";
import UserProfile from "../../components/UserProfile";
import ConnectionRequest from "../../components/ConnectionRequest";
import { useRouter } from "expo-router";

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [users, setUsers] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const router = useRouter();

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
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    await axios
      .get(`http://localhost:8000/profile/${userId}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log("error fetching users", err));
  };

  useEffect(() => {
    if (userId) {
      fetchUsers();
    }
  }, [userId]);

  useEffect(() => {}, []);

  const fetchUsers = async () => {
    await axios
      .get(`http://localhost:8000/users/${userId}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("error fetching users", err));
  };

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);
  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/connection-request/${userId}`
      );
      if (response.status === 200) {
        const connectionRequestsData = response.data?.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.profileImage,
        }));

        setConnectionRequests(connectionRequestsData);
      }
    } catch (error) {
      console.log("error", error);
    }
  };


  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <PressableLine
        onPress={() => router.push("network/connections")}
        text={"Manage My Networks"}
      />
      <PressableLine
        text={"Invitations"}
        inv={`(${connectionRequests.length})`}
      />

      <View>
        {connectionRequests?.map((item, index) => (
          <ConnectionRequest
            item={item}
            key={index}
            connectionRequests={connectionRequests}
            setConnectionRequests={setConnectionRequests}
            userId={userId}
          />
        ))}
      </View>

      <View style={{ marginHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Grow your network</Text>
          <Entypo name="cross" size={24} color="black" />
        </View>
        <Text>Find and contact the right people to get the job.</Text>
      </View>

      <FlatList
        data={users}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, key }) => (
          <UserProfile item={item} key={index} userId={userId} />
        )}
      />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({});
