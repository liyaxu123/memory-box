import { View } from "react-native";
import { List } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import { authenticate } from "@/utils/auth";
import { exportData, importData } from "@/utils/exportImport";
import usePasswordDB from "@/db/password";
import Toast from "@ant-design/react-native/lib/toast";

const Profile = () => {
  const { getAllPasswords, createPassword, getPasswordCount } = usePasswordDB();

  // 导出密码本
  const exportPasswordBook = async () => {
    const success = await authenticate({
      promptMessage: "请进行指纹或面部认证",
      fallbackLabel: "使用密码登录",
    });
    if (success) {
      // 获取所有的密码
      const passwords = await getAllPasswords();
      // 导出密码
      exportData(passwords || []);
      Toast.success("导出成功");
    }
  };

  // 导入密码本
  const importPasswordBook = async () => {
    const count = await getPasswordCount();
    if (count === 0) {
      const passwords = await importData();
      if (passwords.length > 0) {
        for (let i = 0; i < passwords.length; i++) {
          const password = passwords[i];
          await createPassword(password);
        }
      }
      Toast.success("导入成功");
    } else {
      Toast.fail("请先清空现有密码本，再进行导入操作");
    }
  };

  return (
    <>
      <View>
        <List
          renderHeader={"数据管理"}
          style={{ paddingHorizontal: 16, backgroundColor: "transparent" }}
        >
          <List.Item
            thumb={
              <Feather name="download" size={18} style={{ marginRight: 8 }} />
            }
            onPress={exportPasswordBook}
          >
            导出密码本
          </List.Item>

          <List.Item
            thumb={
              <Feather name="upload" size={18} style={{ marginRight: 8 }} />
            }
            onPress={importPasswordBook}
          >
            导入密码本
          </List.Item>
        </List>
      </View>
    </>
  );
};

export default Profile;
