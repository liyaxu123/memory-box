import { Tag } from "@/components/Tags";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IPasswordItem } from "@/types/passwordTypes";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconView from "../IconView";

interface PasswordItemProps {
  passData: IPasswordItem;
}

const PasswordItem: React.FC<PasswordItemProps> = ({ passData }) => {
  const colorScheme = useColorScheme();
  const [showPassword, setShowPassword] = useState(false); // 密码是否显示

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const styles = StyleSheet.create({
    passwordItem: {
      gap: 12,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      padding: 16,
      marginBottom: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? "light"].borderColor,
      marginHorizontal: 16,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    cardBody: {},
    cardFooter: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: Colors[colorScheme ?? "light"].borderColor,
    },
  });

  return (
    <View style={styles.passwordItem}>
      <View style={styles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* 图标 */}
          <IconView name={passData?.icon} size={16} color="#0a0a0a" />
          {/* 名称 */}
          <Text style={{ fontSize: 16 }}>{passData?.name}</Text>
        </View>
        <Tag
          text={passData?.tag?.value || ""}
          style={{ backgroundColor: "#f2edee" }}
        />
      </View>

      <View style={styles.cardBody}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text>用户名</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text>{passData?.username}</Text>
            <TouchableOpacity
              style={{ paddingVertical: 4, paddingHorizontal: 10 }}
            >
              <Feather name="copy" size={16} color="#0a0a0a" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text>密码</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text>{showPassword ? passData?.password : "••••••••"}</Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <TouchableOpacity
                style={{ paddingVertical: 4, paddingHorizontal: 10 }}
                onPress={handleShowPassword}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={16}
                  color="#0a0a0a"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ paddingVertical: 4, paddingHorizontal: 10 }}
              >
                <Feather name="copy" size={16} color="#0a0a0a" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text>网站</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: "#155dfc" }}>{passData?.website}</Text>
            <TouchableOpacity
              style={{ paddingVertical: 4, paddingHorizontal: 10 }}
            >
              <Feather name="copy" size={16} color="#0a0a0a" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        {passData?.notes && (
          <View style={{ paddingBottom: 12 }}>
            <Text>{passData?.notes}</Text>
          </View>
        )}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {passData?.createdAt && (
            <Text style={{ color: "#6a7282" }}>
              创建时间：{passData?.createdAt!.toLocaleString()}
            </Text>
          )}
          {passData?.lastUsed && (
            <Text style={{ color: "#6a7282" }}>
              最后使用：{passData?.lastUsed!.toLocaleString()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default PasswordItem;
