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
import Btn from "../components/Btn";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.replace("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };

    // checkLoginStatus();
  }, []);

  const handleLogin = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:8000/login", user)
      .then((res) => {
        console.log(res.data);
        const token = res.data.token;
        AsyncStorage.setItem("authToken", token);

        router.replace("/(tabs)/home");
      })
      .catch((err) => {
        console.log("Invalid email or password", err);
        Alert.alert("Invalid email or password");
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
            Log In To Your Account
          </Text>
        </View>
        <View style={{ marginTop: 77 }}>
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
            title={"Login"}
            width={200}
            bac={"#ff6e00"}
            onPress={handleLogin}
          />

          <Pressable
            onPress={() => router.replace("/register")}
            style={{ marginTop: 16 }}
          >
            <Text
              style={{ textAlign: "center", color: "#ff6e00", fontSize: 16 }}
            >
              Don't have an account? Sign Up!
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
