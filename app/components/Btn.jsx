import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const Btn = ({ title, width, bac, onPress, pad, border }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: width,
        backgroundColor: bac ? bac : "#ff6e00",
        borderRadius: 15,
        marginLeft: "auto",
        marginRight: "auto",
        padding: pad ? pad : 12,
        borderColor: border,
        borderWidth: border ? 1 : "none",
      }}
    >
      <Text
        style={{
          color: border ? border : "white",
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Btn;

const styles = StyleSheet.create({});
