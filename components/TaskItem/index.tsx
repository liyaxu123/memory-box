import { Tag } from "@/components/Tags";
import { Colors, FontSize } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ITaskItem, PriorityEnum, PriorityMap } from "@/types/taskTypes";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import IsDisplay from "../IsDisplay";

interface TaskItemProps {
  task: ITaskItem;
  // 切换完成状态
  onCompletedChange?: (value: boolean) => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

// 优先级颜色
const priorityColor = {
  [PriorityEnum.High]: "#fb2c36",
  [PriorityEnum.Medium]: "#f0b100",
  [PriorityEnum.Low]: "#00c951",
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onCompletedChange,
  onPress,
  style,
}) => {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    taskItem: {
      flexDirection: "row",
      gap: 12,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      padding: 14,
      marginBottom: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? "light"].borderColor,
      marginHorizontal: 16,
    },
    checkbox: {
      paddingTop: 2,
    },
    taskInfo: {
      flex: 1,
    },
    taskTitleWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 8,
    },
    taskTitle: {
      flex: 1,
      fontSize: FontSize.sm,
      color: Colors[colorScheme ?? "light"].text,
    },
    completedTitle: {
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
      color: "#6a7282",
    },
    priority: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: Colors[colorScheme ?? "light"].tint,
    },
    descriptionContainer: {
      marginTop: 8,
    },
    description: {
      fontSize: FontSize.xs2,
      color: "#4a5565",
    },
    tagDateContainer: {
      flexDirection: "row",
      gap: 8,
      marginTop: 8,
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: "#ebe6e7",
      borderRadius: 8,
    },
  });

  return (
    <View style={[styles.taskItem, style]}>
      <View style={styles.checkbox}>
        <Pressable onPress={() => onCompletedChange?.(!task?.completed)}>
          {task?.completed ? (
            <Feather name="check-circle" size={20} color="#00c951" />
          ) : (
            <Feather name="circle" size={20} color="#99a1af" />
          )}
        </Pressable>
      </View>

      <View style={styles.taskInfo}>
        <Pressable onPress={onPress}>
          <View style={styles.taskTitleWrapper}>
            {/* 标题 */}
            <Text
              style={[
                styles.taskTitle,
                task?.completed && styles.completedTitle,
              ]}
            >
              {task?.title}
            </Text>
            {/* 优先级 */}
            <View style={styles.priority}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: priorityColor[task?.priority] },
                ]}
              ></View>
              <Text style={{ color: "#6a7282", fontSize: FontSize.xs }}>
                {PriorityMap[task?.priority]}
              </Text>
            </View>
          </View>

          {/* 描述 */}
          <IsDisplay display={!!task?.description}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{task?.description}</Text>
            </View>
          </IsDisplay>

          {/* 标签，日期 */}
          <View style={styles.tagDateContainer}>
            <Tag
              text={task?.tag?.value || ""}
              style={{ backgroundColor: "#f2edee" }}
            />
            {/* 日期 */}
            <IsDisplay display={!!task?.dueDate}>
              <View style={styles.dateContainer}>
                <Feather name="calendar" size={12} color="#0a0a0a" />
                <Text style={{ color: "#0a0a0a", fontSize: FontSize.xs }}>
                  {dayjs(task?.dueDate).format("YYYY-MM-DD")}
                </Text>
              </View>
            </IsDisplay>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default TaskItem;
