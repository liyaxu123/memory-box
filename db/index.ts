import { type SQLiteDatabase } from "expo-sqlite";

// 创建tags数据表的SQL语句
const createTagsTableSql = `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS tags (
    key INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
  );`;

// 创建todos数据表的SQL语句
const createTodosTableSql = `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
    dueDate DATETIME,
    priority INTEGER DEFAULT 3,
    tagKey INTEGER,
    FOREIGN KEY (tagKey) REFERENCES tags(key)
  );`;

// 数据库迁移
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // 创建 tags 数据表
  await db.execAsync(createTagsTableSql);
  // 创建 todos 数据表
  await db.execAsync(createTodosTableSql);

  alert(`migrateDbIfNeeded执行了，数据库初始化完成`);

  // // 数据库版本
  // const DATABASE_VERSION = 1;
  // // 获取当前数据库版本
  // let { user_version: currentDbVersion } = await db.getFirstAsync<{
  //   user_version: number;
  // }>("PRAGMA user_version");
  // alert(`migrateDbIfNeeded执行了，数据库版本：${currentDbVersion}`);
  // // 数据库版本一致，不需要迁移
  // if (currentDbVersion >= DATABASE_VERSION) {
  //   return;
  // }
  // // 数据库版本为0，创建数据表
  // if (currentDbVersion === 0) {
  //   // 创建 tags 数据表
  //   await db.execAsync(createTagsTableSql);
  //   // 创建 todos 数据表
  //   await db.execAsync(createTodosTableSql);
  //   // 更新数据库版本
  //   currentDbVersion = 1;
  // }
  // // 更新数据库版本
  // await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
