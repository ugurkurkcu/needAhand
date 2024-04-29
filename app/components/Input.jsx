import { StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Input = ({
  placeholder,
  iconName,
  onChange,
  value,
  secure,
  mtop,
  width,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        backgroundColor: "#ffcf91",
        paddingVertical: 5,
        borderRadius: 10,
        marginTop: mtop ? "auto" : 30,
      }}
    >
      <MaterialIcons
        style={{ marginLeft: 7 }}
        name={iconName}
        size={20}
        color="black"
      />
      <TextInput
        secureTextEntry={secure}
        autoCapitalize="none"
        value={value}
        onChangeText={onChange}
        style={{ color: "black", marginVertical: 5, width: width ? width : 300 }}
        placeholder={placeholder}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({});
