import PasswordItem from "@/components/PasswordItem";
import Tags from "@/components/Tags";
import { passwordsData } from "@/constants/taskData";
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

const Passwords = () => {
  const colorScheme = useColorScheme();

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
              tags={[
                { key: "all", value: "全部" },
                { key: "work", value: "工作" },
                { key: "life", value: "生活" },
                { key: "health", value: "健康" },
                { key: "study", value: "学习" },
              ]}
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
