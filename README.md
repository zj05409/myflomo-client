# MyFlomo

<div align="center">
  <img src="./public/logo.svg" alt="MyFlomo Logo" width="120" />
  <h1>MyFlomo</h1>
  <p>思想的数字花园</p>
</div>

MyFlomo 是一个基于 React + TypeScript 开发的仿 Flomo 客户端软件，提供简洁优雅的笔记记录体验。灵感来源于 flomo.app，支持 Web 端和桌面端（Windows、macOS），无需服务器，支持离线使用。

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

## 使用方式

### Web 版（本地运行）
1. 克隆项目
```bash
git clone https://github.com/yourusername/myflomo-client.git
cd myflomo-client
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在浏览器中访问 `http://localhost:5173`

### 桌面版（本地运行）

#### macOS
1. 克隆项目
```bash
git clone https://github.com/yourusername/myflomo-client.git
cd myflomo-client
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在另一个终端中启动 Electron 应用
```bash
npm run electron:dev
```

#### Windows
1. 克隆项目
```bash
git clone https://github.com/yourusername/myflomo-client.git
cd myflomo-client
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 在另一个终端中启动 Electron 应用
```bash
npm run electron:dev
```

### 构建桌面应用

#### 开发环境预览
```bash
npm run electron:preview
```

#### 打包应用
```bash
npm run electron:build
```

打包后的应用将在 `release` 目录下生成：
- macOS: `release/mac/MyFlomo.app`
- Windows: `release/win-unpacked/MyFlomo.exe`

## 开发环境要求

- Node.js >= 18
- npm >= 9

## 项目结构

```
myflomo-client/
├── electron/           # Electron 主进程和预加载脚本
│   ├── main.cjs       # 主进程
│   └── preload.cjs    # 预加载脚本
├── src/               # 源代码
│   ├── components/    # React 组件
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
│   ├── types/        # TypeScript 类型定义
│   └── utils/        # 工具函数
├── public/           # 静态资源
├── dist/            # 构建输出目录
└── release/         # 打包输出目录
```

## 技术栈

- Electron
- React
- TypeScript
- Vite
- TailwindCSS
- date-fns

## 开发指南

### 添加新功能

1. 在 `src/components` 中创建新的组件
2. 在 `src/types` 中添加必要的类型定义
3. 在 `src/utils` 中添加工具函数
4. 在 `electron` 目录下添加必要的 Electron 功能

### 样式指南

- 使用 TailwindCSS 进行样式开发
- 遵循移动优先的响应式设计原则
- 保持一致的间距和颜色方案

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
