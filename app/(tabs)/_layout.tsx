import { Tabs } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import { Redirect } from "expo-router";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // TEMPORARY: Comment out auth check for development
  // if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs screenOptions={{ tabBarStyle: { display: "none" } }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
