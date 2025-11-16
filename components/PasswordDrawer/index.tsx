import Modal from "@ant-design/react-native/lib/modal";
import { Feather } from "@expo/vector-icons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { forwardRef, useMemo, useImperativeHandle } from "react";
import { Platform, StyleSheet, View } from "react-native";
import IconButton from "../IconButton";

interface PasswordDrawerProps {
  onDelete?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
}

const PasswordDrawer = forwardRef<BottomSheet, PasswordDrawerProps>(
  (props, ref) => {
    const { onDelete, onEdit, onShare } = props;
    const snapPoints = useMemo(() => ["20%"], []);

    return (
      <>
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
          <View
            style={{
              height: "100%",
              flexDirection: "row",
              marginTop: 15,
              gap: 4,
            }}
          >
            <IconButton
              label="编辑"
              icon={<Feather name="edit-3" size={20} color="#6a7282" />}
              onPress={onEdit}
            />
            <IconButton
              label="删除"
              icon={<Feather name="trash-2" size={20} color="#6a7282" />}
              onPress={() => {
                Modal.alert("删除密码", "您确定要永久删除此密码吗？", [
                  {
                    text: "取消",
                    style: "cancel",
                  },
                  { text: "确定", onPress: onDelete },
                ]);
              }}
            />
          </View>
        </BottomSheet>
      </>
    );
  }
);

export default PasswordDrawer;
PasswordDrawer.displayName = "PasswordDrawer";

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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
