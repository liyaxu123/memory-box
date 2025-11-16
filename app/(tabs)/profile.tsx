import { View } from "react-native";
import { List } from "@ant-design/react-native";
import Feather from "@expo/vector-icons/Feather";
import { authenticate } from "@/utils/auth";
import { exportData, importData } from "@/utils/exportImport";
import usePasswordDB from "@/db/password";
import usePasswordTagsDB from "@/db/password_tags";
import Toast from "@ant-design/react-native/lib/toast";

const Profile = () => {
  const { getAllTags, insertTag } = usePasswordTagsDB();
  const { getAllPasswords, insertPassword, getPasswordCount } = usePasswordDB();

  // 导出密码本
  const exportPasswordBook = async () => {
    const success = await authenticate({
      promptMessage: "请进行指纹或面部认证",
      fallbackLabel: "使用密码登录",
    });
    if (success) {
      // 获取所有的标签
      const tags = await getAllTags();
      // 获取所有的密码
      const passwords = await getAllPasswords();
      // 导出密码
      exportData({
        version: 1,
        tables: {
          password_tags: tags,
          passwords,
        },
      });
      Toast.success("导出成功");
    }
  };

  // 导入密码本
  const importPasswordBook = async () => {
    const count = await getPasswordCount();
    if (count === 0) {
      const jsonData = await importData();
      // 获取标签表和密码表
      const { password_tags: tags, passwords } = jsonData?.tables || {};
      // 导入标签表
      if (tags.length > 0) {
        for (let i = 0; i < tags.length; i++) {
          const tagData = tags[i];
          await insertTag(tagData);
        }
      }
      // 导入密码表
      if (passwords.length > 0) {
        for (let i = 0; i < passwords.length; i++) {
          const password = passwords[i];
          await insertPassword(password);
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
