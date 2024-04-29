import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ProfileDetailsCard = ({ icon, number, title, detail }) => {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={30} color="black" />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{number}</Text>{" "}
          {title}
        </Text>
        <Text style={{ fontSize: 15, color: "gray" }}>{detail}</Text>
      </View>
    </View>
  );
};

export default ProfileDetailsCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
});
