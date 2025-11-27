import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { theme } from '../../constants/theme';

function TabBarIcon(props: Readonly<{
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}>) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const HistoryIcon = ({ color }: { color: string }) => <TabBarIcon name="history" color={color} />;
const HomeIcon = ({ color }: { color: string }) => <TabBarIcon name="home" color={color} />;
const UserIcon = ({ color }: { color: string }) => <TabBarIcon name="user" color={color} />;

const TabLayout: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            elevation: 0,
          },
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { color: "#FFFFFF" },
          sceneStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Tabs.Screen
          name="history"
          options={{
            title: "Historial",
            tabBarIcon: HistoryIcon,
          }}
        />
        <Tabs.Screen
          name="routines"
          options={{
            title: "Entrenamiento",
            tabBarIcon: HomeIcon,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: UserIcon,
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabLayout;
