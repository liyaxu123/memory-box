import IconPicker, { IconProp } from "@/components/IconPicker";
import Tags from "@/components/Tags";
import useTagsDB from "@/db/tags";
import useTodosDB from "@/db/todos";
import { ITag } from "@/types/taskTypes";
import Button from "@ant-design/react-native/lib/button";
import Input from "@ant-design/react-native/lib/input";
import List from "@ant-design/react-native/lib/list";
import Modal from "@ant-design/react-native/lib/modal";
import TextareaItem from "@ant-design/react-native/lib/textarea-item";
import Toast from "@ant-design/react-native/lib/toast";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import IconView from "@/components/IconView";

const App = () => {
  const { getAllTags, createTag } = useTagsDB();
  const { addTodo } = useTodosDB();
  const [selectTag, setSelectTag] = useState<ITag>(); // 当前选择的标签
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [name, setName] = useState(""); // 网站/应用名称
  const [username, setUsername] = useState(""); // 用户名
  const [password, setPassword] = useState(""); // 密码
  const [iconName, setIconName] = useState(""); // 图标名称
  const [website, setWebsite] = useState(""); // 网站地址
  const [description, setDescription] = useState(""); // 备注
  const [selectTagModalVisible, setSelectTagModalVisible] = useState(false); // 选择标签模态框是否可见
  const [submitLoading, setSubmitLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 创建标签
  const handleCreateTag = async (inputVal: string) => {
    await createTag(inputVal);
    const tagList = (await queryTagList()) || [];
    if (tagList.length > 0) {
      setSelectTag(() => tagList[tagList.length - 1]);
    }
  };

  const resetValues = () => {
    setName("");
    setDescription("");
    setSelectTag(undefined);
  };

  const handleSubmit = async () => {
    if (!name) {
      Toast.fail("请输入任务名称");
      return;
    }
    if (!selectTag) {
      Toast.fail("请选择标签");
      return;
    }

    try {
      setSubmitLoading(true);
      await addTodo({
        name,
        description,
        completed: false,
        priority: priority[0],
        tag: selectTag,
        dueDate: dayjs(dueDate).format("YYYY-MM-DD HH:mm:ss"),
      });
      resetValues();
      Toast.success("新建成功");
    } catch (error) {
      console.log(error);
      Toast.fail("新建失败");
    } finally {
      setSubmitLoading(false);
    }
  };

  const queryTagList = async () => {
    const tagList = await getAllTags();
    setTagList(tagList || []);
    return tagList;
  };

  const handleIconSelect = (data: IconProp) => {
    setIconName(`${data.family}::${data.name}`);
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    queryTagList();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ gap: 24, padding: 24 }}>
          {/* 网站/应用名称 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  网站/应用名称
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <List.Item>
              <Input
                placeholder="请输入网站/应用名称"
                inputStyle={{
                  height: 40,
                  lineHeight: 28,
                  fontSize: 20,
                  marginHorizontal: 0,
                  paddingVertical: 0,
                  textAlignVertical: "center",
                  backgroundColor: "#fff",
                }}
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </List.Item>
          </List>

          {/* 用户名 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  用户名
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <List.Item>
              <Input
                placeholder="请输入用户名"
                inputStyle={{
                  height: 40,
                  lineHeight: 28,
                  fontSize: 20,
                  marginHorizontal: 0,
                  paddingVertical: 0,
                  textAlignVertical: "center",
                  backgroundColor: "#fff",
                }}
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            </List.Item>
          </List>

          {/* 密码 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  密码
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <List.Item>
              <Input
                placeholder="请输入密码"
                inputStyle={{
                  height: 40,
                  lineHeight: 28,
                  fontSize: 20,
                  marginHorizontal: 0,
                  paddingVertical: 0,
                  textAlignVertical: "center",
                  backgroundColor: "#fff",
                }}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
            </List.Item>
          </List>

          {/* 网站地址 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  网站地址
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <List.Item>
              <Input
                placeholder="请输入网站地址"
                inputStyle={{
                  height: 40,
                  lineHeight: 28,
                  fontSize: 20,
                  marginHorizontal: 0,
                  paddingVertical: 0,
                  textAlignVertical: "center",
                  backgroundColor: "#fff",
                }}
                value={website}
                onChangeText={(text) => setWebsite(text)}
              />
            </List.Item>
          </List>

          {/* 图标 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  图标
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <List.Item
              arrow="down"
              onPress={() => {
                bottomSheetRef.current?.snapToPosition("50%");
              }}
              extra={<IconView name={iconName} size={20} color="#333" />}
            >
              选择图标
            </List.Item>
          </List>

          {/* 标签 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  标签
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <List.Item
              arrow="down"
              onPress={() => {
                setSelectTagModalVisible(true);
              }}
              extra={selectTag?.value}
            >
              选择标签
            </List.Item>
          </List>

          {/* 备注 */}
          <List
            renderHeader={() => (
              <View style={{ marginBottom: 4, backgroundColor: "transparent" }}>
                <Text
                  style={{
                    color: "#8F9BB3",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: "System",
                  }}
                >
                  备注
                </Text>
              </View>
            )}
            styles={{
              List: { backgroundColor: "transparent" },
            }}
          >
            <TextareaItem
              rows={5}
              placeholder="请输入备注"
              style={{ paddingVertical: 5 }}
              value={description}
              onChangeText={setDescription}
            />
          </List>

          <Button type="primary" loading={submitLoading} onPress={handleSubmit}>
            提交
          </Button>
        </View>
      </ScrollView>

      {/* 选择标签模态框 */}
      <Modal
        popup
        maskClosable={false}
        visible={selectTagModalVisible}
        animationType="slide-up"
        onClose={() => setSelectTagModalVisible(false)}
      >
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 16,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              onPress={() => {
                setSelectTag(undefined);
                setSelectTagModalVisible(false);
              }}
            >
              取消
            </Text>
            <Text style={{ fontSize: 16, textAlign: "center" }}>选择标签</Text>
            <Text
              onPress={() => {
                setSelectTagModalVisible(false);
              }}
            >
              确定
            </Text>
          </View>

          <Tags.Group
            defaultKey={selectTag?.key}
            tags={tagList}
            afterSlot={
              <Button
                size="small"
                type="ghost"
                style={{ paddingHorizontal: 8, borderRadius: 8 }}
                onPress={() => {
                  Modal.prompt("创建标签", "", handleCreateTag, "default", "", [
                    "请输入标签名称",
                  ]);
                }}
              >
                <Feather name="plus" color="#274BDB" />
              </Button>
            }
            onChange={(tag) => {
              setSelectTag(tag);
            }}
          />
        </View>
        <View style={{ height: 200 }}></View>
      </Modal>

      {/* 图标选择器 */}
      <IconPicker ref={bottomSheetRef} onSelect={handleIconSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetView: {
    padding: 16,
  },
  iconPickerContainer: {
    height: 300,
  },
});

export default App;
