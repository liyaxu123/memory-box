export interface ITag {
  key: string;
  value: string;
}

export interface IPasswordItem {
  id?: string;
  name: string; // 名称
  icon: string; // 图标
  username: string; // 用户名
  password: string; // 密码
  website?: string; // 网站
  notes?: string; // 备注
  created_at?: string; // 创建时间
  lastUsed?: string; // 最后使用时间
  tag: ITag; // 标签
}
