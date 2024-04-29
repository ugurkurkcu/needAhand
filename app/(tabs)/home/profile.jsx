import {
  Button,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Input from "../../components/Input";
import Btn from "../../components/Btn";
import ProfileDetailsCard from "../../components/ProfileDetailsCard";

const profile = () => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [userDescription, setUserDescription] = useState(user?.userDescription);
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

  const handeleSaveDescription = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8000/profile/${userId}`,
        { userDescription }
      );

      if (response.status === 200) {
        await fetchUserProfile();

        setIsEditing(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    setUserDescription(user?.userDescription);
  }, [user]);

  return (
    <View>
      <View style={styles.container}>
        <Pressable onPress={() => router.push("/home/profile")}>
          <Image
            style={styles.profileImage}
            source={{ uri: user?.profileImage }}
          />
        </Pressable>
        <Pressable>
          <Input
            placeholder={"Search"}
            iconName={"search"}
            mtop={true}
            width={250}
          />
        </Pressable>
        <MaterialCommunityIcons
          name="chat-processing-outline"
          size={24}
          color="black"
        />
      </View>

      <Image
        style={{ width: "100%", height: 130 }}
        source={{
          uri: "https://i.pinimg.com/originals/7f/e0/16/7fe0164ba9e585d328df978db8fbf5d9.jpg",
        }}
      />

      <View
        style={{
          position: "absolute",
          left: Dimensions.get("screen").width / 2 - 60,
          top: 130,
        }}
      >
        <Image style={styles.image} source={{ uri: user?.profileImage }} />
      </View>

      <View style={{ marginTop: 60, marginLeft: 10, gap: 5 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user?.name}</Text>
        <Pressable
          onPress={() => setIsEditing(!isEditing)}
          style={{ marginTop: 10 }}
        >
          <Text style={{ fontSize: 13, color: "gray" }}>
            {user?.userDescription ? "Edit" : "Add Bio"}
          </Text>
        </Pressable>

        <View>
          {isEditing ? (
            <>
              <TextInput
                onChangeText={(text) => setUserDescription(text)}
                placeholder="Enter your description"
                // style={styles.desc}
                accessibilityValue={true}
                defaultValue={userDescription}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  color={"#ff6e00"}
                  onPress={() => setIsEditing(false)}
                  title="Cancel"
                />
                <Button
                  color={"#ff6e00"}
                  onPress={handeleSaveDescription}
                  title="Save"
                />
              </View>
            </>
          ) : (
            <Text style={{ fontSize: 16 }}>{user?.userDescription}</Text>
          )}
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 16 }}>Youtube • needAhand Member</Text>
          <Text style={{ color: "gray" }}>
            Botofogo, Rio de Jenerio, Brazil
          </Text>
        </View>

        <View style={{ flexDirection: "row", width: "50%" }}>
          <Btn title={"Open To"} pad={6} />
          <Btn title={"Add Section"} pad={6} />
        </View>

        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Work History</Text>
          <Text style={{ color: "gray" }}>You can add your previous works</Text>
        </View>

        <View style={{ marginVertical: 10, flexDirection: "column", gap: 15 }}>
          <ProfileDetailsCard
            icon={"people"}
            number={"83523"}
            title={"People are seeking temporary jobs"}
            detail={"Checkout what kind of ability the others have"}
          />
          <ProfileDetailsCard
            icon={"stats-chart"}
            number={"51074"}
            title={"Jobs needs hand worldwide"}
            detail={"Discover new jobs and places all around"}
          />
          <ProfileDetailsCard
            icon={"search"}
            number={"1267"}
            title={"Jobs seem suitable for you"}
            detail={"See all possiblities according to your searchs"}
          />
        </View>
      </View>
      <View style={{ marginTop: 12 }}>
        <Btn
          title={"Logout"}
          width={"90%"}
          onPress={() => router.replace("/(authenticate)/register")}
        />
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderTopRightRadius: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "#fff",
    borderWidth: 2,
  },
  desc: {
    borderColor: "#e0e0e0",
    borderWidth: 2,
    backgroundColor: "#fff",
    width: Dimensions.get("window").width * 0.87,
    alignSelf: "center",
    marginTop: 40,
    height: Dimensions.get("window").height * 0.3,
  },
});
