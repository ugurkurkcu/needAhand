import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Fontisto } from "@expo/vector-icons";

const PressableLine = ({ onPress,text, inv }) => {
  return (
    <View>
      <Pressable
      onPress={onPress}
        style={{
          marginTop: 10,
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "700" }}>
          {text} {inv&& inv}
        </Text>
        <Fontisto name="arrow-right" size={20} color="black" />
      </Pressable>
      <View
        style={{ borderColor: "#e0e0e0", borderWidth: 2, marginVertical: 10 }}
      />
    </View>
  );
};

export default PressableLine;

const styles = StyleSheet.create({});
