import Fallback from "@/components/Fallback";
import { Colors } from "@/constants/theme";
import { migrateDbIfNeeded } from "@/db";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Provider } from "@ant-design/react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { Suspense } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    antoutline: require("@ant-design/icons-react-native/fonts/antoutline.ttf"),
  });

  return (
    <Suspense fallback={<Fallback />}>
      <SQLiteProvider
        databaseName="todos.db"
        onInit={migrateDbIfNeeded}
        useSuspense
        options={{ useNewConnection: false }}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Provider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  animation: "slide_from_right",
                  headerShown: true, // 显示根 Stack 的头部
                  headerShadowVisible: false, // 是否隐藏标题上的仰角阴影（Android）或底部边框（iOS）。
                  headerStyle: {
                    backgroundColor: Colors[colorScheme ?? "light"].background,
                  },
                  headerTintColor: Colors[colorScheme ?? "light"].text, // 标题颜色
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="newTodo"
                  options={{
                    title: "新建任务",
                    headerTitleAlign: "center",
                  }}
                />
              </Stack>
              <StatusBar style="auto" />
            </GestureHandlerRootView>
          </Provider>
        </ThemeProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
