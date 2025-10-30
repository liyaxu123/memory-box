import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";

/**
 * 通用的本地认证方法
 *
 * @param {Object} options - 认证选项
 * @param {string} options.promptMessage - 认证时显示的提示消息
 * @param {string} options.fallbackLabel - 认证失败时显示的标签
 *
 * @returns {Promise<boolean>} - 返回认证结果，true为成功，false为失败
 */
export const authenticate = async ({
  promptMessage = "请进行认证",
  fallbackLabel = "使用密码登录",
}) => {
  try {
    // 检查设备是否支持生物识别认证
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert("该设备不支持生物识别认证");
      return false;
    }

    // 检查是否配置了任何生物识别方式（如指纹或面部识别）
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      Alert.alert("未配置生物识别认证");
      return false;
    }

    // 执行认证
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      fallbackLabel,
    });

    if (result.success) {
      return true;
    } else {
      Alert.alert("认证失败");
      return false;
    }
  } catch (error: any) {
    Alert.alert("认证出错", error.message);
    return false;
  }
};
