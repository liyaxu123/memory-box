import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ITag } from "@/types/taskTypes";
import { useEffect, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ViewStyle,
} from "react-native";

interface TagProps {
  text: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

interface TagGroupProps {
  tags: ITag[];
  defaultKey?: string;
  afterSlot?: React.ReactNode;
  onChange?: (tag: ITag) => void;
}

export const Tag: React.FC<TagProps> = ({ text, style, color, onPress }) => {
  return (
    <TouchableHighlight style={{ borderRadius: 8 }} onPress={onPress}>
      <View style={[styles.tag, style]}>
        <Text style={{ color }}>{text}</Text>
      </View>
    </TouchableHighlight>
  );
};

export const Group: React.FC<TagGroupProps> = ({
  tags,
  defaultKey,
  afterSlot,
  onChange,
}) => {
  const colorScheme = useColorScheme();
  const [activeKey, setActiveKey] = useState(defaultKey);
  const handleTagPress = (tag: ITag) => {
    setActiveKey(tag?.key);
    onChange?.(tag);
  };

  useEffect(() => {
    setActiveKey(defaultKey);
  }, [defaultKey]);

  return (
    <View style={styles.tagsGroup}>
      {tags.map((tag) => (
        <Tag
          key={tag?.key}
          text={tag?.value}
          onPress={() => handleTagPress(tag)}
          style={{
            backgroundColor:
              activeKey === tag?.key
                ? Colors[colorScheme ?? "light"].primaryColor
                : "transparent",
          }}
          color={
            activeKey === tag?.key
              ? Colors[colorScheme ?? "light"].tagColor
              : "#687076"
          }
        />
      ))}
      {afterSlot}
    </View>
  );
};

export default {
  Tag,
  Group,
};

const styles = StyleSheet.create({
  tagsGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#ebe6e7",
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
