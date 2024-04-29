import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Input from "../components/Input";
import { useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import Btn from "../components/Btn";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setNmae] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter();

  const handleRegister = () => {
    const user = {
      name: name,
      email: email,
      password: password,
      profileImage: image,
    };

    axios
      .post("http://localhost:8000/register", user)
      .then((res) => {
        console.log(res);
        Alert.alert(
          "Registration is successful",
          "You have been registered successfully"
        );
        setNmae("");
        setEmail("");
        setPassword("");
        setImage("");
        router.replace("/login")
      })
      .catch((err) => {
        console.log("Registration failed", err);
        Alert.alert(
          "Registration failed",
          "An error occurred while registering"
        );
      });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}
    >
      <View>
        <Image
          style={{
            width: 150,
            height: 150,
            resizeMode: "contain",
            marginTop: 30,
            shadowColor: "black",
            shadowRadius: 6,
            shadowOpacity: 10,
          }}
          source={require("../../assets/logo.png")}
        />
      </View>

      <KeyboardAvoidingView>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 30 }}>
            Register To Your Account
          </Text>
        </View>
        <View style={{ marginTop: 77 }}>
          <Input
            placeholder={"enter your Name"}
            iconName={"person"}
            onChange={(text) => setNmae(text)}
            value={name}
          />
          <Input
            placeholder={"enter your Email"}
            iconName={"alternate-email"}
            onChange={(text) => setEmail(text)}
            value={email}
          />
          <Input
            onChange={(text) => setPassword(text)}
            value={password}
            placeholder={"enter your Password"}
            iconName={"lock"}
            secure={true}
          />
          <Input
            onChange={(text) => setImage(text)}
            value={image}
            placeholder={"choose an Image"}
            iconName={"image"}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <Text style={{ fontSize: 14, color: "#000000" }}>
            Keep me logged in
          </Text>
          <Text style={{ fontSize: 14, color: "#ff6e00" }}>
            Forgot my password
          </Text>
        </View>
        <View style={{ marginTop: 70 }}>
          <Btn
            onPress={handleRegister}
            title={"Register"}
            width={200}
            bac={"#ff6e00"}
          />

          <Pressable
            onPress={() => router.replace("/login")}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{ textAlign: "center", color: "#ff6e00", fontSize: 16 }}
            >
              Already have an account? Sign In!
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default register;

const styles = StyleSheet.create({});
