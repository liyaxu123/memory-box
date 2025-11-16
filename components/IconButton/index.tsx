import React, { useState } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IconButtonProps {
  icon: React.ReactNode; // 图标组件
  label: string; // 下方文字
  onPress?: (event: GestureResponderEvent) => void;
  activeColor?: string; // 按下时的背景色
  defaultColor?: string; // 默认背景色
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onPress,
  activeColor = "#f0f0f0",
  defaultColor = "transparent",
}) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: pressed ? activeColor : defaultColor },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>{icon}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  iconWrapper: {
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#333",
    marginTop: 8,
  },
});
