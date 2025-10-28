import Feather from "@expo/vector-icons/Feather";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import * as Haptics from "expo-haptics";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import IconView from "../IconView";
import { IconsArray } from "./IconConstants";

export interface IconProp {
  name: string;
  family: string;
  value: unknown;
}

interface IconPickerProps {
  onSelect?: (icon: IconProp) => void;
}

const IconPicker = forwardRef<BottomSheet, IconPickerProps>((props, ref) => {
  const { onSelect } = props || {};
  const [searchVal, setSearchVal] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const snapPoints = useMemo(() => ["50%"], []);

  const iconList = useMemo(() => {
    return IconsArray.filter((item) =>
      item.name.toLowerCase().includes(searchVal.toLowerCase())
    );
  }, [searchVal]);

  const handleIconSelect = (item: IconProp) => {
    setSelectedIcon(`${item.family}::${item.name}`);
    onSelect?.(item);
    // 手机震动
    Haptics.selectionAsync();
  };

  const renderItem = useCallback(
    ({ item }: { item: IconProp }) => {
      return (
        <Pressable onPress={() => handleIconSelect(item)}>
          <View
            style={[
              styles.iconItem,
              selectedIcon === `${item.family}::${item.name}`
                ? { backgroundColor: "#d0e8ff" }
                : {},
            ]}
          >
            <IconView
              name={`${item.family}::${item.name}`}
              size={24}
              color="#333"
            />
          </View>
        </Pressable>
      );
    },
    [selectedIcon]
  );

  return (
    <BottomSheet
      ref={ref}
      index={-1} // 设置默认隐藏
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          accessible={Platform.OS === "ios"} // 如果没有这个，iOS 系统上背景后面的内容可能会被点击（Android 系统没问题）
          importantForAccessibility="no" // 防止屏幕阅读器读取底部弹窗后面的内容
          disappearsOnIndex={-1} // 默认隐藏
          appearsOnIndex={0} // 显示时的索引
          opacity={0.5}
          {...props}
        />
      )}
      style={styles.iconPickerContainer}
    >
      <BottomSheetTextInput
        style={styles.searchInput}
        onChangeText={setSearchVal}
        value={searchVal}
        placeholder="搜索图标"
        allowFontScaling={true}
      />

      <BottomSheetFlatList
        data={iconList}
        numColumns={6}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={renderItem}
        keyExtractor={(item: IconProp) => `${item.family}::${item.name}`}
        ListFooterComponent={<View style={{ height: 40 }} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Feather name="x-circle" size={48} color="#d1d5dc" />
            <Text style={{ fontSize: 16, color: "#6a7282", marginTop: 8 }}>
              暂无数据
            </Text>
          </View>
        }
      />
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  iconPickerContainer: {
    flex: 1,
    padding: 16,
    // 阴影
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  columnWrapper: {
    width: "100%",
    marginBottom: 12,
    gap: 12,
  },
  iconItem: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

IconPicker.displayName = "IconPicker";

export default IconPicker;
