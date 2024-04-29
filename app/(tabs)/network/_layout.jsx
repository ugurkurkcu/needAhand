import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerTitle: "Network" }} />
      <Stack.Screen
        name="connections"
        options={{ headerTitle: "Connections", headerBackTitleVisible:false }}
      />
    </Stack>
  );
}
