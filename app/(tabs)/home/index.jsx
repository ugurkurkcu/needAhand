import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Input from "../../components/Input";
import UserCard from "../../components/UserCard";
import Icons from "../../components/Icons";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";


const index = () => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState();
  const [post, setPost] = useState([]);
  const [showFullText, setShowFulText] = useState(false);
  const [lines, setLines] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
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
    const fetchAllPosts = async () => {
      await axios
        .get("http://localhost:8000/all")
        .then((res) => setPost(res.data.posts))
        .catch((err) => console.log("Error fetching posts", err.message));
    };

    fetchAllPosts();
  });

  const toggleShowFullText = () => {
    setShowFulText(!showFullText);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/like/${postId}/${userId}`
      );
      if (response.status === 200) {
        const updatedPost = await response.data.post;
        setIsLiked(updatedPost.likes.some((like) => like.user === userId));
      }
    } catch (error) {
      console.log("error liking/unliking the post", error);
    }
  };



  return (
    <ScrollView style={{ flex: 1 }}>
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
      {post.map((item, index) => (
        <View key={index} style={{ marginHorizontal: 15, marginTop: 20 }}>
          <UserCard
            key={index}
            uri={item?.user.profileImage}
            name={item?.user.name}
            at={item?.createdAt}
            close={true}
          />

          <View>
            <Text
              style={{ fontSize: 15, marginTop: 10 }}
              numberOfLines={showFullText ? undefined : 2}
              onTextLayout={(e) => setLines(e.nativeEvent.lines.length >= 2)}
            >
              {item?.description}
            </Text>
            {lines && (
              <Pressable onPress={toggleShowFullText}>
                {!showFullText && <Text>...</Text>}
                <Text style={{ color: "gray", fontSize: 12, marginTop: 5 }}>
                  {!showFullText ? "See more" : "See less"}
                </Text>
              </Pressable>
            )}
          </View>
          <View
            style={{
              height: 250,
              marginTop: 10,
            }}
          >
            <Image style={styles.image} source={{ uri: item?.imageUrl }} />
          </View>

          {item?.likes?.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginLeft: 10,
              }}
            >
              <FontAwesome name="thumbs-up" size={20} color="#ff6e00" />
              <Text style={{ marginTop: 2, fontSize: 12, color: "#ff6e00" }}>
                {item?.likes?.length}
              </Text>
            </View>
          )}

          <View
            style={{
              height: 2,
              marginTop: 10,
              borderBottomColor: "#e0e0e0",
              borderBottomWidth: 2,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 10,
            }}
          >
            <Icons
              onPress={() => handleLikePost(item?._id)}
              name={isLiked ? "thumbs-up" : "thumbs-o-up"}
              title={isLiked ? "Dislike" : "Like"}
            />
            <Icons name={"comment-o"} title={"Comment"} />
            <Icons name={"share-square-o"} title={"Repost"} />
            <Icons name={"send-o"} title={"Send"} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default index;

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
    width: "auto",
    height: 240,
    objectFit: "scale-down",
  },
});
