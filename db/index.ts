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

// 创建password_tags数据表的SQL语句
const createPasswordTagsTableSql = `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS password_tags (
    key INTEGER PRIMARY KEY AUTOINCREMENT,
    value TEXT NOT NULL,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime'))
  );`;

// 创建password数据表的SQL语句
const createPasswordsTableSql = `
  PRAGMA journal_mode = 'wal';
  CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    website TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT (datetime('now', 'localtime')),
    updated_at DATETIME DEFAULT (datetime('now', 'localtime')),
    lastUsed DATETIME,
    tagKey INTEGER,
    FOREIGN KEY (tagKey) REFERENCES password_tags(key)
  );`;

// 数据库迁移
export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  // 创建 tags 数据表
  await db.execAsync(createTagsTableSql);
  // 创建 todos 数据表
  await db.execAsync(createTodosTableSql);
  // 创建 password_tags 数据表
  await db.execAsync(createPasswordTagsTableSql);
  // 创建 passwords 数据表
  await db.execAsync(createPasswordsTableSql);

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
