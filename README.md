<div align="center">
  <img src="https://raw.githubusercontent.com/madbrolab/diancup-go/main/assets/logo.svg" width="112" alt="DIANCUP">
  <h1>DIANCUP</h1>
  <h3>💬 <a href="https://t.me/diancup">加入 DIANCUP Telegram 交流群</a></h3>
  <p>让常用服务，触手可及。</p>
  <p>可定制导航 · Docker 与 Compose 管理 · 主机运维</p>
</div>

## 权限与风险

**权限与风险请务必了解：** 本项目从自用出发，按宿主机最高管理权限设计。对于常见的 root 权限 Docker 环境，即使不直接授予宿主机目录访问权限，只要能通过 `docker.sock` 完整管理 Docker，就能创建临时容器、挂载宿主机目录，进而读写主机文件，实质上具有 root 级控制能力。其他拥有相同 Docker 权限的项目也存在这一风险。**介意此类权限或无法承担风险的用户，请勿使用。** 作者不保证项目不存在漏洞，对因使用本项目造成的主机、服务器或 VPS 文件损坏、数据丢失、资料泄露等损失不承担责任。

## 在线演示

[打开 Demo](https://madbrolab.github.io/diancup-go/) · [主机管理演示](https://madbrolab.github.io/diancup-go/#/overview)。演示使用虚构数据，操作仅在演示页面生效。

## 功能概览

面向家庭 NAS 与自建服务的导航、Docker 和主机管理面板，支持 Linux `amd64` / `arm64`。

| 模块 | 主要功能 |
| --- | --- |
| 导航 | 分类与私有书签、自定义卡片、服务组件、主题背景、内外网与 STUN 自动切换 |
| Docker | 容器启停、日志与终端、镜像更新、网络、数据卷及端口管理 |
| Compose 与商店 | 项目配置与部署、容器转 Compose、应用模板、部署预检与任务进度 |
| 主机与文件 | 资源监控、进程与告警、文件编辑与预览、上传下载、复制移动及压缩解压 |
| 多机与 SSH | 探针、主动回连、SSH 工作台、远程文件管理和跨设备批量任务 |
| 自动化与通知 | 定时启停、自动更新、镜像清理、企业微信和 Telegram 通知 |
| AI 助手 | 自有模型接入、网页与 Telegram 运维、配置生成、日志分析和长期记忆 |
| 通用能力 | 移动端与 PWA、两步验证、配置导入导出、系统代理、浏览器插件 |

## Docker Compose 部署

安装 Docker Engine 和 Compose 插件，创建 `compose.yaml`：

```yaml
services:
  diancup:
    image: madbrolab/diancup:latest
    container_name: diancup
    privileged: true
    restart: unless-stopped
    ports:
      - "9527:9527"
    volumes:
      - ./config:/config
      - /:/host
    environment:
      TZ: Asia/Shanghai
      WEB_PORT: "9527"
```

启动或更新：

```bash
docker compose pull
docker compose up -d
```

导航首页：`http://服务器地址:9527/`；管理后台：`http://服务器地址:9527/dashboard`。更新时保留配置目录和原有挂载；外部访问建议使用 HTTPS。

### 首次设置密码

**新安装没有通用默认密码，需要先获取一次性验证码。**

1. 容器启动后，在服务器终端执行：

   ```bash
   docker exec diancup cat /config/setup-token
   ```

2. 打开管理后台，将输出粘贴到「初始验证码」，设置并确认管理密码（至少 8 位，包含字母和数字，避免常见弱密码）。
3. 使用刚设置的密码登录。导航与后台共用管理密码，设置成功后验证码失效，文件自动删除；已有实例升级沿用原密码。

也可直接读取宿主机配置目录中的 `setup-token` 文件；若配置了 `DIANCUP_SETUP_TOKEN`，使用该环境变量的值。

## 浏览器插件

[下载 ZIP](https://github.com/madbrolab/diancup-go/raw/refs/heads/main/downloads/diancup-extension-1.1.2.zip) · [下载 CRX](https://github.com/madbrolab/diancup-go/raw/refs/heads/main/downloads/diancup-extension-1.1.2.crx) · [SHA-256 校验](https://github.com/madbrolab/diancup-go/blob/main/SHA256SUMS)

Chrome / Edge 打开扩展管理页，开启开发者模式，加载解压后的 ZIP。插件设置中填写 DIANCUP 地址和导航设置生成的专用 API Key，测试并保存后，即可添加当前网页或右键链接，也可设为新标签页。

## 交流与反馈

[GitHub Issues](https://github.com/madbrolab/diancup-go/issues) · [应用模板](https://github.com/madbrolab/diancup-go/tree/main/store) · [Docker Hub](https://hub.docker.com/r/madbrolab/diancup)

反馈时注明镜像版本、CPU 架构与复现步骤，请勿提交密码、API Key 或含凭据的日志。DIANCUP 由 **madbrolab** 维护。
