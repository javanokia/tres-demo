# tres-demo

基于 Vue 3 + TypeScript + Vite 的 3D 演示项目。

## 项目说明

这是一个使用 Vue 3、TypeScript 和 TresJS 构建的 3D 场景演示项目，包含多个实用的 3D 交互示例。

### 功能特点

- 🚀 使用 Vue 3 + TypeScript + Vite 构建
- 📦 基于 TresJS 快速开发 3D 场景
- 🎨 支持模型加载、纹理映射
- ✨ 自定义着色器效果
- 🖱️ 完整的鼠标事件处理
- 🌌 丰富的示例场景

### 示例清单

- 基础场景：TresJS 基础场景搭建
- 模型加载：3D 模型加载和控制
- 纹理映射：展示纹理加载和映射效果
- 着色器效果：自定义着色器效果展示
- 鼠标事件：3D场景中的鼠标事件处理
- 场景漫游：场景漫游和视角控制
- 银河生成器：可交互的3D银河系
- 数据中心：3D数据中心可视化
- 画廊漫游：虚拟画廊漫游体验

## 技术栈

- Vue 3 组合式 API
- TypeScript 类型支持
- Vite 构建工具
- TresJS 3D 渲染引擎
- GLSL 着色器

## 安装和运行

```bash
# 克隆项目
git clone https://github.com/javanokia/tres-demo.git

# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
tres-demo
├── src/
│   ├── components/     # 通用组件
│   ├── views/         # 页面视图
│   ├── shaders/       # 着色器文件
│   ├── models/        # 3D 模型
│   ├── textures/      # 纹理资源
│   └── utils/         # 工具函数
├── public/            # 静态资源
└── types/             # 类型定义
```

## 开发环境

推荐的 IDE 设置：
- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 贡献指南

1. Fork 该仓库
2. 创建新的功能分支
3. 提交你的更改
4. 发起 Pull Request

## 许可证

[MIT](LICENSE)
