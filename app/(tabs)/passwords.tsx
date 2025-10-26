import PasswordItem from "@/components/PasswordItem";
import Tags from "@/components/Tags";
import { Colors } from "@/constants/theme";
import usePasswordDB from "@/db/password";
import usePasswordTagsDB from "@/db/password_tags";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IPasswordItem } from "@/types/passwordTypes";
import { ITag } from "@/types/taskTypes";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";

const allTag: ITag = {
  key: "all",
  value: "全部",
  created_at: "",
  updated_at: "",
};

const Passwords = () => {
  const colorScheme = useColorScheme();
  const { getAllTags } = usePasswordTagsDB();
  const { getPasswords } = usePasswordDB();
  const [tagList, setTagList] = useState<ITag[]>([]); // 标签列表
  const [passwordsData, setPasswordsData] = useState<IPasswordItem[]>([]); // 密码列表
  const [selectedTag, setSelectedTag] = useState<ITag>(allTag); // 当前选中的标签
  const [page, setPage] = useState(1); // 当前页码
  const [total, setTotal] = useState(0); // 总数
  const [hasMore, setHasMore] = useState(false); // 是否有更多数据

  const queryTagList = async () => {
    const tagList = await getAllTags();
    setTagList(() => {
      const list = tagList || [];
      list.unshift(allTag);
      return list;
    });
  };

  const queryPasswordList = async (
    page: number,
    tag?: ITag,
    append: boolean = false
  ) => {
    try {
      const actualTag = tag || selectedTag;
      const res = await getPasswords({
        page,
        pageSize: 10,
        tagKey: actualTag?.key === "all" ? undefined : actualTag?.key,
      });
      // console.log("列表数据：", res);
      const list = (res?.passwords || []) as IPasswordItem[];
      if (append) {
        // 追加模式：将新数据追加到现有数据后面
        setPasswordsData((prevData) => [...prevData, ...list]);
      } else {
        // 替换模式：直接替换现有数据（用于刷新或切换标签）
        setPasswordsData(list);
      }
      setTotal(res?.total || 0);
      setHasMore(res?.hasMore || false);
      return list;
    } catch (error) {
      console.log(error);
      setHasMore(false);
    }
  };

  const refreshTodoList = () => {
    setPasswordsData([]);
    setPage(1);
    setHasMore(false);
    init();
  };

  const init = () => {
    queryTagList();
    queryPasswordList(1);
  };

  useEffect(() => {
    init();
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
                setSelectedTag(tag);
                setPage(1);
                queryPasswordList(1, tag);
              }}
            />
          </View>
          {/* 汇总栏 */}
          <View style={styles.totalInfo}>
            <Text>共 {total} 个密码</Text>

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
            keyExtractor={(item) => item.id!}
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
              refreshTodoList();
            }}
            onEndReached={async () => {
              if (hasMore) {
                const newPage = page + 1;
                await queryPasswordList(newPage, undefined, true);
                setPage(newPage);
              }
            }}
          />
        </View>
      </View>
    </>
  );
};

export default Passwords;
