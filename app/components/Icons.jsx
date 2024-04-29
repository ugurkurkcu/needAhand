import { Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const Icons = ({ name, title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FontAwesome name={name} size={20} color="#ff6e00" />
      <Text style={{ marginTop: 2, fontSize: 12, color: "#ff6e00" }}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Icons;

const styles = StyleSheet.create({});
