import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const ConnectionRequest = ({
    item,
    connectionRequests,
    setConnectionRequests,
    userId,
  }) => {
    const acceptConnection = async (requestId) => {
      try {
        const response = await fetch(
          "http://localhost:8000/connection-request/accept",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              senderId: requestId,
              recepientId: userId,
            }),
          }
        );
  
        if (response) {
          setConnectionRequests(
            connectionRequests.filter((request) => request._id !== requestId)
          );
        }
      } catch (error) {
        console.log("error", error);
      }
    };
  return (
    <View style={styles.container}>
      <Image source={{ uri: item?.image }} style={styles.image} />
      <Text>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{item?.name} </Text>
        is inviting you to <Text style={{ color: "#ff6e00" }}>Connect</Text>
      </Text>
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <View style={styles.check}>
          <Feather name="x" size={18} color="black" />
        </View>
        <Pressable onPress={() => acceptConnection(item._id)} style={styles.check}>
          <FontAwesome5 name="check" size={16} color="#ff6e00" />
        </Pressable>
      </View>
    </View>
  );
};

export default ConnectionRequest;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "space-between",
  },

  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderTopRightRadius: 25,
    resizeMode: "cover",
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
});
