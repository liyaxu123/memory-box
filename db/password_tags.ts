import { ITag } from "@/types/taskTypes";
import { useSQLiteContext } from "expo-sqlite";

const usePasswordTagsDB = () => {
  const db = useSQLiteContext();

  // 创建标签
  const createTag = async (tagName: string) => {
    try {
      const res = await db.runAsync(
        `INSERT INTO password_tags (value) VALUES (?)`,
        tagName
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  // 获取所有标签
  const getAllTags = async () => {
    try {
      // `getAllAsync()` 在你希望将所有结果获取为对象数组时非常有用。
      const res = (await db.getAllAsync(
        `SELECT * FROM password_tags`
      )) as ITag[];
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  // 插入标签
  const insertTag = async (tag: ITag) => {
    try {
      const res = await db.runAsync(
        `INSERT INTO password_tags (key, value, created_at, updated_at) VALUES (?, ?, ?, ?)`,
        tag.key,
        tag.value,
        tag.created_at,
        tag.updated_at
      );
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    createTag,
    getAllTags,
    insertTag,
  };
};

export default usePasswordTagsDB;
