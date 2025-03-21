# MyFlomo Client

一个基于 React + TypeScript 开发的 仿Flomo 纯网页客户端软件，提供简洁优雅的笔记记录体验。

## 功能特点

### 笔记输入
- 支持多行文本输入
- 支持快捷键提交（Enter）
- 支持 Shift + Enter 换行
- 支持中文输入法组合键

### 标签系统
- 智能标签提示
  - 支持 "#" 触发标签建议
  - 支持标签按钮快速插入
  - 支持模糊搜索（任意位置匹配）
  - 智能排序（优先显示匹配开头的标签）
- 标签自动保存
  - 使用 LocalStorage 持久化存储
  - 自动去重
  - 支持提取新标签

### 多媒体支持
- 图片上传
  - 支持拖拽上传
  - 支持大小限制（5MB）
  - 自动生成预览
  - 本地存储，无需服务器
- 表情选择器
  - 提供常用表情
  - 网格布局展示
  - 快速插入

### 数据管理
- 数据导入导出
  - 支持完整数据备份（笔记、标签、图片）
  - JSON 格式导出，方便迁移
  - 支持数据恢复，自动覆盖现有数据
  - 导出文件包含时间戳
- 本地存储
  - 使用 LocalStorage 持久化存储
  - 自动保存所有更改
  - 支持离线使用

### 界面优化
- 响应式布局
  - 自适应桌面和移动设备
  - 小屏幕优化显示核心功能
  - 大屏幕显示完整功能
- 搜索与排序
  - 实时搜索笔记内容和标签
  - 多种排序方式（创建时间、更新时间）
  - 支持正序和倒序排列

## 技术栈

- React 18
- TypeScript
- TailwindCSS
- LocalStorage API

## 开发说明

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

### 构建

```bash
npm run build
# 或
yarn build
```

## 项目结构

```
├── public/             # 静态资源目录
├── src/               # 源代码目录
│   ├── assets/        # 资源文件（图片等）
│   ├── components/    # 组件目录
│   │   ├── Heatmap.tsx    # 热力图组件
│   │   ├── NoteInput.tsx  # 笔记输入组件
│   │   ├── NoteCard.tsx   # 笔记卡片组件
│   │   ├── Stats.tsx      # 统计组件
│   │   ├── TagCloud.tsx   # 标签云组件
│   │   ├── NotesHeader.tsx # 笔记列表头部组件
│   │   ├── SearchBar.tsx   # 搜索组件
│   │   ├── SortMenu.tsx    # 排序菜单组件
│   │   ├── DataSync.tsx    # 数据同步组件
│   │   ├── LocalImage.tsx  # 本地图片组件
│   │   └── icons/         # 图标组件
│   │       ├── index.ts   # 图标导出
│   │       ├── SendIcon.tsx     # 发送图标
│   │       ├── EditIcon.tsx     # 编辑图标
│   │       ├── DeleteIcon.tsx   # 删除图标
│   │       ├── TagIcon.tsx      # 标签图标
│   │       ├── SaveIcon.tsx     # 保存图标
│   │       ├── CancelIcon.tsx   # 取消图标
│   │       ├── ClockIcon.tsx    # 时钟图标
│   │       ├── ShieldIcon.tsx   # 盾牌图标
│   │       └── DocumentIcon.tsx # 文档图标
│   ├── types/        # TypeScript 类型定义
│   │   └── note.ts   # 笔记类型定义
│   ├── utils/        # 工具函数
│   │   └── noteUtils.ts # 笔记相关工具函数
│   ├── App.tsx       # 根组件
│   ├── main.tsx      # 入口文件
│   ├── index.css     # 全局样式
│   └── App.css       # App 组件样式
├── index.html         # HTML 模板
├── tailwind.config.js # Tailwind 配置
├── postcss.config.js  # PostCSS 配置
├── vite.config.ts     # Vite 配置
├── tsconfig.json      # TypeScript 配置
├── package.json       # 项目依赖配置
└── README.md         # 项目说明文档
```

## 使用说明

### 笔记输入
- 直接在输入框中输入文字
- 按 Enter 发送，Shift + Enter 换行
- 输入框自动调整高度

### 标签使用
- 输入 "#" 触发标签建议
- 点击标签图标插入 "#"
- 输入文字实时过滤标签
- 点击建议项插入标签

### 图片上传
- 点击图片按钮选择图片
- 支持图片预览
- 自动插入 Markdown 格式

### 表情使用
- 点击表情按钮打开选择器
- 点击表情直接插入
- 自动定位光标到表情后

### 数据导入导出
- 点击右上角导出按钮备份数据
- 导出文件包含所有笔记和图片
- 选择备份文件进行导入
- 导入时会覆盖现有数据

### 响应式布局
- 大屏幕（>1024px）
  - 显示完整界面
  - 左侧显示统计、热力图、标签云
  - 右侧显示笔记列表
- 小屏幕（≤1024px）
  - 隐藏左侧统计面板
  - 专注显示笔记内容
  - 优化触摸操作体验

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License - 详见 LICENSE 文件
