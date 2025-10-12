import Button from "@/components/Button";
import { Colors, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
// import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Tabs, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

// SQLite.deleteDatabaseSync(dbName); // 删除数据库

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const db = useSQLiteContext();
  // 启用 Sqlite 管理插件
  // useDrizzleStudio(db);

  useEffect(() => {
    async function setup() {
      const result = await db.getFirstAsync<{ "sqlite_version()": string }>(
        "SELECT sqlite_version()"
      );
      console.log("当前数据库版本：", result?.["sqlite_version()"]);
    }
    setup();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint, // 激活的图标颜色
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault, // 未激活的图标颜色
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 0,
          backgroundColor: Colors[colorScheme ?? "light"].background,
          borderTopColor: Colors[colorScheme ?? "light"].borderColor,
        },
        tabBarLabelStyle: {
          fontSize: FontSize.xs,
          fontWeight: 500,
        },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].background,
          elevation: 0, // 设置 Android 标题栏阴影高度
        },
        headerTintColor: Colors[colorScheme ?? "light"].text, // 标题颜色
        headerTitleAlign: "left", // 标题居左
        headerTitleStyle: {
          fontSize: FontSize.lg,
          fontWeight: "bold",
        },
        tabBarBackground: () => (
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            intensity={95}
            style={{
              ...StyleSheet.absoluteFillObject, // 全屏覆盖
              overflow: "hidden",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        ),
      }}
    >
      {/* 待办 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "待办清单",
          tabBarIcon: ({ color }) => (
            <Feather name="check-square" size={24} color={color} />
          ),
          headerRight: () => (
            <>
              <Button
                icon={<Feather name="plus" size={20} color="#fff" />}
                style={{
                  marginRight: 20,
                  borderRadius: "50%",
                }}
                onPress={() => {
                  // 跳转到 newTodo 页面
                  router.push("/newTodo");
                }}
              />
            </>
          ),
        }}
      />
      {/* 密码 */}
      <Tabs.Screen
        name="passwords"
        options={{
          title: "密码",
          tabBarIcon: ({ color }) => (
            <Feather name="lock" size={24} color={color} />
          ),
          headerRight: () => (
            <>
              <Button
                icon={<Feather name="plus" size={20} color="#fff" />}
                style={{ marginRight: 20, borderRadius: 18 }}
              />
            </>
          ),
        }}
      />
      {/* 卡包 */}
      <Tabs.Screen
        name="cards"
        options={{
          title: "卡包",
          tabBarIcon: ({ color }) => (
            <Feather name="credit-card" size={24} color={color} />
          ),
        }}
      />
      {/* 我的 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
