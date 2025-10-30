import { Toast } from "@ant-design/react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { authenticate } from "@/utils/auth";
import { TouchableOpacity } from "react-native";

interface CopyTextButtonProps {
  text?: string; // 要复制的文本
  // 是否需要指纹验证
  needFingerprint?: boolean;
}

const CopyTextButton: React.FC<CopyTextButtonProps> = ({
  text,
  needFingerprint,
}) => {
  const handleCopy = async () => {
    if (needFingerprint) {
      const success = await authenticate({
        promptMessage: "请进行指纹或面部认证",
        fallbackLabel: "使用密码登录",
      });
      if (!success) return;
    }

    // 复制到剪贴板
    await Clipboard.setStringAsync(text || "");
    Toast.show({
      content: "复制成功",
      position: "top",
    });
  };

  return (
    <TouchableOpacity
      style={{ paddingVertical: 4, paddingHorizontal: 10 }}
      onPress={handleCopy}
    >
      <Feather name="copy" size={16} color="#0a0a0a" />
    </TouchableOpacity>
  );
};

export default CopyTextButton;
