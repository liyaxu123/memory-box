import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  Pressable,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
const Button: React.FC<ButtonProps> = ({ title, icon, style, onPress }) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    button: {
      backgroundColor: Colors[colorScheme ?? "light"].primaryColor,
      padding: 8,
      borderRadius: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    icon: {
      color: colorScheme === "dark" ? Colors.light.tint : Colors.dark.tint,
    },
    title: {
      color: colorScheme === "dark" ? Colors.light.tint : Colors.dark.tint,
      fontSize: 16,
      fontWeight: "bold",
    },
  });

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.button, style]}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        {title && <Text style={styles.title}>{title}</Text>}
      </View>
    </Pressable>
  );
};

export default Button;
