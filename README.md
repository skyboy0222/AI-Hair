# AI 焕发 - 智能发型设计

基于 Gemini 2.5 Flash Image 的智能发型设计平台。用户可以上传照片，一键生成最适合的发型，或通过文字描述进行深度定制。

## 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **设置环境变量**
   在项目根目录创建 `.env` 文件（或直接在命令行设置）：
   ```env
   API_KEY=你的_GEMINI_API_KEY
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## Vercel 部署指南

本项目可以轻松部署到 Vercel。请按照以下步骤配置 API Key，否则应用将无法正常运行。

### 1. 导入项目
将代码推送到 GitHub，然后在 Vercel 中导入该仓库。

### 2. 配置环境变量 (Environment Variables)
在部署配置页面（或部署后的 Settings -> Environment Variables 页面），必须添加以下变量：

*   **Key**: `API_KEY`
*   **Value**: 你的 Google Gemini API Key
    *   *你可以从 [Google AI Studio](https://aistudiocdn.google.com/) 获取免费的 API Key。*

> **注意**: 添加变量后，如果你已经部署过一次，需要重新部署 (Redeploy) 才能生效。

### 3. 常见问题排查

**报错: "An API Key must be set when running in a browser"**
*   **原因**: Vercel 中未设置 `API_KEY` 环境变量，或者设置后未重新构建。
*   **解决**: 
    1. 进入 Vercel 控制台 -> Project Settings -> Environment Variables。
    2. 确保存在名为 `API_KEY` 的变量。
    3. 进入 Deployments 选项卡，点击最新的部署右侧的三个点，选择 **Redeploy**。

**页面白屏**
*   **原因**: 环境变量未正确注入。
*   **解决**: 确保 `vite.config.ts` 中包含了 `define: { 'process.env': ... }` 的配置（本项目已包含此修复）。

## 技术栈

*   React 19
*   Vite
*   Tailwind CSS
*   Google GenAI SDK (Gemini 2.5 Flash Image)
*   Lucide React Icons
