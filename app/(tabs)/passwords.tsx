import PasswordItem from "@/components/PasswordItem";
import Tags from "@/components/Tags";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Feather from "@expo/vector-icons/Feather";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import usePasswordTagsDB from "@/db/password_tags";
import { ITag } from "@/types/taskTypes";
import { useEffect, useState } from "react";
import { IPasswordItem } from "@/types/passwordTypes";

const allTag: ITag = {
  key: "all",
  value: "全部",
  created_at: "",
  updated_at: "",
};

const Passwords = () => {
  const colorScheme = useColorScheme();
  const { getAllTags } = usePasswordTagsDB();
  const [tagList, setTagList] = useState<ITag[]>([]); // 标签列表
  const [passwordsData, setPasswordsData] = useState<IPasswordItem[]>([]); // 密码列表
  const [selectedTag, setSelectedTag] = useState<ITag>(allTag); // 当前选中的标签
  const [page, setPage] = useState(1); // 当前页码
  const [total, setTotal] = useState(0); // 总数
  const [hasMore, setHasMore] = useState(false); // 是否有更多数据

  const queryTagList = async () => {
    const tagList = await getAllTags();
    console.log("标签列表：", tagList);
    setTagList(() => {
      const list = tagList || [];
      list.unshift(allTag);
      return list;
    });
  };

  useEffect(() => {
    console.log("触发页面初始化~~");
    queryTagList();
  }, []);

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

  return (
    <>
      <View style={styles.container}>
        {/* 头部搜索区域 */}
        <View style={styles.pageHeader}>
          {/* 搜索栏 */}
          <TouchableHighlight>
            <View style={styles.searchBar}>
              <Feather name="search" size={16} color="#99a1af" />
              <Text style={{ color: "#99a1af" }}>搜索密码...</Text>
            </View>
          </TouchableHighlight>
          {/* 标签分类 */}
          <View>
            <Tags.Group
              defaultKey="all"
              tags={tagList}
              onChange={(tag) => {
                console.log("选中了标签：", tag);
                setSelectedTag(tag);
              }}
            />
          </View>
          {/* 汇总栏 */}
          <View style={styles.totalInfo}>
            <Text>共 4 个密码</Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Feather name="shield" size={14} color="black" />
              <Text>安全加密</Text>
            </View>
          </View>
        </View>

        {/* 主体区域 */}
        <View style={styles.pageBody}>
          <FlatList
            refreshing={false}
            data={passwordsData}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => <View style={{ height: 16 }} />}
            renderItem={({ item, index, separators }) => (
              <TouchableHighlight
                key={item.id}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
              >
                <PasswordItem passData={item} />
              </TouchableHighlight>
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 60 }}>
                <Feather name="lock" size={48} color="#d1d5dc" />
                <Text style={{ fontSize: 16, color: "#6a7282", marginTop: 8 }}>
                  暂无密码记录
                </Text>
              </View>
            }
            onRefresh={() => {
              console.log("刷新了~~");
            }}
            onEndReached={() => {
              console.log("触底了~~");
            }}
          />
        </View>
      </View>
    </>
  );
};

export default Passwords;
