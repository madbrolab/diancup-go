<div align="center">
  <img src="assets/logo.svg" width="112" alt="DIANCUP">
  <h1>DIANCUP</h1>
  <p>让常用服务，触手可及。</p>
  <p>可定制导航 · Docker 与 Compose 管理 · 主机运维</p>
</div>

## 关于本仓库

这里提供 DIANCUP 的使用说明和浏览器插件安装包

- 容器镜像：[`madbrolab/diancup`](https://hub.docker.com/r/madbrolab/diancup)
- 运行平台：Linux `amd64` / `arm64`
- 导航首页：`/`；管理后台：`/dashboard`

## 功能

| 模块 | 能力 |
| --- | --- |
| 导航 | Liquid Glass 风格、响应式布局、分类与私有入口、自动内外网与 STUN 选择 |
| 卡片 | 拖动、缩放、桌面与手机独立布局、图标渐变、便签、时钟、图片与服务状态 |
| 服务组件 | Emby、Jellyfin、qBittorrent、Transmission、MoviePilot、OpenWrt、OpenClash、Lucky、DIAN115；以对应服务的 API 能力和配置为准 |
| 个性化 | 主题、背景、布局、自定义页脚；手机底栏可固定两个现有入口 |
| 容器与镜像 | 状态、日志、控制台、更新检查、镜像与网络管理；复用采集数据，减少重复查询 |
| Compose | 项目管理、配置编辑与部署操作 |
| 主机运维 | 文件管理、资源监控、SSH 工作台与多设备管理 |
| 工作台外观 | 与导航共用玻璃组件、弹窗、抽屉、菜单和动效；适配手机、软键盘及系统减少动态效果设置 |
| 通知与助手 | 可配置通知渠道，以及使用自有模型接口的 AI 运维助手 |

## 2026.10.27.1 更新

- 工作台、设置、AI 助手和 SSH 统一共享组件与弹层交互，完善页面切换、选中指示及菜单动效。
- 优化容器与服务卡片加载：快服务独立返回，复用短期缓存与持续采集数据，减少重复请求。
- 改善 PWA 状态栏、安全区域、手机按钮排列、软键盘避让及悬浮入口遮挡。

## Docker Compose 部署

先安装 Docker Engine 和 Docker Compose 插件，再创建 `compose.yaml`：

```yaml
services:
  diancup:
    image: madbrolab/diancup:latest
    container_name: diancup
    privileged: true
    restart: unless-stopped
    ports:
      - "9520:9520"
    volumes:
      - ./config:/config #可绝对路径，可不更改使用相对路径
      - /:/host #不可更改
    environment:
      TZ: Asia/Shanghai
      WEB_PORT: "9520"
      DOCKER_DIR: /mnt/cache/docker #示例目录，必须更换，修改为你的项目存放的文件夹（以后用DIAN创建的项目都在这个目录）
```

将 `DOCKER_DIR` 改为宿主机实际的 Compose 项目目录，然后启动：

```bash
docker compose pull
docker compose up -d
```

访问 `http://服务器地址:9520/`。示例通过 `WEB_PORT` 指定端口；首次使用请按页面提示设置管理密码。导航管理登录与后台使用同一认证。

`/config` 保存数据库及配置，更新前请备份此目录。`/:/host` 和特权模式用于主机管理功能；请将管理入口放在可信网络中，外部访问建议使用 HTTPS 反向代理。

更新镜像时再次执行上述 `pull` 与 `up -d`；不要删除配置目录。Docker 会自动选择对应的 CPU 架构。

## 浏览器插件

插件支持将当前网页或右键选择的链接添加到导航分类，并可选择是否将 DIANCUP 用作新标签页。

- [下载 ZIP 安装包](downloads/diancup-extension-1.1.1.zip)
- [下载 CRX 安装包](downloads/diancup-extension-1.1.1.crx)
- [校验文件 SHA-256](SHA256SUMS)

### Chrome / Edge 安装

1. 下载并解压 ZIP。
2. 打开 `chrome://extensions/` 或 `edge://extensions/`。
3. 开启开发者模式，选择「加载已解压的扩展程序」，选中解压目录。
4. 打开插件设置，填写 DIANCUP 的 HTTP/HTTPS 地址与专用插件 API Key。
5. 测试连接并保存，然后从插件弹窗或网页右键菜单添加入口。

专用 API Key 在登录后的导航设置中生成；它不是管理密码。重新生成 Key 会使旧 Key 失效。浏览器对 CRX 的安装限制因渠道或策略而异，若无法安装请使用 ZIP 方式。

插件安装包只包含运行资源，不包含主工程源码；签名私钥不会公开。

## 页脚与导航设置

登录导航后，从「导航管理 → 定制外观与布局」调整外观、背景和布局。外观页的「页脚」可修改名称、介绍和 GitHub 地址，或隐藏整个页脚。

登录后可右键卡片编辑内容、调整尺寸或固定到手机底栏；手机也支持长按菜单。第三方组件的凭据由服务端使用，私有分类和入口仅在登录后展示。

## 反馈

请通过本仓库的 Issues 反馈问题，并注明镜像版本、CPU 架构及复现步骤。请勿提交密码、API Key、数据库备份或包含凭据的日志。

DIANCUP 由 **madbrolab** 维护。
