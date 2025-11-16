import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

// 导出数据
export async function exportData(data: any) {
  try {
    const json = JSON.stringify(data, null, 2);
    const file = new File(Paths.document, "passwords_backup.json"); // 创建文件对象
    console.log("文件保存在：", file.uri);
    if (file.exists) {
      file.delete(); // 如果文件已存在，先删除
    }
    file.create(); // 创建文件
    file.write(json); // 写入内容

    // 分享文件
    const fileUri = file.uri;
    await Sharing.shareAsync(fileUri, {
      mimeType: "application/json",
      dialogTitle: "分享密码备份文件",
      UTI: "public.json",
    });
  } catch (error) {
    console.error("导出失败:", error);
  }
}

// 导入数据
export async function importData() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return [];
    const fileUri = result.assets[0].uri;
    const file = new File(fileUri);
    return JSON.parse(file.textSync() || "");
  } catch (error) {
    console.error("导入失败:", error);
    return [];
  }
}
