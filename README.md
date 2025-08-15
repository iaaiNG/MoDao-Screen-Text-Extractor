# MoDao Screen Text Extractor with Levels + StartLevel 开关

一个用于 **墨刀（MoDao）原型页面** 的油猴脚本，可以提取 Screen 文本路径，支持：
- 自定义层级范围
- 自定义起始节点（CSS Selector 或 XPath）
- `StartLevel` 开关控制路径起点

## 📦 安装

点击下面的链接直接安装（需先安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展）：

[👉 点击这里安装脚本](https://raw.githubusercontent.com/iaaiNG/MoDao-Screen-Text-Extractor/main/modao-screen-text-extractor.user.js)

---

## 🛠 功能说明

- **起始节点输入**：支持 CSS Selector 或 XPath（默认 `.sm-list`）
- **层级范围**：设置起始层和结束层
- **StartLevel 开关**：是否仅从 `startLevel` 开始收集路径
- **输出**：在控制台打印形如 `前端-01.xxx/xxx` 的路径

---

## 📷 使用方法

1. 打开符合 `https://modao.cc/proto/*/sharing*` 的墨刀页面
2. 页面右上角会出现脚本面板：
   - 输入起始节点（可选）
   - 设置起始层、结束层
   - 勾选/取消“仅从起始层开始打印”
3. 点击 **“打印输出”** 按钮
4. 打开浏览器控制台（F12）查看输出的路径列表

---

## 🔄 自动更新

此脚本会自动检测更新（需保持 `@version` 递增）。  
检查更新：
- Tampermonkey 面板 → 右键脚本 → **检查更新**
- 或等待 Tampermonkey 按设定周期自动检测

---

## 🧑‍💻 作者

- **jkm**
- GitHub: [iaaiNG](https://github.com/iaaiNG)
