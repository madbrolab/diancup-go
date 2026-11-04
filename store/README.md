# DIANCUP 模板商店

此目录是可单独发布的商店数据源。普通模板和 Compose 模板分别维护，主程序源码不属于模板发布内容。

## 索引与加载

`index.json → 板块 index → 全部或用途分类分页 → 卡片 → 单模板 manifest → 配置文件`。

分类浏览使用独立的分页索引，商店直接显示模板卡片，不需要逐层展开开发者和仓库。每个模板源维护自己的索引，切换来源时只读取当前源。

`categories.json` 定义用途分类及顺序：工具（`tools`）、影音（`media`）、游戏（`games`）、网站（`web`）、下载（`download`）、存储（`storage`）、网络（`network`）、监控（`monitoring`）、开发（`development`）、数据库（`database`）、AI（`ai`）、其他（`other`）。普通模板和 Compose 模板使用同一套分类，空分类也保留索引并显示数量 0；分类与关键词搜索共同筛选结果。分类索引中的数量以对应板块为准。

每页至多 24 项，每个 JSON 文件不超过 64KiB。目录通过下一页地址衔接，索引引用包含 SHA-256。`all/pages` 同样分页，不能改成完整应用总表。搜索按规范化关键词的单字、双字建立独立散列分片，只读取匹配词的必要分页和卡片摘要，不扫描全部分类。

执行 `node scripts/build-template-store.mjs` 重建派生索引。生成器只在开发阶段遍历模板；运行时不得遍历目录、递归预取索引或下载仓库归档。

服务不内置模板或离线样例，只读取公共配置中已启用的 GitHub 仓库。首次访问当前源时自动同步，后续请求固定到同一个提交；“同步仓库”成功后切换到新修订，失败时保留当前已同步的仓库索引，没有成功同步记录时显示错误，不回退到内置模板。仓库读取遵循系统代理。默认仓库为 `madbrolab/diancup-go`，首次配置前可通过 `DIANCUP_TEMPLATE_STORE_REPOSITORY=owner/repository` 和 `DIANCUP_TEMPLATE_STORE_REF=branch-or-tag` 指定默认源。清空或停用来源后商店保持空状态，不会重新补入默认源；已有安装记录和项目仍可管理。

## 新增模板

每个应用使用独立目录 `templates/开发者/应用/`。ID 使用小写字母、数字和连字符，发布后保持稳定。更新模板时递增模板自身版本。

`manifest.json` 必须填写名称、简介、开发者、项目仓库、开源状态、许可证、收费密钥要求、架构、分类、图标、配置文件及建议修改项。开源状态使用 `open / closed / unknown`，收费密钥使用 `none / required / optional / unknown`，两者独立声明。

普通模板使用 `container.json`，端口和挂载行必须有稳定 `id`。建议项使用 `ports.http.host`、`volumes.data.host`、`environment.POSTGRES_PASSWORD` 等目标。`required` 表示值不能留空；`reason` 解释原因，`example` 提供必要示例。敏感值不得预置为真实凭据。

Compose 模板使用 `compose.yaml`，默认变量放在 `env.example`，必填密码留空并使用 `${PASSWORD:?请填写密码}`。数据库优先只在项目网络中开放；需要宿主机监听时明确绑定回环地址。避免使用没有用途说明的特权模式或 Docker socket 挂载。

模板需要声明并核对 amd64、arm64 等实际架构支持。图标存放在 `icons/`。本轮导入重新从项目官方仓库或官网获取图标并保存为本地资源；上游没有独立品牌标识时使用有出处的语义图标。来源和摘要保存在对应 manifest 的 `verification` 字段。

## 通用 ENV

公共配置页可保存常用变量、分组和敏感值标记。容器模板和 Compose 均可快速添加公共变量，同名变量默认保留当前值，覆盖需明确选择。公共变量保存在当前管理主机，不发布到模板仓库。

可以选取服务器文件、上传或手动编辑，并明确选择变量和注入位置：项目 `.env`、指定服务 `env_file`、指定服务 `environment`。通用文件生成项目独立副本，手动编辑不会修改公共源文件。应用变更前显示预览和覆盖关系。

项目变量按模板默认值、通用 ENV、手动改动合并。容器变量遵循 Compose 自身优先级，`environment` 优先于 `env_file`。密码和令牌只进入部署主机私有项目文件，文件权限 0600，不进入索引、数据库安装记录或发布数据。

## 安装与卸载

Compose 项目页和模板商店均提供“默认安装位置”入口，两处共用独立设置，只影响以后从模板新建的项目。它不修改 `DOCKER_DIR` 或已有项目路径，项目浏览也不受默认位置限制。

普通项目和模板安装时，存放 Compose 文件的项目目录均跟随文件管理器已配置的可见范围。模板中的挂载路径和其他路径选择可浏览宿主机全部路径；实际 Docker 绑定挂载使用配置中的真实宿主机路径，不受项目目录可见范围限制。

每个新模板项目的配置、`.env` 和注入 ENV 文件创建在 `默认安装位置/实例名/`。相对绑定路径以此目录为基准，也支持挂载项目外的已有数据目录、Docker socket 和宿主机系统路径，保持配置中的宿主机真实路径与读写模式。不创建其他临时项目目录、命名卷或匿名卷，镜像声明的持久化挂载必须显式绑定。镜像和容器运行元数据由 Docker 自身管理。

实例内的 `.diancup-template.json` 标记安装者为 `DIANCUP-template-store`，保存实例 ID、模板版本、来源仓库和提交信息，不包含变量值。数据库与实际容器身份共同确认归属，复制来源标记不会取得卸载权限。

公共配置页支持最多 8 个独立 GitHub 模板源，各自配置仓库、分支或标签。每个源缓存固定到具体提交，同名模板按来源区分。Compose 的 `applications` 数组逐项声明名称、图标、开发者、项目仓库和对应服务，界面支持折叠展示与缺失图标占位。

安装记录绑定 Docker 主机、稳定模板 ID、模板版本、索引版本及实例 ID。创建的容器包含来源标签。镜像相同不代表来自同一模板。失败与中断保留记录，卸载只操作该实例资源。

默认保留挂载目录、数据卷、镜像和项目配置。清空挂载目录是独立的默认关闭选项，逐项选择后必须确认没有其他项目挂载、没有重要文件，再手动输入实例名二次确认。确认令牌短期有效、只可使用一次，并绑定目录身份和实例状态。

共享的父子目录、只读挂载、系统目录、磁盘根目录、符号链接路径和包含子挂载的目录禁止清空。服务在执行前重新检查全部容器（含停止的容器）、其他安装记录及目录身份。无法完成检查时保留数据；人工仍需核实尚未创建容器的项目和重要文件。

## 只发布模板数据

`node scripts/prepare-template-publication.mjs /path/to/public-checkout` 将数据白名单同步到指定公开仓库的 `store/`，校验所有索引摘要并更新 `SHA256SUMS`。不会复制 Go / Vue / JavaScript 主程序源码、运行配置或真实 ENV。此目录中的模板仅用作公开仓库发布数据及开发测试，Docker 构建只包含分类名称，主程序不嵌入模板内容。此命令只准备文件，不提交、不推送、不发布镜像。

样例参考：

- [Nginx](https://hub.docker.com/_/nginx)
- [Uptime Kuma](https://github.com/louislam/uptime-kuma/blob/master/compose.yaml)
- [Jellyfin / LinuxServer.io](https://docs.linuxserver.io/images/docker-jellyfin/)
- [PostgreSQL](https://hub.docker.com/_/postgres)
- [WordPress](https://hub.docker.com/_/wordpress)
- [Gitea](https://docs.gitea.com/installation/install-with-docker/)

## 2026-11-04 新建基础 Compose 模板

提供 10 项可独立部署的基础模板，使用通用默认端口和数据目录创建新实例。模板使用独立的 `-basic` ID 和“基础版”名称，其他模板继续保留各自的部署参数。

去除了 Unraid 标签、缓存池与用户共享路径、个人代理、固定全局容器名与网络名、私人欢迎语和原密码。数据默认绑定到各自项目目录下的 `config`、`data`、`media`、`downloads`、`music`、`cloud` 等目录；使用已有数据时可选择宿主机任意实际目录。相对路径以各模板的 Compose 所在目录为基准，不代表这些应用会自动共用同一份数据。

| 基础模板 | 默认入口 | 项目与授权核对 | 主要调整 |
| --- | --- | --- | --- |
| [DIAN115 + PostgreSQL](templates/madbrolab/dian115-basic/manifest.json) | Host 网络，8095 | [官方 README](https://github.com/madbrolab/dian115)，2026-11-04；主程序私有授权，需激活密钥 | 独立 PostgreSQL 18，数据绑定 /var/lib/postgresql，数据库仅绑定回环地址 15432；配置、AI、媒体和云盘目录分别持久化；Docker socket 与 GPU 按功能另加 |
| [Joplin Server + PostgreSQL](templates/laurent22/joplin-server-basic/manifest.json) | 22300 | [Server README](https://github.com/laurent22/joplin/blob/dev/packages/server/README.md)，2026-11-04；个人用途许可证，可选商业授权 | 数据库不发布端口；内部连接固定 5432；实际访问地址必须与 APP_BASE_URL 一致 |
| [Navidrome](templates/navidrome/navidrome-basic/manifest.json) | 4533 | [官方 README](https://github.com/navidrome/navidrome)，2026-11-03；GPL-3.0，无付费密钥要求 | 音乐只读，默认每小时扫描，使用当前 ND_SCANNER_SCHEDULE 参数 |
| [WorkBuddy2API Panel](templates/linguo2625469/workbuddy2api-basic/manifest.json) | 7863 | [官方 README](https://github.com/linguo2625469/workbuddy2api-panel)，2026-10-21；MIT，项目免费 | 从成品镜像初始化配置目录和属主，显式设置配置路径；API 访问密钥必填 |
| [CloudDrive2](templates/cloudnas/clouddrive2-basic/manifest.json) | Host 网络，19798 | [官方发布](https://github.com/cloud-fs/cloud-fs.github.io/releases)，2026-10-17；闭源，有付费会员 | 配置、云盘发布目录及本地备份目录采用通用默认值；保留官方要求的 FUSE、Host PID、特权和共享传播 |
| [MoviePilot + PostgreSQL + Redis](templates/jxxghp/moviepilot-basic/manifest.json) | 3000、3001 | [官方 README](https://github.com/jxxghp/MoviePilot)，2026-11-04；GPL-3.0 与 README 非商业条款，项目声明不收费 | 移除重复端口和个人关联挂载；固定 PG16、Redis7；修复数据库路径、Redis 认证健康检查和启动依赖 |
| [qBittorrent](templates/linuxserver/qbittorrent-basic/manifest.json) | 8080；BT 6881 TCP/UDP | [项目 README](https://github.com/qbittorrent/qBittorrent) 与 [镜像文档](https://docs.linuxserver.io/images/docker-qbittorrent/)，2026-11-03；GPL，无付费密钥要求 | 使用 LinuxServer.io 镜像，监听端口与映射共用变量；配置和下载目录分开持久化 |
| [FlareSolverr](templates/flaresolverr/flaresolverr-basic/manifest.json) | 127.0.0.1:8191 | [官方 README](https://github.com/FlareSolverr/FlareSolverr)，2026-10-24；MIT，无付费密钥要求 | 默认回环监听，可填写内网 IP；显式绑定镜像声明的配置卷，浏览器临时文件使用 tmpfs |
| [Emby Server](templates/emby/embyserver-basic/manifest.json) | 8096 | [当前官方发布](https://github.com/MediaBrowser/Emby.Releases/releases)，2026-10-31；当前服务端闭源，可选 Premiere | 合并重复实例，改用官方镜像，移除特权和私人代理；GPU 与 DLNA 按需配置 |
| [Transmission](templates/linuxserver/transmission-basic/manifest.json) | 9091；BT 51413 TCP/UDP | [项目 README](https://github.com/transmission/transmission) 与 [镜像文档](https://docs.linuxserver.io/images/docker-transmission/)，2026-11-02；GPL，无付费密钥要求 | 使用 LinuxServer.io 当前镜像，管理密码必填；移除不存在的自定义 WebUI、Host 网络和特权 |

以上均核对了成品镜像，支持 `amd64` 和 `arm64`。闭源产品按当前官方发布记录确认维护状态，不把已停止公开的旧源码仓库当作当前产品。Joplin Server 的用途限制和 MoviePilot README 的附加条款单独记录，没有仅凭主仓库许可证标签将其标为无条件开源。

数据库密码、Redis 密码、API 密钥和 Transmission 管理密码没有预置真实值；空值通过 Compose 必填表达式阻止部署。DIAN115 数据库连接串与 MoviePilot Redis URL 中的密码建议使用至少 32 位随机十六进制字符，避免 URL 特殊字符。数据库仅服务本项目：Joplin 和 MoviePilot 不发布数据库端口，Host 网络的 DIAN115 通过回环映射连接。

MoviePilot 和下载器分别安装时，需要手动选取同一个宿主机下载目录，并保持容器内 `/downloads` 一致。不同基础模板中的 `./downloads` 默认属于各自项目。CloudDrive2 的发布目录必须支持 shared 挂载传播；消费者应选择同一个宿主机目录，使用 rslave 接收。该挂载要求适用于普通 Linux，未附加 Unraid 专用处理。

图标重新取自 DIAN115、Joplin、MoviePilot 前端、FlareSolverr 的官方仓库及 Emby、CloudDrive2 官网；CloudDrive2 使用官方矢量横标的标志区域。Navidrome、qBittorrent、Transmission 复用本轮独立核对的官方本地图标。WorkBuddy 没有独立图标，采用 [Lucide bot](https://github.com/lucide-icons/lucide/blob/main/icons/bot.svg)，沿用下方 ISC 许可声明；每项 manifest 均保留来源与摘要。

DIAN115 基础模板已修正为 PostgreSQL 18（模板版本 1.0.1），数据挂载采用该版本的 `/var/lib/postgresql`。此模板用于新装；已有 PG16 数据应先按 PostgreSQL 跨大版本流程迁移，不能直接更换镜像复用旧目录。

本批通过原生 `docker compose config`、变量声明与空必填校验、镜像卷显式绑定、依赖关系、架构和私人配置清除检查。没有批量启动这些应用。

## 已收录应用信息

以下信息于 2026-11-04 核对，项目介绍、公开源码状态和收费要求以对应项目 README 为依据；没有明确说明的情况标为未知。具体部署参数以各模板的 Compose 和 ENV 为准。

模板使用项目独立的实例名称和明确的数据绑定，按应用需要保留网络别名、系统挂载和宿主机路径。图标从项目官方资源下载并本地化；PanSou 使用 [Lucide folder-search](https://github.com/lucide-icons/lucide/blob/main/icons/folder-search.svg) 语义图标。

Dify 使用前需要准备 Nginx 站点配置并修改相应挂载；DeepTutor、n8n、PanSou 中的服务地址、模型凭据或代理示例需要按目标环境填写。

| 项目 README | 最近提交 | 许可证 / 说明 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- |
| [NGINX](https://github.com/nginx/nginx/blob/67290bfea61c81347464539f5e6d0a7cebec1fc8/README.md) | 2026-10-28 | BSD-2-Clause | 可选商业服务或授权 | amd64, arm64 |
| [Cronmaster](https://github.com/fccview/cronmaster/blob/2a323087ae124ff1e0e605eae6bb1b356a123eb7/README.md) | 2026-10-25 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Music Tag Web](https://github.com/xhongc/music-tag-web/blob/6105d8eba4535c04e0b1c0b09802949ba27445a9/README.md) | 2026-10-08 | GPL-3.0 with additional README restrictions | README 未明确 / 待确认 | amd64, arm64 |
| [CloudSaver](https://github.com/jiangrui1994/CloudSaver/blob/672cc48ab656973de2675383c966a5336d9de372/README.md) | 2026-10-15 | MIT applies to published source only | README 未明确 / 待确认 | amd64, arm64 |
| [OpenList](https://github.com/OpenListTeam/OpenList/blob/ef5d8c8d41ce3b300f7d7c47803e9d5082c9f64f/README.md) | 2026-11-04 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF/blob/ea922397fac247d7181b58e9e86a222a767cebde/README.md) | 2026-11-04 | Open-core; see upstream LICENSE | 可选商业服务或授权 | amd64, arm64 |
| [Xiaomi Album Syncer](https://github.com/Coooolfan/XiaomiAlbumSyncer/blob/ccbbf798cffcca6c402b109d519c06a5575aaa86/README.md) | 2026-11-02 | GPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [cfui](https://github.com/dockers-x/cfui/blob/95b5d15167817c0491f070ad52147dfadf2ec6c5/README.md) | 2026-10-31 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Octopus](https://github.com/bestruirui/octopus/blob/8aa58b0340ba2de58ce74fbfacd32597c44842a2/README.md) | 2026-10-23 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Seerr](https://github.com/seerr-team/seerr/blob/886adac27597b45cd901099cd02a0b46d9d3cb7f/README.md) | 2026-11-04 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [QM-Music](https://github.com/chenqimiao/qm-music/blob/a33e9e1a1e4d444b5148ae8b45ed056a49a54914/README.md) | 2026-09-10 | Apache-2.0 with noncommercial README terms | README 未明确 / 待确认 | amd64, arm64 |
| [Brave 浏览器](https://github.com/brave/brave-browser/blob/a33113d6035df5897fba3029507b2024616616a3/README.md) | 2026-11-04 | MPL-2.0 | README 未明确 / 待确认 | amd64, arm64 |
| [PandaWiki](https://github.com/chaitin/PandaWiki/blob/0b26db72ceb2f0f053a5c48b44546d7a342caacb/README.md) | 2026-10-21 | AGPL-3.0 | README 未明确 / 待确认 | amd64, arm64 |
| [IPTV 工具箱](https://github.com/taksssss/iptv-tool/blob/10d7a35e15a799e607cbb2236c3a4ea349f61199/README.md) | 2026-10-22 | GPL-2.0 | 自建无付费密钥要求 | amd64, arm64 |
| [PanSou](https://github.com/fish2018/pansou/blob/221665fb2c9279f22af4684ea2d8c0c331eac1cc/README.md) | 2026-10-12 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [VERT](https://github.com/VERT-sh/VERT/blob/257bcb3b2bb6a501bae0faf9ffb05060ee00c3f7/README.md) | 2026-10-20 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [n8n](https://github.com/n8n-io/n8n/blob/ca3e5129e58c2b6907cd8e94addb167c28b58692/README.md) | 2026-11-04 | Sustainable Use License / n8n Enterprise License | 可选商业服务或授权 | amd64, arm64 |
| [BeiDou Server](https://github.com/BeiDouMS/BeiDou-Server/blob/71d77515d62c2843cb6d41119eb669915ee15889/README.md) | 2026-10-29 | AGPL-3.0 | README 未明确 / 待确认 | amd64, arm64 |
| [Simple SQ Music Plus](https://github.com/59799517/simple_sq_music_plus/blob/3c2599d47a7c82b85607a7d1d063fd03e546bbf6/README.md) | 2026-10-30 | Unspecified; noncommercial README terms | README 未明确 / 待确认 | amd64 |
| [jotty·page](https://github.com/fccview/jotty/blob/30bbbaea4675d2adb6f2e5ff113f1994be2fb8e2/README.md) | 2026-10-25 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [DeepTutor](https://github.com/HKUDS/DeepTutor/blob/f7aed0744c36c5afef16a4261c31ebee1208cac2/README.md) | 2026-10-31 | Apache-2.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Dockge](https://github.com/louislam/dockge/blob/0329dabb5003f206d4fd9f7403a6af26d7138497/README.md) | 2026-10-23 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Uptime Kuma Compose](https://github.com/louislam/uptime-kuma/blob/41194cb3d6e2bb8b9ae6c8a0fe59ce577c3f3928/README.md) | 2026-11-03 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Netdata](https://github.com/netdata/netdata/blob/ca1035ac5fc5e69d7f55779344ed87962e42a401/README.md) | 2026-11-04 | GPL-3.0-or-later (Agent); NCUL1 (UI) | 可选商业服务或授权 | amd64, arm64 |
| [Homepage](https://github.com/gethomepage/homepage/blob/97135eaf8747e8d673ed57f7df328ef5a7e65a4e/README.md) | 2026-11-02 | GPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Vaultwarden](https://github.com/dani-garcia/vaultwarden/blob/82fc47e83e39c5d09e85a6f259c8ab51166735d1/README.md) | 2026-11-02 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [2FAuth](https://github.com/Bubka/2FAuth/blob/2a19734a178846f4b59c1b52504b8d8e1036623c/README.md) | 2026-11-02 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Navidrome](https://github.com/navidrome/navidrome/blob/7c1e68a1e4e68e7257affba4f25cd9cb545c7016/README.md) | 2026-11-03 | GPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Audiobookshelf](https://github.com/advplyr/audiobookshelf/blob/ce41ce489cebaf00e008919f6f2901b428acfd56/readme.md) | 2026-11-01 | GPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [qBittorrent](https://github.com/qbittorrent/qBittorrent/blob/0d6f6a008ed3c192b3eda25552a369b51da11c4d/README.md) | 2026-11-03 | See upstream COPYING; LinuxServer image GPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Transmission](https://github.com/transmission/transmission/blob/c1a0dbebd55add20efa0bc40d8ad3c57152e5635/README.md) | 2026-11-02 | See upstream COPYING; LinuxServer image GPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [MeTube](https://github.com/alexta69/metube/blob/7e73766238f3fc491b2aeba0c3c8b415c408eaaa/README.md) | 2026-11-01 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [Memos](https://github.com/usememos/memos/blob/b40d8a7b573774c52b022c8d6537d6baf2129dc0/README.md) | 2026-11-01 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [BookStack](https://github.com/BookStackApp/BookStack/blob/0b6b667e0d84ebb3406de6de9fadbf4230c29c0b/readme.md) | 2026-11-02 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [FreshRSS](https://github.com/FreshRSS/FreshRSS/blob/4e8a258b011aad190597d7953b7122fc43f4658f/README.md) | 2026-11-02 | AGPL-3.0 | 自建无付费密钥要求 | amd64, arm64 |
| [wallabag](https://github.com/wallabag/wallabag/blob/17be63dee2a14f5a49b49dd12c9daf81b9754991/README.md) | 2026-11-03 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Open WebUI](https://github.com/open-webui/open-webui/blob/c38885a1a737da4968f157092f304f3b5481d0bf/README.md) | 2026-11-03 | Open WebUI License with branding requirements | 可选商业服务或授权 | amd64, arm64 |
| [Dify](https://github.com/langgenius/dify/blob/ca01a69f87baaf31709b8cedea8ba3a97ecc3518/README.md) | 2026-11-04 | Dify Open Source License; see upstream LICENSE | 可选商业服务或授权 | amd64, arm64 |
| [NextChat](https://github.com/ChatGPTNextWeb/NextChat/blob/1d3dc331512929a4b1d3e82354e72acce33b5c7a/README.md) | 2026-10-20 | MIT | 可选商业服务或授权 | amd64, arm64 |
| [Beszel](https://github.com/henrygd/beszel/blob/27af11c5e04f03c1fa6cc067a1251631e2e8996e/readme.md) | 2026-10-30 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Actual Budget](https://github.com/actualbudget/actual/blob/a3a1c7fc41f891dc91936a488ef08f695c982580/README.md) | 2026-11-03 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Baby Buddy](https://github.com/babybuddy/babybuddy/blob/2bd0461f5a7e407147bcfef363eb79dce6c9708d/README.md) | 2026-10-28 | BSD-2-Clause | 自建无付费密钥要求 | amd64, arm64 |
| [PLANKA](https://github.com/plankanban/planka/blob/98c1ef216bcf47fc873f5b92cbb334711fc92162/README.md) | 2026-11-02 | PLANKA Community Fair Use License / Commercial License | 可选商业服务或授权 | amd64, arm64 |
| [Vikunja](https://github.com/go-vikunja/vikunja/blob/2a4a28dcf78451f3d2fceb091f322612f83f6d8a/README.md) | 2026-11-04 | AGPL-3.0-or-later | 可选商业服务或授权 | amd64, arm64 |
| [Umami](https://github.com/umami-software/umami/blob/559e3c607c23d2c72d9bd4f6481bda428255323c/README.md) | 2026-10-23 | MIT | README 未明确 / 待确认 | amd64, arm64 |
| [Gotify](https://github.com/gotify/server/blob/dd06dc77190696e93d3297b9a733711516fb17d9/README.md) | 2026-10-25 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [Bark Server](https://github.com/Finb/bark-server/blob/640deaa151ddf79193202927b35ca2f14f65ee1d/README.md) | 2026-10-10 | MIT | 自建无付费密钥要求 | amd64, arm64 |
| [梨园 Liyuan](https://github.com/weidu12123/Liyuan/blob/21fd38cb10e915fbf9c1f25fcbabe92f06a8993d/README.md) | 2026-11-01 | PolyForm Noncommercial 1.0.0 | README 未明确 / 待确认 | amd64 |
| [So Novel](https://github.com/freeok/so-novel/blob/88acec6ee489ca1c2489c624cedd1ef417d3f3ee/README.md) | 2026-10-26 | AGPL-3.0 | 自建无付费密钥要求 | amd64 |

### 部署模板来源许可

部署参数参考 [coracoo/tradis_templates](https://github.com/coracoo/tradis_templates)。按其 MIT 许可保留以下声明；应用本身、图标和商标仍遵循各自上游条款。

```text
MIT License

Copyright (c) 2025 cgakki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

PanSou 语义图标来自 Lucide，保留其许可声明：

```text
ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
