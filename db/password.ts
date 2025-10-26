import { IPasswordItem } from "@/types/passwordTypes";
import { useSQLiteContext } from "expo-sqlite";

const usePasswordDB = () => {
  const db = useSQLiteContext();
  const createPassword = async (data: IPasswordItem) => {
    try {
      const res = await db.runAsync(
        `INSERT INTO passwords (name, username, password, icon, website, notes, tagKey) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.username,
          data.password,
          data.icon,
          data.website || "",
          data.notes || "",
          data.tag.key,
        ]
      );
      console.log("createPassword:", res);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const getPasswords = async (params: {
    page?: number;
    pageSize?: number;
    tagKey?: string;
    title?: string;
  }) => {
    try {
      const { page = 1, pageSize = 10, tagKey, title } = params;
      const offset = (page - 1) * pageSize;

      // 构建查询条件
      let whereClause = "";
      const queryParams: any[] = [];

      if (tagKey !== undefined) {
        whereClause += " AND t.tagKey = ?";
        queryParams.push(tagKey);
      }

      if (title) {
        whereClause += " AND t.title LIKE ?";
        queryParams.push(`%${title}%`);
      }

      // 移除开头的 ' AND '
      if (whereClause) {
        whereClause = " WHERE " + whereClause.substring(5);
      }

      // 查询当前页的数据，关联查询标签信息
      const passwords = await db.getAllAsync<
        IPasswordItem & { tag: { key: number; value: string } }
      >(
        `SELECT t.*, tg.value as tagValue FROM passwords t 
       LEFT JOIN password_tags tg ON t.tagKey = tg.key 
       ${whereClause} 
       ORDER BY t.created_at DESC 
       LIMIT ? OFFSET ?`,
        [...queryParams, pageSize, offset]
      );

      // 查询总数
      const totalResult = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM passwords t 
       LEFT JOIN password_tags tg ON t.tagKey = tg.key 
       ${whereClause}`,
        queryParams
      );
      const total = totalResult?.count || 0;

      // 处理返回数据，将标签信息格式化为正确的结构
      const formattedData = passwords.map((password) => ({
        ...password,
        tag: {
          key: (password as any).tagKey,
          value: (password as any).tagValue,
        },
      }));

      return {
        passwords: formattedData,
        total,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      };
    } catch (err) {
      throw err;
    }
  };

  // 根据id 删除任务
  const deletePasswordById = async (id: string) => {
    try {
      const res = await db.runAsync(`DELETE FROM passwords WHERE id = ?`, [id]);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    createPassword,
    getPasswords,
    deletePasswordById,
  };
};

export default usePasswordDB;
