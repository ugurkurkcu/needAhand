import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Input from "./Input";

const SearchProfile = (onPress, image) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress}>
        <Image style={styles.profileImage} source={{ uri: `${image}` }} />
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
  );
};

export default SearchProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderTopRightRadius: 20,
  },
});
