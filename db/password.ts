import { IPasswordItem } from "@/types/passwordTypes";
import { ITag } from "@/types/taskTypes";
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

  // 根据id查询密码并关联查询标签信息
  const getPasswordById = async (id: string) => {
    try {
      // 关联查询密码和标签的完整信息
      const result = await db.getFirstAsync<
        IPasswordItem & {
          tagKey: number;
          tagValue: string;
          tagCreatedAt: string;
          tagUpdatedAt: string;
        }
      >(
        `SELECT 
          t.*,
          tg.key as tagKey,
          tg.value as tagValue,
          tg.created_at as tagCreatedAt,
          tg.updated_at as tagUpdatedAt
         FROM passwords t 
         LEFT JOIN password_tags tg ON t.tagKey = tg.key 
         WHERE t.id = ?`,
        [id]
      );

      if (!result) {
        return null;
      }

      // 格式化返回数据，添加完整的标签信息
      const formattedData = {
        ...result,
        tag: {
          key: result.tagKey,
          value: result.tagValue,
          created_at: result.tagCreatedAt,
          updated_at: result.tagUpdatedAt,
        },
      };

      return formattedData as unknown as IPasswordItem & { tag: ITag };
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

  // 根据 id 更新密码项
  const updatePasswordById = async (id: string, data: IPasswordItem) => {
    try {
      const res = await db.runAsync(
        `UPDATE passwords SET name = ?, username = ?, password = ?, icon = ?, website = ?, notes = ?, tagKey = ? WHERE id = ?`,
        [
          data.name,
          data.username,
          data.password,
          data.icon,
          data.website || "",
          data.notes || "",
          data.tag.key,
          id,
        ]
      );
      return res;
    } catch (err) {
      throw err;
    }
  };

  // 获取所有的密码项
  const getAllPasswords = async () => {
    try {
      const res = await db.getAllAsync<IPasswordItem>(
        `SELECT * FROM passwords`
      );
      return res;
    } catch (err) {
      throw err;
    }
  };

  // 获取密码本的总条数
  const getPasswordCount = async () => {
    try {
      const res = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM passwords`
      );
      return res?.count || 0;
    } catch (err) {
      throw err;
    }
  };

  return {
    createPassword,
    getPasswords,
    getPasswordById,
    deletePasswordById,
    getAllPasswords,
    getPasswordCount,
    updatePasswordById,
  };
};

export default usePasswordDB;
