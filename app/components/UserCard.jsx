import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import moment from "moment";
import { Entypo, FontAwesome } from "@expo/vector-icons";

const UserCard = ({ uri, name, at,close }) => {
  return (
    <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
      <Image
        style={{
          height: 55,
          width: 55,
          borderRadius: 10,
          borderTopRightRadius: 25,
        }}
        source={{ uri: uri }}
      />

      <View
        style={{
          borderWidth: 1,
          borderRightColor: "#e0e0e0",
          width: 2,
          height: 55,
          opacity: 0.3,
        }}
      />

      <View
        style={{
          flex: 1,
          flexDirection: "column",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600" }}>{name}</Text>

        <Text style={{ color: "gray", fontSize: 12, fontWeight: "400" }}>
          MERN Stack Developer
        </Text>

        <Text style={{ color: "gray", fontSize: 12, fontWeight: "400" }}>
          connected on {moment(at).format("DD MMM YYYY")}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 10, justifyContent: "center" }}>
        <Entypo name="dots-three-vertical" size={24} color="black" />
        <FontAwesome name={close?"close":"send"} size={24} color="black" />
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({});
