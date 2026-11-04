# DIANCUP 模板商店

此目录是可单独发布的商店数据源。普通模板和 Compose 模板分别维护，主程序源码不属于模板发布内容。

## 索引与加载

`index.json → 板块 index → 分类目录分页 → 分类 index → 卡片分页 → 单模板 manifest → 配置文件`。

每页至多 24 项，每个 JSON 文件不超过 64KiB。目录通过下一页地址衔接，索引引用包含 SHA-256。`all/pages` 同样分页，不能改成完整应用总表。搜索按规范化关键词的单字、双字建立独立散列分片，只读取匹配词的必要分页和卡片摘要，不扫描全部分类。

执行 `node scripts/build-template-store.mjs` 重建派生索引。生成器只在开发阶段遍历模板；运行时不得遍历目录、递归预取索引或下载仓库归档。

服务自带不可变的离线快照，首次打开立即显示。商店中的“同步仓库”从 GitHub 读取最新修订，并把后续请求固定到同一个提交；失败时保留当前快照。默认仓库为 `madbrolab/diancup-go`，可通过 `DIANCUP_TEMPLATE_STORE_REPOSITORY=owner/repository` 和 `DIANCUP_TEMPLATE_STORE_REF=branch-or-tag` 指定公共数据仓库。同步不会修改已安装项目。

## 新增模板

每个应用使用独立目录 `templates/开发者/应用/`。ID 使用小写字母、数字和连字符，发布后保持稳定。更新模板时递增模板自身版本。

`manifest.json` 必须填写名称、简介、开发者、项目仓库、开源状态、许可证、收费密钥要求、架构、分类、图标、配置文件及建议修改项。开源状态使用 `open / closed / unknown`，收费密钥使用 `none / required / optional / unknown`，两者独立声明。

普通模板使用 `container.json`，端口和挂载行必须有稳定 `id`。建议项使用 `ports.http.host`、`volumes.data.host`、`environment.POSTGRES_PASSWORD` 等目标。`required` 表示值不能留空；`reason` 解释原因，`example` 提供必要示例。敏感值不得预置为真实凭据。

Compose 模板使用 `compose.yaml`，默认变量放在 `env.example`，必填密码留空并使用 `${PASSWORD:?请填写密码}`。数据库优先只在项目网络中开放；需要宿主机监听时明确绑定回环地址。避免使用没有用途说明的特权模式或 Docker socket 挂载。

模板需要声明并核对 amd64、arm64 等实际架构支持。图标存放在 `icons/`；当前样例为本地字母图标，非上游官方商标。

## 通用 ENV

可以选取服务器文件、上传或手动编辑，并明确选择变量和注入位置：项目 `.env`、指定服务 `env_file`、指定服务 `environment`。通用文件生成项目独立副本，手动编辑不会修改公共源文件。应用变更前显示预览和覆盖关系。

项目变量按模板默认值、通用 ENV、手动改动合并。容器变量遵循 Compose 自身优先级，`environment` 优先于 `env_file`。密码和令牌只进入部署主机私有项目文件，文件权限 0600，不进入索引、数据库安装记录或发布数据。

## 安装与卸载

安装记录绑定 Docker 主机、稳定模板 ID、模板版本、索引版本及实例 ID。创建的容器包含来源标签。镜像相同不代表来自同一模板。失败与中断保留记录，卸载只操作该实例资源。

默认保留挂载目录、数据卷、镜像和项目配置。清空挂载目录是独立的默认关闭选项，逐项选择后必须确认没有其他项目挂载、没有重要文件，再手动输入实例名二次确认。确认令牌短期有效、只可使用一次，并绑定目录身份和实例状态。

共享的父子目录、只读挂载、系统目录、磁盘根目录、符号链接路径和包含子挂载的目录禁止清空。服务在执行前重新检查全部容器（含停止的容器）、其他安装记录及目录身份。无法完成检查时保留数据；人工仍需核实尚未创建容器的项目和重要文件。

## 只发布模板数据

`node scripts/prepare-template-publication.mjs /path/to/public-checkout` 将数据白名单同步到指定公开仓库的 `store/`，校验所有索引摘要并更新 `SHA256SUMS`。不会复制 `embed.go`、Go / Vue / JavaScript 主程序源码、运行配置或真实 ENV。此命令只准备文件，不提交、不推送、不发布镜像。

样例参考：

- [Nginx](https://hub.docker.com/_/nginx)
- [Uptime Kuma](https://github.com/louislam/uptime-kuma/blob/master/compose.yaml)
- [Jellyfin / LinuxServer.io](https://docs.linuxserver.io/images/docker-jellyfin/)
- [PostgreSQL](https://hub.docker.com/_/postgres)
- [WordPress](https://hub.docker.com/_/wordpress)
- [Gitea](https://docs.gitea.com/installation/install-with-docker/)
