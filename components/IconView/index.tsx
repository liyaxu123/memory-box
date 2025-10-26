import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";

type IconObjTypes = {
  [key: string]:
    | typeof AntDesign
    | typeof Entypo
    | typeof EvilIcons
    | typeof Feather
    | typeof FontAwesome
    | typeof FontAwesome5
    | typeof FontAwesome6
    | typeof Fontisto
    | typeof Foundation
    | typeof Ionicons
    | typeof MaterialCommunityIcons
    | typeof MaterialIcons
    | typeof Octicons
    | typeof SimpleLineIcons
    | typeof Zocial;
};

export const IconObj: IconObjTypes = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};

interface IconViewProps {
  // name 图标名称，必须是 iconSet::iconName 形式
  name?: string;
  size?: number;
  color?: string;
}

const IconView: React.FC<IconViewProps> = ({ name, size, color }) => {
  const iconSet = name?.split("::")[0];
  const iconName = name?.split("::")[1];

  const IconBoxComponent = IconObj[iconSet || "FontAwesome"];

  return (
    <IconBoxComponent
      name={iconName}
      size={size || 16}
      color={color || "#fff"}
    />
  );
};

export default IconView;
