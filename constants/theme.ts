/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const primaryColor = "#030213"; // 主题色
const primaryColorDark = "#030213"; // 暗色模式下的主题色
const secondaryColor = "#f5f5f5"; // 背景色
const secondaryColorDark = "#1c1c1d"; // 暗色模式下的背景色
const tintColorLight = "#0a7ea4"; // 提示色
const tintColorDark = "#fff"; // 暗色模式下的提示色
const pageBackground = "#fbf9fa"; // 页面背景色
const pageBackgroundDark = "#030213"; // 暗色模式下的页面背景色

export const Colors = {
  light: {
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    pageBackground: pageBackground,
    text: "#11181C", // 文本颜色
    background: "#fff", // 背景色
    tint: tintColorLight, // 主题色
    icon: "#687076", // 图标颜色
    tabIconDefault: "#687076", // 未激活的图标颜色
    tabIconSelected: tintColorLight, // 激活的图标颜色
    borderColor: "#ebe6e7", // 边框颜色
    tagColor: "#fff",
  },
  dark: {
    primaryColor: primaryColorDark,
    secondaryColor: secondaryColorDark,
    pageBackground: pageBackgroundDark,
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    borderColor: "rgba(255, 255, 255, 0.1)",
    tagColor: "#000",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const FontSize = {
  xs: 12,
  xs2: 14,
  sm: 16,
  base: 20,
  lg: 24,
};

export const ScreenPadding = {
  horizontal: 24,
};
