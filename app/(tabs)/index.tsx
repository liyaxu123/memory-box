import IconButton from "@/components/IconButton";
import Tags from "@/components/Tags";
import TaskItem from "@/components/TaskItem";
import { Colors } from "@/constants/theme";
import useTagsDB from "@/db/tags";
import useTodosDB from "@/db/todos";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ITag, ITaskItem } from "@/types/taskTypes";
import Modal from "@ant-design/react-native/lib/modal";
import Toast from "@ant-design/react-native/lib/toast";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { useRouter } from "expo-router";

const allTag: ITag = {
  key: "all",
  value: "全部",
  created_at: "",
  updated_at: "",
};

const audioSource = require("@/assets/audios/successed02.mp3");
const Todos = () => {
  const router = useRouter();
  const player = useAudioPlayer(audioSource);
  const { getAllTags } = useTagsDB();
  const { getTodos, toggleCompletedById, deleteTodoById } = useTodosDB();
  const colorScheme = useColorScheme();
  const [tagList, setTagList] = useState<ITag[]>([]); // 标签列表
  const [taskData, setTaskData] = useState<ITaskItem[]>([]); // 任务列表
  const [completedTotal, setCompletedTotal] = useState(0); // 已完成总数
  const [total, setTotal] = useState(0); // 总数
  const [selectedTag, setSelectedTag] = useState<ITag>(allTag); // 当前选中的标签
  const [modalVisible, setModalVisible] = useState(false); // 更多操作弹窗
  const [selectedTask, setSelectedTask] = useState<ITaskItem | null>(null); // 当前选中的任务
  const [page, setPage] = useState(1); // 当前页码
  const [hasMore, setHasMore] = useState(false); // 是否有更多数据

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].pageBackground,
    },
    pageHeader: {
      padding: 16,
      paddingTop: 0,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? "light"].borderColor,
    },
    searchBar: {
      height: 40,
      paddingLeft: 12,
      backgroundColor: "#f3f3f5",
      borderRadius: 8,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    totalInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
    },
    pageBody: {
      flex: 1,
    },
  });

  const queryTagList = async () => {
    const tagList = await getAllTags();
    setTagList(() => {
      const list = tagList || [];
      list.unshift(allTag);
      return list;
    });
  };

  const queryTodoList = async (
    page: number,
    tag?: ITag,
    append: boolean = false
  ) => {
    try {
      const actualTag = tag || selectedTag;
      const res = await getTodos({
        page,
        pageSize: 10,
        tagKey: actualTag?.key === "all" ? undefined : actualTag?.key,
      });
      // console.log("列表数据：", res);
      const list = (res?.todos || []) as ITaskItem[];
      if (append) {
        // 追加模式：将新数据追加到现有数据后面
        setTaskData((prevData) => [...prevData, ...list]);
      } else {
        // 替换模式：直接替换现有数据（用于刷新或切换标签）
        setTaskData(list);
      }
      setTotal(res?.total || 0);
      setCompletedTotal(res?.completedTotal || 0);
      setHasMore(res?.hasMore || false);
      return list;
    } catch (error) {
      console.log(error);
      setHasMore(false);
    }
  };

  const refreshTodoList = () => {
    setTaskData([]);
    setPage(1);
    setHasMore(false);
    queryTodoList(1);
  };

  // 切换完成状态
  const handleCompletedChange = async (taskId: string, completed: boolean) => {
    try {
      if (completed) {
        // 手机震动
        Haptics.selectionAsync();
        // 播放完成音效
        player.seekTo(0);
        player.play();
      }
      await toggleCompletedById(taskId, completed);
      // 更新列表数据
      setTaskData((prevData) =>
        prevData.map((item) =>
          item.id === taskId ? { ...item, completed } : item
        )
      );
      // 更新已完成数量
      setCompletedTotal((prevCount) =>
        completed ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.log(error);
    }
  };

  // 删除任务
  const handleDelete = async () => {
    try {
      await deleteTodoById(selectedTask?.id!);
      // 更新列表数据
      setTaskData((prevData) =>
        prevData.filter((item) => item.id !== selectedTask?.id)
      );
      // 更新总数
      setTotal((prevCount) => prevCount - 1);
      if (selectedTask?.completed) {
        setCompletedTotal((prevCount) => prevCount - 1);
      }
      Toast.success("删除成功");
    } catch (error) {
      console.log(error);
      Toast.fail("删除失败");
    }
  };

  const init = () => {
    queryTagList();
    queryTodoList(1);
  };

  // 使用useFocusEffect确保页面每次获得焦点时都重新加载数据
  useFocusEffect(
    useCallback(() => {
      init();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* 头部搜索区域 */}
      <View style={styles.pageHeader}>
        {/* 搜索栏 */}
        <TouchableHighlight>
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color="#99a1af" />
            <Text style={{ color: "#99a1af" }}>搜索任务...</Text>
          </View>
        </TouchableHighlight>
        {/* 标签分类 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Tags.Group
            defaultKey="all"
            tags={tagList}
            onChange={(tag) => {
              setSelectedTag(tag);
              setPage(1);
              queryTodoList(1, tag);
            }}
          />
        </ScrollView>
        {/* 汇总栏 */}
        <View style={styles.totalInfo}>
          <Text>共 {total} 项任务</Text>
          <Text>已完成 {completedTotal} 项</Text>
        </View>
      </View>

      {/* 主体区域 */}
      <View style={styles.pageBody}>
        <FlatList
          refreshing={false}
          data={taskData}
          keyExtractor={(item) => item.id!}
          ListHeaderComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item, index, separators }) => (
            <TouchableHighlight
              key={item.id}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <TaskItem
                task={item}
                onCompletedChange={(completed) =>
                  handleCompletedChange(item.id!, completed)
                }
                onPress={() => {
                  setSelectedTask(item);
                  setModalVisible(true);
                }}
              />
            </TouchableHighlight>
          )}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Feather name="calendar" size={48} color="#d1d5dc" />
              <Text style={{ fontSize: 16, color: "#6a7282", marginTop: 8 }}>
                暂无任务
              </Text>
            </View>
          }
          onRefresh={() => {
            refreshTodoList();
          }}
          onEndReached={async () => {
            if (hasMore) {
              const newPage = page + 1;
              await queryTodoList(newPage, undefined, true);
              setPage(newPage);
            }
          }}
        />
      </View>

      {/* 更多操作弹窗 */}
      <Modal
        popup
        maskClosable
        visible={modalVisible}
        animationType="slide-up"
        onClose={() => setModalVisible(false)}
        style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
      >
        <View>
          <TaskItem
            task={selectedTask!}
            style={{
              marginHorizontal: 0,
              borderRadius: 0,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              marginBottom: 0,
            }}
          />

          <View
            style={{
              height: "100%",
              flexDirection: "row",
              marginTop: 15,
              paddingHorizontal: 8,
              gap: 4,
            }}
          >
            <IconButton
              label="编辑"
              icon={<Feather name="edit-3" size={20} color="#6a7282" />}
              onPress={() => {
                router.navigate(`/newTodo?id=${selectedTask?.id}`);
                setModalVisible(false);
              }}
            />
            <IconButton
              label="删除"
              icon={<Feather name="trash-2" size={20} color="#6a7282" />}
              onPress={() => {
                Modal.alert("删除任务", "您确定要永久删除此任务吗？", [
                  {
                    text: "取消",
                    style: "cancel",
                  },
                  { text: "确定", onPress: () => handleDelete() },
                ]);
              }}
            />
          </View>
        </View>
        <View style={{ height: 40 }}></View>
      </Modal>
    </View>
  );
};

export default Todos;
