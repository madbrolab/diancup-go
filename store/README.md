# DIANCUP 模板商店

面向个人与家庭 NAS 的应用模板。普通模板和 Compose 模板分别维护。

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

模板需要声明实际支持的 amd64、arm64 等架构。图标存放在 `icons/`，使用项目标识或适合应用用途的语义图标。资源信息和摘要保存在对应 manifest 的 `verification` 字段。

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

## 应用目录

当前共 74 项模板（6 项普通模板、68 项 Compose 模板）。维护记录于 2026-11-04 至 2026-11-06 核对，各项目最近均有三个月内的上游活动。项目介绍、源码状态和收费说明以项目 README 为依据；未明确的收费情况保留为未知。点击应用查看模板，点击“项目”打开对应主页。

### 工具

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [Karakeep](templates/karakeep-app/karakeep/manifest.json) · [项目](https://github.com/karakeep-app/karakeep) | 把网页、图片和笔记集中收藏，保存内容快照并全文检索，适合整理个人长期阅读资料；可按需连接模型服务辅助打标签。 | 2026-11-04 | 公开源码；AGPL-3.0 | 可选付费服务或功能 | amd64, arm64 |
| [Yuvomi](templates/ulsklyc/yuvomi/manifest.json) · [项目](https://github.com/ulsklyc/yuvomi) | 把家庭日历、待办、购物清单和餐食安排放在同一工作区，方便家人共同记录日常事项，并保留本地数据和定时备份。 | 2026-11-06 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [ezBookkeeping](templates/mayswind/ezbookkeeping/manifest.json) · [项目](https://github.com/mayswind/ezbookkeeping) | 记录个人收支与账户往来，按分类、币种和时间查看账目统计；搭配独立 PostgreSQL，适合长期维护家庭财务记录。 | 2026-11-05 | 公开源码；MIT | README 未明确 | amd64, arm64 |
| [AdventureLog](templates/seanmorley15/adventurelog/manifest.json) · [项目](https://github.com/seanmorley15/AdventureLog) | 在地图上记录旅行足迹、照片和经历，整理想去的地点与行程计划，把个人旅行资料持续保存在自己的服务器。 | 2026-11-03 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Excalidraw](templates/excalidraw/excalidraw/manifest.json) · [项目](https://github.com/excalidraw/excalidraw) | 在浏览器中绘制手绘风格的白板、流程图和结构草图，支持导出图片与可继续编辑的绘图文件，适合随手记录和讲解想法。 | 2026-11-06 | 公开源码；MIT | 可选付费服务或功能 | amd64, arm64 |
| [Ghostfolio](templates/ghostfolio/ghostfolio/manifest.json) · [项目](https://github.com/ghostfolio/ghostfolio) | 汇总个人投资账户与交易记录，查看资产配置、收益走势和持仓变化；数据保存在本地数据库，行情可按所选数据源获取。 | 2026-11-06 | 公开源码；AGPL-3.0 | 可选付费服务或功能 | amd64, arm64 |
| [Gramps Web](templates/gramps-project/gramps-web/manifest.json) · [项目](https://github.com/gramps-project/gramps-web) | 整理家谱中的人物、亲属关系、事件与照片，在浏览器中共同维护家庭历史，并可与 Gramps 桌面端交换资料。 | 2026-11-04 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Manyfold Solo](templates/manyfold3d/manyfold/manifest.json) · [项目](https://github.com/manyfold3d/manyfold) | 为个人 3D 打印模型建立可预览、可分类的资料库，整理模型文件、作者和标签；Solo 镜像内置数据库与任务队列，适合家庭使用。 | 2026-11-05 | 公开源码；AGPL-3.0 | README 未明确 | amd64, arm64 |
| [Spoolman](templates/donkie/spoolman/manifest.json) · [项目](https://github.com/Donkie/Spoolman) | 记录 3D 打印耗材的品牌、材质、颜色和剩余重量，打印前查找合适料卷，并可连接兼容打印软件同步耗材用量。 | 2026-11-02 | 公开源码；MIT | README 未明确 | amd64, arm64 |
| [ConvertX](templates/c4illin/convertx/manifest.json) · [项目](https://github.com/C4illin/ConvertX) | 通过网页提交图片、文档、音频等文件，在 NAS 上选择目标格式并批量转换，减少在各台电脑重复安装转换软件的需要。 | 2026-11-02 | 公开源码；AGPL-3.0 | README 未明确 | amd64, arm64 |
| [Actual Budget](templates/actualbudget/actual-budget/manifest.json) · [项目](https://github.com/actualbudget/actual) | 以本地数据为中心管理个人收支与预算，并在设备之间同步记录。软件免费开源，可自行部署或选择外部托管。 | 2026-11-03 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [AFFiNE](templates/toeverything/affine/manifest.json) · [项目](https://github.com/toeverything/AFFiNE) | 把文档、白板和知识组织放在同一个协作工作区，支持自由排版与多人编辑。社区版可免费自建，其他版本和云端服务另有方案。 | 2026-11-04 | 公开源码；MIT (Community Edition); separate terms for other editions | 可选付费服务或功能 | amd64, arm64 |
| [Baby Buddy](templates/babybuddy/babybuddy/manifest.json) · [项目](https://github.com/babybuddy/babybuddy) | 记录婴儿喂养、睡眠、换尿布及日常照护活动，让照护者共享记录并观察生活规律。 | 2026-10-28 | 公开源码；BSD-2-Clause | 自建无必需付费密钥 | amd64, arm64 |
| [Bark Server](templates/finb/bark-server/manifest.json) · [项目](https://github.com/Finb/bark-server) | 为 Bark iOS 客户端提供自建推送后端，让脚本和其他应用把自定义通知发送到自己的设备。 | 2026-10-10 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [BookStack](templates/bookstackapp/bookstack/manifest.json) · [项目](https://github.com/BookStackApp/BookStack) | 把团队资料整理成书籍、章节和页面，提供易上手的文档编辑与组织方式，适合维护内部知识和操作手册。 | 2026-11-02 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Brave 浏览器](templates/brave/brave-browser/manifest.json) · [项目](https://github.com/brave/brave-browser) | 通过网页远程使用容器内的 Brave 浏览器，浏览器的运行配置保存在宿主机。项目入口与源码仓库在 README 中分别列出。 | 2026-11-04 | 公开源码；MPL-2.0 | README 未明确 | amd64, arm64 |
| [FreshRSS](templates/freshrss/freshrss/manifest.json) · [项目](https://github.com/FreshRSS/FreshRSS) | 集中订阅与阅读 RSS、Atom 等内容源，按用户保存标签和阅读状态，并能对接移动客户端或扩展插件。 | 2026-11-02 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Gotify](templates/gotify/server/manifest.json) · [项目](https://github.com/gotify/server) | 搭建自己的消息推送服务，通过 REST API 发送通知，并使用网页、WebSocket 或 Android 客户端接收消息。 | 2026-10-25 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Grocy](templates/grocy/grocy/manifest.json) · [项目](https://github.com/grocy/grocy) | 管理食品库存、保质期、购物清单和家务安排，也可记录家庭设备与电池消耗，适合日常采购和减少食物浪费。 | 2026-09-16 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Home Assistant](templates/home-assistant/home-assistant/manifest.json) · [项目](https://github.com/home-assistant/core) | 连接家中的智能设备、传感器与服务，建立自动化场景和家庭仪表盘。此模板部署 Home Assistant Container，配置保存在自己的 NAS。 | 2026-11-04 | 公开源码；Apache-2.0 | README 未明确 | amd64, arm64 |
| [Homebox](templates/sysadminsmedia/homebox/manifest.json) · [项目](https://github.com/sysadminsmedia/homebox) | 为家中物品建立可搜索的档案，记录存放位置、照片、购买凭证与保修信息，便于查找和整理家庭资产。 | 2026-10-31 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Joplin Server + PostgreSQL 基础版](templates/laurent22/joplin-server-basic/manifest.json) · [项目](https://github.com/laurent22/joplin) | 为 Joplin 客户端提供笔记同步与共享服务，数据保存在配套 PostgreSQL 中。服务端源码可查看，个人用途与商业用途适用不同授权。 | 2026-11-04 | 源码状态未知；Joplin Server Personal Use License / commercial license | 可选付费服务或功能 | amd64, arm64 |
| [jotty·page](templates/fccview/jotty/manifest.json) · [项目](https://github.com/fccview/jotty) | 自建清单与笔记空间，保存日常任务和文字记录，并可为个人笔记启用加密。 | 2026-10-25 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [LubeLogger](templates/hargata/lubelogger/manifest.json) · [项目](https://github.com/hargata/lubelog) | 记录家用车辆的保养、维修、加油、里程与费用，保存相关凭证，设置保养计划，并与家人共同维护车辆档案。 | 2026-10-14 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Mealie](templates/mealie-recipes/mealie/manifest.json) · [项目](https://github.com/mealie-recipes/mealie) | 保存网页食谱与自制菜谱，安排每周餐单并生成购物清单，适合个人和家庭共同整理饮食计划。 | 2026-11-03 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Memos](templates/usememos/memos/manifest.json) · [项目](https://github.com/usememos/memos) | 按时间记录零散想法和日常笔记，通过标签整理内容，并为每条记录选择私密保存或公开分享。 | 2026-11-01 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [n8n](templates/n8n-io/n8n/manifest.json) · [项目](https://github.com/n8n-io/n8n) | 用可视化节点连接应用与模型服务，编排自动化任务，也能加入脚本。采用 fair-code 授权，额外企业功能需商业许可。 | 2026-11-04 | 源码状态未知；Sustainable Use License / n8n Enterprise License | 可选付费服务或功能 | amd64, arm64 |
| [Omni-tools](templates/iib0011/omni-tools/manifest.json) · [项目](https://github.com/iib0011/omni-tools) | 把图片、文本、数字、日期和文件处理工具放进一个网页，日常格式处理可在浏览器本地完成，无需上传到外部工具站。 | 2026-10-24 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [PandaWiki](templates/chaitin/pandawiki/manifest.json) · [项目](https://github.com/chaitin/PandaWiki) | 搭建面向读者的知识站点，管理文档并导入外部内容，配置模型后可进行知识问答与辅助写作；README 另列托管服务但未说明价格。 | 2026-10-21 | 公开源码；AGPL-3.0 | README 未明确 | amd64, arm64 |
| [Paperless-ngx](templates/paperless-ngx/paperless-ngx/manifest.json) · [项目](https://github.com/paperless-ngx/paperless-ngx) | 归档扫描件、账单和家庭文档，通过 OCR 提取文字，按标签、联系人和文档类型整理并全文检索。默认启用简体中文与英文识别。 | 2026-11-04 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Penpot](templates/penpot/penpot/manifest.json) · [项目](https://github.com/penpot/penpot) | 在浏览器里协作设计界面、制作交互原型和维护设计系统，可与开发流程配合使用。项目提供可自建的开源版本和付费企业方案。 | 2026-11-04 | 公开源码；MPL-2.0 | 可选付费服务或功能 | amd64, arm64 |
| [PLANKA](templates/plankanban/planka/manifest.json) · [项目](https://github.com/plankanban/planka) | 用看板、列表和卡片协作管理项目，记录评论、附件与到期时间。社区版可自建，Pro 和企业功能另行授权。 | 2026-11-02 | 源码状态未知；PLANKA Community Fair Use License / Commercial License | 可选付费服务或功能 | amd64, arm64 |
| [So Novel](templates/freeok/so-novel/manifest.json) · [项目](https://github.com/freeok/so-novel) | 从网页提取并整理内容，导出 EPUB、TXT 或 PDF 等文档，也提供便于服务器使用的网页操作入口。 | 2026-10-26 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64 |
| [Stirling PDF](templates/stirling-tools/stirling-pdf/manifest.json) · [项目](https://github.com/Stirling-Tools/Stirling-PDF) | 在本地服务器处理 PDF 的合并、拆分、转换、OCR 和签署，也可通过 API 编排任务；提供可选付费服务器及企业功能。 | 2026-11-04 | 公开源码；Open-core; see upstream LICENSE | 可选付费服务或功能 | amd64, arm64 |
| [Trilium](templates/triliumnext/trilium/manifest.json) · [项目](https://github.com/TriliumNext/Trilium) | 用树状层级、标签和链接组织个人笔记，支持富文本、附件、画布与脚本扩展，并可与兼容版本的桌面客户端同步。 | 2026-11-04 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [VERT](templates/vert-sh/vert/manifest.json) · [项目](https://github.com/VERT-sh/VERT) | 提供图像、音频、文档和视频格式转换界面，多数转换在浏览器本地执行；部分视频操作可对接独立转换服务。 | 2026-10-20 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Vikunja](templates/go-vikunja/vikunja/manifest.json) · [项目](https://github.com/go-vikunja/vikunja) | 自建任务与项目管理空间，安排待办事项和协作计划；另提供托管版，以及包含管理和审计能力的 Pro 版本。 | 2026-11-04 | 公开源码；AGPL-3.0-or-later | 可选付费服务或功能 | amd64, arm64 |
| [wallabag](templates/wallabag/wallabag/manifest.json) · [项目](https://github.com/wallabag/wallabag) | 将网页正文保存到个人稍后读列表，过滤阅读干扰，并通过浏览器扩展和移动客户端继续阅读。 | 2026-11-03 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Wallos](templates/ellite/wallos/manifest.json) · [项目](https://github.com/ellite/Wallos) | 集中记录会员、订阅和其他周期性支出，按币种与分类查看费用，并在续费或取消日期前接收提醒。 | 2026-11-01 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |

### 影音

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [Calibre-Web Automated](templates/crocodilestick/calibre-web-automated/manifest.json) · [项目](https://github.com/crocodilestick/Calibre-Web-Automated) | 为家庭电子书建立可检索的在线书库，自动处理投递目录中的新书、转换格式并推送至阅读器；正式书库与待处理文件分开保存。 | 2026-10-01 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Music Assistant](templates/music-assistant/music-assistant/manifest.json) · [项目](https://github.com/music-assistant/server) | 连接本地曲库、流媒体来源与家中的播放设备，统一浏览音乐和管理播放队列，并支持兼容设备的多房间播放。 | 2026-11-06 | 公开源码；Apache-2.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Audiobookshelf](templates/advplyr/audiobookshelf/manifest.json) · [项目](https://github.com/advplyr/audiobookshelf) | 管理有声书和播客，补充媒体信息并在多个设备之间同步播放进度，也可订阅节目并自动下载新内容。 | 2026-11-01 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [DIAN115 + PostgreSQL 基础版](templates/madbrolab/dian115-basic/manifest.json) · [项目](https://github.com/madbrolab/dian115) | 管理 115 网盘资源、媒体整理、STRM 与影音服务接入。主程序采用私有授权，需要激活密钥；此基础配置配套 PostgreSQL 18。 | 2026-11-04 | 闭源；Proprietary / private activation license | 需要付费授权 | amd64, arm64 |
| [Emby Server 基础版](templates/emby/embyserver-basic/manifest.json) · [项目](https://emby.media/) | 整理并串流自己的影视与音乐收藏，向浏览器和客户端提供媒体库。此模板采用官方镜像，部分客户端和高级功能需要 Emby Premiere。 | 2026-10-31 | 闭源；Proprietary (current Emby Server) | 可选付费服务或功能 | amd64, arm64 |
| [Feishin](templates/jeffvli/feishin/manifest.json) · [项目](https://github.com/jeffvli/feishin) | 为已有 Navidrome、Jellyfin 或 Subsonic 音乐服务提供网页播放器，支持歌词、收藏与播放列表；音乐文件由所连接的服务管理。 | 2026-11-03 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Immich](templates/immich-app/immich/manifest.json) · [项目](https://github.com/immich-app/immich) | 备份和浏览自己的照片、视频，支持手机上传、相册分享、地图与人物检索；模板包含 CPU 机器学习服务和配套数据库。 | 2026-11-04 | 公开源码；AGPL-3.0 | README 未明确 | amd64, arm64 |
| [IPTV 工具箱](templates/taksssss/iptv-tool/manifest.json) · [项目](https://github.com/taksssss/iptv-tool) | 统一整理节目单、频道台标与直播列表，按播放客户端需要输出不同格式，并支持频道匹配、定时更新和访问控制。 | 2026-10-22 | 公开源码；GPL-2.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Jellyfin](templates/linuxserver/jellyfin/manifest.json) · [项目](https://github.com/jellyfin/jellyfin) | 媒体库管理与播放，配置目录和媒体目录分开挂载。 | 2026-11-03 | 公开源码；GPL-2.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Komga](templates/gotson/komga/manifest.json) · [项目](https://github.com/gotson/komga) | 把漫画、杂志和电子书目录整理为个人阅读库，提供网页阅读、合集、阅读进度以及 OPDS 和阅读器同步。 | 2026-11-04 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [MoviePilot v2 + PostgreSQL + Redis 基础版](templates/jxxghp/moviepilot-basic/manifest.json) · [项目](https://github.com/jxxghp/MoviePilot) | 组织影视订阅、搜索、下载和入库流程，可接入下载器、媒体服务与插件。项目声明不收费；此基础配置包含 PostgreSQL 与 Redis。 | 2026-11-04 | 源码状态未知；GPL-3.0 with noncommercial README terms | 自建无必需付费密钥 | amd64, arm64 |
| [Music Tag Web](templates/xhongc/music-tag-web/manifest.json) · [项目](https://github.com/xhongc/music-tag-web) | 在浏览器中整理服务器曲库，批量修改歌曲标签、匹配封面与歌词，并按音乐信息归档文件。README 附有非商业使用限制。 | 2026-10-08 | 源码状态未知；GPL-3.0 with additional README restrictions | README 未明确 | amd64, arm64 |
| [Navidrome 基础版](templates/navidrome/navidrome-basic/manifest.json) · [项目](https://github.com/navidrome/navidrome) | 把本地音乐目录整理为可在浏览器和 Subsonic 客户端访问的个人曲库，支持用户、歌单与播放记录。模板默认每小时扫描一次。 | 2026-11-03 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [QM-Music](templates/chenqimiao/qm-music/manifest.json) · [项目](https://github.com/chenqimiao/qm-music) | 将本地曲库作为兼容 Subsonic 客户端的私有音乐服务，可连接元数据服务并维护媒体缓存。README 同时写有非商业限制。 | 2026-09-10 | 源码状态未知；Apache-2.0 with noncommercial README terms | README 未明确 | amd64, arm64 |
| [Seerr](templates/seerr-team/seerr/manifest.json) · [项目](https://github.com/seerr-team/seerr) | 为家庭媒体库收集电影和剧集申请，关联媒体服务器及自动整理工具，集中处理申请审批、权限和通知。 | 2026-11-04 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Simple SQ Music Plus](templates/59799517/simple-sq-music-plus/manifest.json) · [项目](https://github.com/59799517/simple_sq_music_plus) | 管理音乐搜索与下载任务，将歌曲、歌词和标签按媒体库需要组织到本地目录。README 限定学习用途，未明确通用开源许可。 | 2026-10-30 | 源码状态未知；Unspecified; noncommercial README terms | README 未明确 | amd64 |

### 游戏

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [BeiDou Server](templates/beidoums/beidou-server/manifest.json) · [项目](https://github.com/BeiDouMS/BeiDou-Server) | 基于 Cosmic 持续开发的游戏服务端及管理界面，包含数据库初始化、多语言资源支持与管理 API。 | 2026-10-29 | 公开源码；AGPL-3.0 | README 未明确 | amd64, arm64 |
| [RomM](templates/rommapp/romm/manifest.json) · [项目](https://github.com/rommapp/romm) | 为自己的游戏 ROM 建立带封面和元数据的资料库，支持网页游玩、存档与状态管理，并可对接多种游戏资料服务。 | 2026-11-04 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |

### 网站

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [WordPress + MariaDB](templates/official/wordpress-mariadb/manifest.json) · [项目](https://github.com/WordPress/WordPress) | 博客网站和独立数据库，数据库仅在项目网络中访问。 | 2026-11-04 | 公开源码；GPL-2.0-or-later | 自建无必需付费密钥 | amd64, arm64 |

### 下载

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [MeTube](templates/alexta69/metube/manifest.json) · [项目](https://github.com/alexta69/metube) | 为 yt-dlp 提供网页任务界面，将视频、音频、字幕或播放列表下载到服务器，并按任务选择格式与保存位置。 | 2026-11-01 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [qBittorrent 基础版](templates/linuxserver/qbittorrent-basic/manifest.json) · [项目](https://github.com/qbittorrent/qBittorrent) | 通过网页管理 BitTorrent 下载任务、队列与做种。此模板采用 LinuxServer.io 镜像，分别持久化设置和下载文件。 | 2026-11-03 | 公开源码；GPL-2.0-or-later | 自建无必需付费密钥 | amd64, arm64 |
| [Transmission 基础版](templates/linuxserver/transmission-basic/manifest.json) · [项目](https://github.com/transmission/transmission) | 提供网页和 RPC 入口的 BitTorrent 下载服务，可管理下载、做种及自动监视目录。模板采用 LinuxServer.io 镜像。 | 2026-11-02 | 公开源码；GPL-2.0-or-later | 自建无必需付费密钥 | amd64, arm64 |

### 存储

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [CloudDrive2 基础版](templates/cloudnas/clouddrive2-basic/manifest.json) · [项目](https://www.clouddrive2.com/) | 将多个云盘接入服务器并以本地文件系统挂载，供媒体服务或文件工具访问。产品提供基础能力与付费会员功能。 | 2026-10-17 | 闭源；Proprietary | 可选付费服务或功能 | amd64, arm64 |
| [CloudSaver](templates/jiangrui1994/cloudsaver/manifest.json) · [项目](https://github.com/jiangrui1994/CloudSaver) | 把资源检索、分享链接解析和网盘转存放在同一界面操作。公开源码与较新 Docker 版本存在差异，镜像授权及收费情况需另行确认。 | 2026-10-15 | 源码状态未知；MIT applies to published source only | README 未明确 | amd64, arm64 |
| [FileCodeBox](templates/vastsa/filecodebox/manifest.json) · [项目](https://github.com/vastsa/FileCodeBox) | 通过取件码分享文件和文本，可设置有效期、下载次数并自动清理过期内容，支持本地存储及多种外部存储接入。 | 2026-10-27 | 公开源码；LGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Nextcloud](templates/nextcloud/nextcloud/manifest.json) · [项目](https://github.com/nextcloud/server) | 建立个人和家庭文件云盘，通过网页、桌面与手机同步文件，分享资料，并按需安装日历、通讯录等应用。社区版可自建，企业支持另有方案。 | 2026-11-04 | 公开源码；AGPL-3.0 | 可选付费服务或功能 | amd64, arm64 |
| [OpenList](templates/openlistteam/openlist/manifest.json) · [项目](https://github.com/OpenListTeam/OpenList) | 将多个存储服务组织成统一的文件列表，通过网页访问和管理内容。项目声明现有功能免费提供。 | 2026-11-04 | 公开源码；AGPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |
| [PanSou](templates/fish2018/pansou/manifest.json) · [项目](https://github.com/fish2018/pansou) | 按网盘类型汇集频道和插件的搜索结果，通过并发检索与缓存减少等待，并提供网页操作入口。 | 2026-10-12 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |
| [Syncthing](templates/syncthing/syncthing/manifest.json) · [项目](https://github.com/syncthing/syncthing) | 在自己的电脑、手机和 NAS 之间持续同步文件，可逐个目录选择设备与同步方式，支持文件版本保留和局域网发现。 | 2026-11-02 | 公开源码；MPL-2.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Xiaomi Album Syncer](templates/coooolfan/xiaomi-album-syncer/manifest.json) · [项目](https://github.com/Coooolfan/XiaomiAlbumSyncer) | 把小米云相册及 iCloud 照片保存到本地，支持多账号、增量同步与定时下载，便于集中管理云端影像。 | 2026-11-02 | 公开源码；GPL-3.0 | 自建无必需付费密钥 | amd64, arm64 |

### 开发

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [Gitea + PostgreSQL](templates/gitea/gitea-postgresql/manifest.json) · [项目](https://github.com/go-gitea/gitea) | 轻量 Git 托管平台，搭配 PostgreSQL 数据库。 | 2026-11-04 | 公开源码；MIT | 自建无必需付费密钥 | amd64, arm64 |

### AI

| 应用 | 用途 | 最近更新 | 源码与许可 | 收费授权 | 架构 |
| --- | --- | --- | --- | --- | --- |
| [DeepTutor](templates/hkuds/deeptutor/manifest.json) · [项目](https://github.com/HKUDS/DeepTutor) | 围绕个人资料构建学习工作区，结合知识库检索、辅导问答与学习任务辅助理解内容。项目声明没有付费在线产品。 | 2026-10-31 | 公开源码；Apache-2.0 | 自建无必需付费密钥 | amd64, arm64 |
| [Magpie](templates/yetone/magpie/manifest.json) · [项目](https://github.com/yetone/magpie) | 为编程助手提供统一模型网关、渠道配置与路由切换 | 2026-11-05 | 公开源码；MIT | 自建无必需付费密钥；模型费用由渠道决定 | amd64, arm64 |
| [NextChat](templates/chatgptnextweb/nextchat/manifest.json) · [项目](https://github.com/ChatGPTNextWeb/NextChat) | 提供可自建的多模型对话界面，支持常见模型渠道及桌面使用方式，并提供可选企业定制与私有部署服务。 | 2026-10-20 | 公开源码；MIT | 可选付费服务或功能 | amd64, arm64 |
| [Open WebUI](templates/open-webui/open-webui/manifest.json) · [项目](https://github.com/open-webui/open-webui) | 为本地与兼容 API 的模型提供统一对话入口，可在自建环境管理资料和交互；许可要求保留品牌，另有企业服务。 | 2026-11-03 | 源码状态未知；Open WebUI License with branding requirements | 可选付费服务或功能 | amd64, arm64 |

## 部署提示

- Calibre-Web Automated 默认 8083，初始账号 `admin / admin123`。投递目录中的文件处理后会移除，必须与正式书库分开。
- Karakeep 包含网页抓取浏览器和搜索服务；填写真实访问地址、会话密钥与搜索密钥，首次访问注册账号。Yuvomi 的数据库加密密钥须单独保存，已有数据库不能随意换密钥。
- ezBookkeeping 使用 PostgreSQL 17，默认 8080；填写真实访问地址、数据库密码与实例密钥。Ghostfolio 使用 PostgreSQL 15 和 Redis，默认 3333，第一个账号为管理员。
- Music Assistant 使用 Host 网络，网页默认 8095、音频流默认 8097，部署前确认端口空闲；网页端口在应用设置中调整。Excalidraw 的绘图默认保存在浏览器本地，重要内容请导出文件。
- AdventureLog 默认 8015，包含支持双架构的 PostGIS 16，初始账号 `admin / admin`；首次启动需等待地理资料初始化。Gramps Web 默认 80，首次按向导创建家谱拥有者账号。
- Manyfold Solo 默认 3214，添加文件系统模型库时填写 `/models`。Spoolman 默认 7912，无内置账号认证，PUID 不能为 0；两者均带目录权限准备任务，只调整挂载目录本身。
- ConvertX 默认 3000，默认关闭公开注册，首次访问仍可创建首个账号；内网 HTTP 已启用，转换结果会按应用策略清理。多个模板可能使用相同默认端口，应按实际部署调整。

- Magpie 默认网关 3425、网页 3430。填写实际网关地址及网页密钥后，使用 `http://NAS地址:3430/?k=网页密钥` 首次登录，再添加模型渠道并创建客户端网关密钥；配置目录自动初始化为 UID/GID 65532。

项目数据默认使用模板中的通用目录。以 `./` 开头的路径属于当前 Compose 所在目录；多个应用需要共享资料时，应选择同一个宿主机实际目录。数据库密码和实例密钥留空时，必须填写后才能部署；模板不会替用户生成真实凭据。

- Paperless-ngx 包含 PostgreSQL 18 与 Valkey，默认识别简体中文和英文。首次启动安装中文 OCR 包，导入目录用于自动消费文档，应与原始资料库区分。
- Mealie 包含 PostgreSQL 17，默认入口 9925。首次使用 `changeme@example.com / MyPassword` 登录，再修改邮箱与密码。
- Syncthing 使用 Host 网络，网页默认 8384。首次设置网页认证，再添加设备和容器内 `/sync` 目录；准备服务只设置挂载目录本身的属主。
- Trilium 默认固定 v0.106.1，网页默认 8084；桌面同步前核对版本兼容性。Omni-tools 默认 8089，无需数据库和持久化目录。
- LubeLogger 默认 8086；首次进入 Settings，启用 Enable Authentication 并设置自己的账号。`./data` 和 `./keys` 均需保留。
- Nextcloud 使用 Apache 镜像、MariaDB、Redis 及同版本 cron 服务，默认 8088。填写真实 IP/域名为受信任地址；域名不带协议，多个地址以空格分隔。
- Home Assistant 使用 Container 版与 Host 网络，默认 8123，首次访问创建账号。它不含 Supervisor 与应用商店；蓝牙依赖宿主 D-Bus，USB 网关按实际硬件配置。
- Immich 默认稳定版 v3.3.5，配套向量数据库和 CPU 机器学习服务；照片、数据库与模型缓存分别持久化，数据库应放在本机磁盘。
- DIAN115 基础版使用 PostgreSQL 18，数据库绑定 `/var/lib/postgresql`，通过回环端口 15432 连接。模板用于新装；已有低版本数据库按官方跨版本流程迁移。
- MoviePilot 与下载器分别安装时，选择相同的宿主机下载目录并保持容器内 `/downloads` 一致。CloudDrive2 发布目录需支持 shared 挂载传播，其他消费者使用同一宿主目录接收。
- Homebox、RomM、Penpot 等实例的随机密钥应长期保留。Grocy 首次使用 `admin / admin` 登录后修改密码。Feishin 需要连接已有音乐服务，其地址须能从用户浏览器访问。

图标使用各项目的官方资源或适合其用途的语义图标，许可声明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。项目维护时间、资源校验值及已核对的镜像架构保存在对应 manifest 中。应用许可证、用途条款与可选付费功能以各自项目说明为准。
