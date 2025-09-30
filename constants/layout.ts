import { Colors, FontSize } from "@/constants/theme";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const StackScreenWithSearchBar: NativeStackNavigationOptions = {
  headerLargeTitle: true, // 大标题
  headerLargeStyle: {
    backgroundColor: Colors.light.background,
  },
  headerLargeTitleStyle: {
    color: Colors.light.text,
    fontSize: FontSize.lg,
    fontWeight: "bold",
  },
  headerTintColor: Colors.light.text, // 标题颜色
  headerTransparent: true, // 标题透明
  headerBlurEffect: "prominent", // 模糊效果
  headerShadowVisible: false, // 隐藏标题上的仰角阴影（Android）或底部边框（iOS）。
  headerTitleStyle: {
    fontSize: 28,
    fontWeight: "bold",
  },
};
