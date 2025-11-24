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
   VITE_API_KEY=你的_GEMINI_API_KEY
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## Vercel 部署指南

本项目可以轻松部署到 Vercel。为了确保应用正常运行，请遵循以下变量命名规范。

### 1. 导入项目
将代码推送到 GitHub，然后在 Vercel 中导入该仓库。

### 2. 配置环境变量 (Environment Variables)
在部署配置页面（或部署后的 Settings -> Environment Variables 页面），添加以下变量：

*   **Key**: `VITE_API_KEY` (推荐) 或 `API_KEY`
*   **Value**: 你的 Google Gemini API Key
    *   *你可以从 [Google AI Studio](https://aistudiocdn.google.com/) 获取免费的 API Key。*

> **强烈建议**: 使用 `VITE_API_KEY` 作为变量名。Vite 会自动将其暴露给前端代码，无需额外构建配置。

> **注意**: 添加或修改变量后，必须**重新部署 (Redeploy)** 才能生效。
> 1. 进入 Deployments 选项卡。
> 2. 点击最新的部署右侧的三个点。
> 3. 选择 **Redeploy**。

### 3. 常见问题排查

**报错: "An API Key must be set when running in a browser"**
*   **原因**: Vercel 中环境变量未读取到。
*   **解决**: 
    1. 检查 Vercel 环境变量设置，确保 Key 为 `VITE_API_KEY`。
    2. 确保执行了 **Redeploy**（仅修改变量不会自动触发新构建）。

**页面白屏**
*   **原因**: 构建配置错误。
*   **解决**: 确保 `vite.config.ts` 配置正确（本项目已包含修复）。

## 技术栈

*   React 19
*   Vite
*   Tailwind CSS
*   Google GenAI SDK (Gemini 2.5 Flash Image)
*   Lucide React Icons