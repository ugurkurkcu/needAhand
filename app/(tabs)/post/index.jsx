import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import Btn from "../../components/Btn";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { firebase } from "../../../firebase";
import axios from "axios";
import { useRouter } from "expo-router";

const index = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [userId, setUserId] = useState("");
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createrPost = async () => {
    try {
      const uploadedUrl = await uploadFile();

      const postData = {
        description: description,
        imageUrl: uploadedUrl,
        userId: userId,
      };

      const response = await axios.post(
        "http://localhost:8000/create",
        postData
      );

      console.log("post created", response.data);

      if (response.status === 201) {
        setDescription("");
        setImage("");
        router.replace("/(tabs)/home");
      }
    } catch (error) {
      console.log("Error creating post", error);
    }
  };

  const uploadFile = async () => {
    try {
      // Ensure that 'image' contains a valid file URI
      console.log("Image URI:", image);

      const { uri } = await FileSystem.getInfoAsync(image);

      if (!uri) {
        throw new Error("Invalid file URI");
      }

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = (e) => {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const filename = image.substring(image.lastIndexOf("/") + 1);

      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);

      const downloadURL = await ref.getDownloadURL();
      // setUrl(downloadURL);
      return downloadURL;
      // Alert.alert("Photo uploaded");
    } catch (error) {
      console.log("Error:", error);
      // Handle the error or display a user-friendly message
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Entypo name="circle-with-cross" size={24} color="black" />
          <View style={styles.wrapper}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={{
                uri: "https://yt3.googleusercontent.com/CLRAb_-U5so379VE7F8-DiGGrJkX3qRkkbLyeYNeCUjOTbwqbN4wJvVxNQhN5_Ym57lbd5D6=s900-c-k-c0x00ffffff-no-rj",
              }}
            />
            <Text style={{ fontWeight: "500" }}>Anyone</Text>
          </View>
        </View>

        <View style={styles.wrapper}>
          <Entypo name="back-in-time" size={24} color="black" />
          <Btn onPress={createrPost} title={"Post"} pad={6} width={80} />
        </View>
      </View>
      <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        placeholder="What do you want to talk about?"
        style={styles.textInput}
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
      />

      <View>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: 240, marginVertical: 20 }}
          />
        )}
      </View>

      <Pressable
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          flexDirection: "column",
        }}
      >
        <Pressable onPress={pickImage} style={styles.pressableIcon}>
          <FontAwesome5 name="photo-video" size={18} color="#ff6e00" />
        </Pressable>
        <Text style={{ color: "#ff6e00" }}>Media</Text>
      </Pressable>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 7,
    paddingBottom: 7,
    borderBottomColor: "#e0e0e0",
    borderBottomWidth: 3,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  textInput: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
    paddingHorizontal: 10,
    maxHeight: Dimensions.get("window").height / 2,
    textAlign: "justify",
  },
  pressableIcon: {
    width: 40,
    height: 40,
    marginTop: 40,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
