import { ITaskItem } from "@/types/taskTypes";
import { useSQLiteContext } from "expo-sqlite";

const useTodosDB = () => {
  const db = useSQLiteContext();
  const addTodo = async (todo: ITaskItem) => {
    try {
      // 当你想要执行一些写入操作时，`runAsync()` 很有用。
      const res = await db.runAsync(
        `INSERT INTO todos (title, description, completed, dueDate, priority, tagKey) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          todo.title,
          todo.description || "",
          todo.completed,
          todo.dueDate || null,
          todo.priority,
          todo.tag.key,
        ]
      );
      console.log("addTodo:", res);
      return res;
    } catch (err) {
      throw err;
    }
  };

  const getTodos = async (params: {
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
      const todos = await db.getAllAsync<
        ITaskItem & { tag: { key: number; value: string } }
      >(
        `SELECT t.*, tg.value as tagValue FROM todos t 
       LEFT JOIN tags tg ON t.tagKey = tg.key 
       ${whereClause} 
       ORDER BY t.created_at DESC 
       LIMIT ? OFFSET ?`,
        [...queryParams, pageSize, offset]
      );

      // 查询总数
      const totalResult = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM todos t 
       LEFT JOIN tags tg ON t.tagKey = tg.key 
       ${whereClause}`,
        queryParams
      );
      const total = totalResult?.count || 0;

      // 查询已完成总数
      const completedQuery = whereClause
        ? `SELECT COUNT(*) as count FROM todos t 
         LEFT JOIN tags tg ON t.tagKey = tg.key 
         ${whereClause} AND t.completed = 1`
        : `SELECT COUNT(*) as count FROM todos t 
         LEFT JOIN tags tg ON t.tagKey = tg.key 
         WHERE t.completed = 1`;

      const completedResult = await db.getFirstAsync<{ count: number }>(
        completedQuery,
        queryParams
      );
      const completedTotal = completedResult?.count || 0;

      // 处理返回数据，将标签信息格式化为正确的结构
      const formattedTodos = todos.map((todo) => ({
        ...todo,
        tag: {
          key: (todo as any).tagKey,
          value: (todo as any).tagValue,
        },
      }));

      return {
        todos: formattedTodos,
        total,
        completedTotal,
        page,
        pageSize,
        hasMore: page * pageSize < total,
      };
    } catch (err) {
      throw err;
    }
  };

  const getAllTodos = async () => {
    try {
      const res = await db.getAllAsync(`SELECT * FROM todos`);
      console.log("getAllTodos:", res);
      return res;
    } catch (err) {
      throw err;
    }
  };

  // 切换完成状态
  const toggleCompletedById = async (id: string, completed: boolean) => {
    try {
      const res = await db.runAsync(
        `UPDATE todos SET completed = ? WHERE id = ?`,
        [completed, id]
      );
      return res;
    } catch (err) {
      throw err;
    }
  };

  // 根据id 删除任务
  const deleteTodoById = async (id: string) => {
    try {
      const res = await db.runAsync(`DELETE FROM todos WHERE id = ?`, [id]);
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    addTodo,
    getTodos,
    getAllTodos,
    toggleCompletedById,
    deleteTodoById,
  };
};

export default useTodosDB;
