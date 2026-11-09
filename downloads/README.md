# DIANCUP 浏览器插件 1.1.4

[下载 ZIP](https://github.com/madbrolab/diancup-go/raw/refs/heads/main/downloads/diancup-extension-1.1.4.zip) · [下载 CRX](https://github.com/madbrolab/diancup-go/raw/refs/heads/main/downloads/diancup-extension-1.1.4.crx) · [SHA-256 校验](../SHA256SUMS)

将当前网页或右键链接添加到 DIANCUP 导航，可选择站点图标、分类、内网/外网/STUN 地址和公开状态，也可将 DIANCUP 用作新标签页。

## 本轮更新

- 自动读取当前网页的站点图标、触屏图标和网站清单图标，多个图标可直接点击选择。
- 图标在浏览器中读取一次，预览和上传复用同一份图片；保存时直接发送图片数据，服务器无需再次下载所选图标。
- 支持重新获取和使用默认图标；图标保存失败会保留选择并提示重试。

## 安装与使用

1. 下载并解压 ZIP，在 Chrome / Edge 扩展管理页开启开发者模式，选择「加载已解压的扩展程序」。已有插件请替换原目录内容并重新加载，确认版本为 1.1.4。
2. 登录导航，在「导航管理 → 定制外观与布局 → 管理工具 → 浏览器插件」生成插件专用 API Key。
3. 在插件设置填写 DIANCUP 地址与 Key，测试并保存，按提示授权访问服务器。
4. 点击插件添加当前网页，或右键网页/链接选择分类。在添加窗口点击图标缩略图，选好图标后保存。

同步所选图标需要主程序支持 `bookmark_icons` 能力，旧服务器会提示更新主程序。插件升级后请按提示确认新增的 `scripting` 权限；跨域图标读取受限时，可点击对应图标授权其所在域名。

Key 与服务器地址仅保存在本机。Chrome / Edge 可能限制直接安装 CRX，可使用 ZIP 加载方式安装。
