import Tags from "@/components/Tags";
import useTagsDB from "@/db/tags";
import useTodosDB from "@/db/todos";
import { ITag, PriorityEnum } from "@/types/taskTypes";
import Button from "@ant-design/react-native/lib/button";
import DatePicker from "@ant-design/react-native/lib/date-picker";
import List from "@ant-design/react-native/lib/list";
import Modal from "@ant-design/react-native/lib/modal";
import Toast from "@ant-design/react-native/lib/toast";
import Picker from "@ant-design/react-native/lib/picker";
import Input from "@ant-design/react-native/lib/input";
import TextareaItem from "@ant-design/react-native/lib/textarea-item";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import React, { JSX, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// 优先级
const priorityList = [
  {
    value: PriorityEnum.High,
    label: "高优先级",
  },
  {
    value: PriorityEnum.Medium,
    label: "中优先级",
  },
  {
    value: PriorityEnum.Low,
    label: "低优先级",
  },
];

// 优先级对应图标
const priorityIconMap: Record<number, JSX.Element> = {
  [PriorityEnum.High]: <Feather name="flag" size={20} color="#fb2c36" />,
  [PriorityEnum.Medium]: <Feather name="flag" size={20} color="#f0b100" />,
  [PriorityEnum.Low]: <Feather name="flag" size={20} color="#00c951" />,
};

const App = () => {
  const { getAllTags, createTag } = useTagsDB();
  const { addTodo } = useTodosDB();
  const [dueDate, setDueDate] = useState(new Date()); // 截止日期
  const [selectTag, setSelectTag] = useState<ITag>(); // 当前选择的标签
  const [priority, setPriority] = useState([PriorityEnum.Low]); // 当前选择的优先级
  const [tagList, setTagList] = useState<ITag[]>([]);
  const [title, setTitle] = useState(""); // 任务标题
  const [description, setDescription] = useState(""); // 任务描述
  const [selectTagModalVisible, setSelectTagModalVisible] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // 创建标签
  const handleCreateTag = async (inputVal: string) => {
    await createTag(inputVal);
    const tagList = (await queryTagList()) || [];
    if (tagList.length > 0) {
      setSelectTag(() => tagList[tagList.length - 1]);
    }
  };

  const resetValues = () => {
    setTitle("");
    setDescription("");
    setSelectTag(undefined);
    setPriority([PriorityEnum.Low]);
    setDueDate(new Date());
  };

  const handleSubmit = async () => {
    if (!title) {
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
        title,
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

  useEffect(() => {
    queryTagList();
  }, []);

  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
      <View style={{ gap: 24 }}>
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
                任务名称
              </Text>
            </View>
          )}
          styles={{
            List: { backgroundColor: "transparent" },
          }}
        >
          <List.Item>
            <Input
              placeholder="请输入任务名称"
              inputStyle={{
                height: 40,
                lineHeight: 28,
                fontSize: 20,
                marginHorizontal: 0,
                paddingVertical: 0,
                textAlignVertical: "center",
                backgroundColor: "#fff",
              }}
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </List.Item>
        </List>

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
                优先级
              </Text>
            </View>
          )}
          styles={{
            List: { backgroundColor: "transparent" },
          }}
        >
          <Picker
            title="选择优先级"
            data={priorityList}
            value={priority}
            renderLabel={(item) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {priorityIconMap[item.value as PriorityEnum]}
                  <Text style={{ fontSize: 16 }}>{item.label}</Text>
                </View>
              );
            }}
            onChange={(v: any[]) => {
              setPriority(v);
            }}
          >
            <List.Item arrow="down">优先级</List.Item>
          </Picker>
        </List>

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
                截至日期
              </Text>
            </View>
          )}
          styles={{
            List: { backgroundColor: "transparent" },
          }}
        >
          <DatePicker
            value={dueDate}
            precision="day"
            onChange={(nextDate) => {
              console.log(nextDate);
              setDueDate(nextDate);
            }}
            format="YYYY-MM-DD"
          >
            <List.Item>截至日期</List.Item>
          </DatePicker>
        </List>

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
                任务描述
              </Text>
            </View>
          )}
          styles={{
            List: { backgroundColor: "transparent" },
          }}
        >
          <TextareaItem
            rows={5}
            placeholder="请输入任务描述"
            style={{ paddingVertical: 5 }}
            value={description}
            onChangeText={setDescription}
          />
        </List>

        <Button type="primary" loading={submitLoading} onPress={handleSubmit}>
          提交
        </Button>
      </View>

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  bottomSheetView: {
    padding: 16,
  },
});

export default App;
