import { Tabs } from "expo-router";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "#ff6e00" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Entypo name="home" size={24} color="#ff6e00" />
            ) : (
              <SimpleLineIcons name="home" size={24} color="#ff6e00" />
            ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          tabBarLabel: "Network",
          tabBarLabelStyle: { color: "#ff6e00" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Ionicons name="people-sharp" size={24} color="#ff6e00" />
            ) : (
              <Ionicons name="people-outline" size={24} color="#ff6e00" />
            ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarLabel: "Post",
          tabBarLabelStyle: { color: "#ff6e00" },
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? (
              <MaterialCommunityIcons
                name="puzzle-plus"
                size={24}
                color="#ff6e00"
              />
            ) : (
              <MaterialCommunityIcons
                name="puzzle-plus-outline"
                size={24}
                color="#ff6e00"
              />
            ),
        }}
      />
    </Tabs>
  );
}
