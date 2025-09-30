export interface ITag {
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// 优先级枚举
export enum PriorityEnum {
  Low = 1, // 低
  Medium = 2, // 中等
  High = 3, // 高
}

export const PriorityMap = {
  [PriorityEnum.Low]: "低",
  [PriorityEnum.Medium]: "中",
  [PriorityEnum.High]: "高",
};

export interface ITaskItem {
  id?: string;
  title: string; // 标题
  description?: string; // 描述
  completed: boolean; // 是否已完成
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  priority: PriorityEnum; // 优先级
  tag: ITag; // 标签
  completedAt?: string | null; // 完成时间
  deletedAt?: string | null; // 删除时间
  archivedAt?: string | null; // 归档时间
  reminder?: string | null; // 提醒时间
  dueDate?: string | null; // 截止时间
}
