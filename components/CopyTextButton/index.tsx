import { Toast } from "@ant-design/react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { TouchableOpacity } from "react-native";

interface CopyTextButtonProps {
  text?: string;
}

const CopyTextButton: React.FC<CopyTextButtonProps> = ({ text }) => {
  return (
    <TouchableOpacity
      style={{ paddingVertical: 4, paddingHorizontal: 10 }}
      onPress={async () => {
        // 复制到剪贴板
        await Clipboard.setStringAsync(text || "");
        Toast.show({
          content: "复制成功",
          position: "top",
        });
      }}
    >
      <Feather name="copy" size={16} color="#0a0a0a" />
    </TouchableOpacity>
  );
};

export default CopyTextButton;
