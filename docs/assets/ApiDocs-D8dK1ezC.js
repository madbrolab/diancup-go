import{as as f}from"./admin-Y5YGx8Is.js";import{k as v,N as b,R as y,S as P}from"./vue-vendor-BrPN2j-G.js";import"./modulepreload-polyfill-C4grpNmD.js";import"./liquid-CokGqe3f.js";import"./naive-ui-BiR2drVe.js";function e(s,h){s=s-152;const o=_();let a=o[s];if(e.bYAZaY===void 0){var i=function(p){const u="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";let t="",d="";for(let n=0,r,x,l=0;x=p.charAt(l++);~x&&(r=n%4?r*64+x:x,n++%4)?t+=String.fromCharCode(255&r>>(-2*n&6)):0)x=u.indexOf(x);for(let n=0,r=t.length;n<r;n++)d+="%"+("00"+t.charCodeAt(n).toString(16)).slice(-2);return decodeURIComponent(d)};const g=function(p,u){let t=[],d=0,n,r="";p=i(p);let x;for(x=0;x<256;x++)t[x]=x;for(x=0;x<256;x++)d=(d+t[x]+u.charCodeAt(x%u.length))%256,n=t[x],t[x]=t[d],t[d]=n;x=0,d=0;for(let l=0;l<p.length;l++)x=(x+1)%256,d=(d+t[x])%256,n=t[x],t[x]=t[d],t[d]=n,r+=String.fromCharCode(p.charCodeAt(l)^t[(t[x]+t[d])%256]);return r};e.SgnQOH=g,e.XIoGID={},e.bYAZaY=!0}const c=o[0];e.WFsevE!==c&&(e.XIoGID={},e.WFsevE=c);const m=e.XIoGID[s];return m===void 0?(e.vEPonJ===void 0&&(e.vEPonJ=!0),a=e.SgnQOH(a,h),e.XIoGID[s]=a):a=m,a}(function(s,h){const o=s();function a(i,c){return e(i- -392,c)}for(;;)try{if(-parseInt(a(-234,")))l"))/1+parseInt(a(-238,"wi5F"))/2+-parseInt(a(-240,")F0r"))/3+parseInt(a(-239,"SHOH"))/4+parseInt(a(-225,"6$Vr"))/5*(parseInt(a(-237,"V&5z"))/6)+-parseInt(a(-229,")OuP"))/7*(parseInt(a(-226,"p*D["))/8)+-parseInt(a(-223,"C7Dm"))/9*(parseInt(a(-236,"i@$8"))/10)===h)break;o.push(o.shift())}catch{o.push(o.shift())}})(_,751709);function _(){const s=["WQCOWOxdP3JcNSkTy8klW6LBW5NdOa","Cmkyi8o/WQOLmSoCwhtdQSk9","sCk5W5bgfCkNmCoP","WRhcPCk3jXT6WPpcMG","WOFcMmo/q25tW6zW","W6VdJmkAWQWRt8kOWOxcUmkZWQXWWQq","pmorbCkkW7ZdLbxcNCkpFmoaWPC","WRxcQCoRzf1GWRlcISoVWPhdPG","jdjrW7iDW6rcW6/dICkWsCk+W7a","Dx0ghLSRW6ldUmkUmgP+W5C","ACogWQijkHhcJqGMWOyNjW","gSovW4/dKCkHA2v2","iZTmBMhdGdOkWRZdQa","W7TxW6pdTdCOla","W43cJmkfxmoCacZdL8oHWPOKWOG","W7ddSbzdt8kHmI/dLJRdGq","i8oNWPBcT8oeomoTCCoSWOG","6k+R6k2y5PA55B2Y44g25AYZ5zUi562W55cI5lMS6zAJ5ygk5PUP5PA75O+P5y6/772y6zQ86k6J5Rgz5zkx5zkH5BQI56AK5l2p44ck"];return _=function(){return s},_()}const I=`<div class="container">
  <!-- 顶部 -->
  <div class="document-intro">
    <h1>API 使用文档</h1>
    <div class="subtitle">DIANCUP RESTful API</div>
    <div class="quick-nav">
      <a href="#auth"><i class="ri-key-fill"></i> 认证</a>
      <a href="#containers">🐳 容器列表</a>
      <a href="#check">🔍 检查更新</a>
      <a href="#update">🔄 更新容器</a>
      <a href="#auto">⏰ 自动更新</a>
      <a href="#logs">📋 日志</a>
      <a href="#examples"><i class="ri-lightbulb-flash-fill"></i> 示例</a>
    </div>
  </div>

  <!-- 基础信息 -->
  <h2 id="intro">简介</h2>
  <p>
    本文档介绍 DIANCUP
    的常用容器与更新接口，包含认证方式、请求参数和响应示例。使用 API
    密钥前，请先在系统设置中开启 API 访问。
  </p>

  <div class="note">
    <strong>基础URL：</strong>
    <code>http://your-nas-ip:5000</code>
    <br />
    <strong>响应格式：</strong> JSON
    <br />
    <strong>字符编码：</strong> UTF-8
  </div>

  <!-- 认证方式 -->
  <h2 id="auth">认证方式</h2>

  <h3>API Key 认证</h3>
  <p>在所有API请求的HTTP Header中添加以下字段：</p>

  <pre data-lang="http"><code>X-API-Key: YOUR_API_KEY_HERE</code></pre>

  <h4>获取API Key</h4>
  <ol>
    <li>登录Web管理界面</li>
    <li>进入「系统设置 → API 管理」</li>
    <li>开启「允许 API 访问」</li>
    <li>点击「生成密钥」，填写用途名称并创建密钥</li>
    <li>立即复制并妥善保存密钥；完整密钥只在创建时显示一次</li>
  </ol>

  <div class="warning">
    <strong>安全建议：</strong>
    <ul>
      <li>请勿将API Key硬编码在公开的代码仓库中</li>
      <li>建议使用环境变量或配置文件管理API Key</li>
      <li>如发现密钥泄露，请立即删除该密钥并生成替代密钥</li>
      <li>可在 API 管理中停用或删除不再使用的密钥</li>
    </ul>
  </div>

  <h4>认证失败响应</h4>
  <pre data-lang="json"><code>{
  "success": false,
  "message": "未授权"
}</code></pre>
  <p>HTTP状态码：<code>401 Unauthorized</code></p>

  <!-- API端点 -->
  <h2 id="endpoints">API 端点</h2>

  <!-- 1. 获取容器列表 -->
  <div class="endpoint" id="containers" data-nav-title="获取容器列表">
    <h3>获取容器列表</h3>
    <div class="endpoint-header">
      <span class="method GET">GET</span>
      <span class="endpoint-path">/api/containers</span>
    </div>
    <div class="endpoint-desc">获取系统中所有容器的详细信息列表</div>

    <h4>请求参数</h4>
    <p>无需参数</p>

    <h4>请求示例</h4>
    <pre
      data-lang="bash"
    ><code>curl -X GET http://192.168.1.100:5000/api/containers \\
  -H "X-API-Key: YOUR_API_KEY"</code></pre>

    <h4>响应参数</h4>
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>类型</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>success</code></td>
          <td>boolean</td>
          <td>请求是否成功</td>
        </tr>
        <tr>
          <td><code>data</code></td>
          <td>array</td>
          <td>容器信息数组</td>
        </tr>
        <tr>
          <td><code>data[].id</code></td>
          <td>string</td>
          <td>容器ID（12位短ID）</td>
        </tr>
        <tr>
          <td><code>data[].name</code></td>
          <td>string</td>
          <td>容器名称</td>
        </tr>
        <tr>
          <td><code>data[].image</code></td>
          <td>string</td>
          <td>镜像名称（含标签）</td>
        </tr>
        <tr>
          <td><code>data[].state</code></td>
          <td>string</td>
          <td>运行状态：<code>running</code> 或 <code>stopped</code></td>
        </tr>
        <tr>
          <td><code>data[].has_update</code></td>
          <td>boolean</td>
          <td>是否有可用更新</td>
        </tr>
        <tr>
          <td><code>data[].auto_update</code></td>
          <td>boolean</td>
          <td>是否启用自动更新</td>
        </tr>
        <tr>
          <td><code>last_check</code></td>
          <td>string</td>
          <td>最后检查时间（ISO 8601格式）</td>
        </tr>
      </tbody>
    </table>

    <h4>成功响应示例</h4>
    <pre data-lang="json"><code>{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4e5f6",
      "name": "nginx",
      "image": "nginx:latest",
      "repository": "nginx",
      "tag": "latest",
      "is_latest": true,
      "status": "running",
      "state": "running",
      "created": "2025-01-15T10:30:00.000000000Z",
      "has_update": false,
      "update_status": "up-to-date",
      "auto_update": true
    },
    {
      "id": "f6e5d4c3b2a1",
      "name": "mysql",
      "image": "mysql:8.0",
      "repository": "mysql",
      "tag": "8.0",
      "is_latest": false,
      "status": "running",
      "state": "running",
      "created": "2025-01-14T15:20:00.000000000Z",
      "has_update": false,
      "update_status": "unknown",
      "auto_update": false
    }
  ],
  "last_check": "2025-01-15T12:00:00"
}</code></pre>
  </div>

  <!-- 2. 检查更新 -->
  <div class="endpoint" id="check" data-nav-title="检查镜像更新">
    <h3>检查镜像更新</h3>
    <div class="endpoint-header">
      <span class="method POST">POST</span>
      <span class="endpoint-path">/api/check-updates</span>
    </div>
    <div class="endpoint-desc">检查容器镜像是否有可用更新</div>

    <h4>请求参数</h4>
    <div class="param-list">
      <div class="param-item">
        <span class="param-name">container_name</span>
        <span class="param-type">string</span>
        <span class="param-optional">可选</span>
        <div class="param-desc">
          指定要检查的容器名称。如果不提供，则检查所有容器。
          <br />示例：<code>"nginx"</code>
        </div>
      </div>
    </div>

    <h4>请求示例</h4>
    <pre data-lang="bash"><code># 检查所有容器
curl -X POST http://192.168.1.100:5000/api/check-updates \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{}'

# 检查指定容器
curl -X POST http://192.168.1.100:5000/api/check-updates \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"container_name": "nginx"}'</code></pre>

    <h4>响应参数</h4>
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>类型</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>success</code></td>
          <td>boolean</td>
          <td>请求是否成功</td>
        </tr>
        <tr>
          <td><code>data</code></td>
          <td>array</td>
          <td>检查结果数组</td>
        </tr>
        <tr>
          <td><code>data[].container_id</code></td>
          <td>string</td>
          <td>容器ID</td>
        </tr>
        <tr>
          <td><code>data[].container_name</code></td>
          <td>string</td>
          <td>容器名称</td>
        </tr>
        <tr>
          <td><code>data[].image</code></td>
          <td>string</td>
          <td>镜像名称</td>
        </tr>
        <tr>
          <td><code>data[].local_digest</code></td>
          <td>string</td>
          <td>本地镜像摘要（12位）</td>
        </tr>
        <tr>
          <td><code>data[].remote_digest</code></td>
          <td>string</td>
          <td>远程镜像摘要（12位）</td>
        </tr>
        <tr>
          <td><code>data[].has_update</code></td>
          <td>boolean</td>
          <td>是否有更新</td>
        </tr>
        <tr>
          <td><code>data[].status</code></td>
          <td>string</td>
          <td>更新状态：<code>updatable</code> 或 <code>up-to-date</code></td>
        </tr>
      </tbody>
    </table>

    <h4>成功响应示例</h4>
    <pre data-lang="json"><code>{
  "success": true,
  "data": [
    {
      "container_id": "a1b2c3d4e5f6",
      "container_name": "nginx",
      "image": "nginx:latest",
      "local_digest": "sha256:abc123",
      "remote_digest": "sha256:def456",
      "has_update": true,
      "status": "updatable",
      "check_method": "online"
    },
    {
      "container_id": "f6e5d4c3b2a1",
      "container_name": "redis",
      "image": "redis:latest",
      "local_digest": "sha256:xyz789",
      "remote_digest": "sha256:xyz789",
      "has_update": false,
      "status": "up-to-date",
      "check_method": "online"
    }
  ]
}</code></pre>

    <div class="note">
      <strong>说明：</strong>
      <ul>
        <li>只有标签为 <code>latest</code> 的容器才会被检查</li>
        <li>检查过程会访问Docker镜像仓库，可能需要几秒到几十秒</li>
        <li>如果配置了代理，会自动使用代理访问</li>
      </ul>
    </div>
  </div>

  <!-- 3. 更新容器 -->
  <div class="endpoint" id="update" data-nav-title="更新指定容器">
    <h3>更新指定容器</h3>
    <div class="endpoint-header">
      <span class="method POST">POST</span>
      <span class="endpoint-path">/api/update-container</span>
    </div>
    <div class="endpoint-desc">更新指定容器到最新镜像版本</div>

    <h4>请求参数</h4>
    <div class="param-list">
      <div class="param-item">
        <span class="param-name">container_name</span>
        <span class="param-type">string</span>
        <span class="param-required">必填</span>
        <div class="param-desc">
          要更新的容器名称。
          <br />示例：<code>"nginx"</code>
        </div>
      </div>
    </div>

    <h4>请求示例</h4>
    <pre
      data-lang="bash"
    ><code>curl -X POST http://192.168.1.100:5000/api/update-container \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"container_name": "nginx"}'</code></pre>

    <h4>响应参数</h4>
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>类型</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>success</code></td>
          <td>boolean</td>
          <td>请求是否成功提交</td>
        </tr>
        <tr>
          <td><code>message</code></td>
          <td>string</td>
          <td>响应消息</td>
        </tr>
      </tbody>
    </table>

    <h4>成功响应示例</h4>
    <pre data-lang="json"><code>{
  "success": true,
  "message": "容器 [nginx] 更新任务已启动"
}</code></pre>

    <h4>失败响应示例</h4>
    <pre data-lang="json"><code>{
  "success": false,
  "message": "缺少容器名称"
}</code></pre>

    <div class="warning">
      <strong>重要提示：</strong>
      <ul>
        <li>此接口为异步操作，返回成功仅表示任务已提交</li>
        <li>
          实际更新过程包括：拉取镜像 → 停止容器 → 删除旧容器 → 创建新容器 →
          启动容器
        </li>
        <li>更新进度可通过WebSocket实时获取，或查看日志接口</li>
        <li>更新过程中容器会短暂停止服务</li>
        <li>系统会自动保留原容器的所有配置（环境变量、卷、网络、端口等）</li>
      </ul>
    </div>

    <h4>更新流程说明</h4>
    <ol>
      <li><strong>拉取镜像：</strong>从仓库下载最新版本镜像</li>
      <li><strong>停止容器：</strong>优雅停止（10秒超时），超时则强制停止</li>
      <li><strong>删除旧容器：</strong>删除旧容器实例（保留镜像）</li>
      <li><strong>创建新容器：</strong>使用新镜像创建容器，保留原配置</li>
      <li><strong>启动容器：</strong>启动新容器</li>
      <li><strong>清理镜像：</strong>自动清理悬空的旧镜像</li>
    </ol>
  </div>

  <!-- 4. 自动更新管理 -->
  <div class="endpoint" id="auto" data-nav-title="设置自动更新">
    <h3>设置自动更新</h3>
    <div class="endpoint-header">
      <span class="method POST">POST</span>
      <span class="endpoint-path">/api/toggle-auto-update</span>
    </div>
    <div class="endpoint-desc">启用或禁用指定容器的自动更新功能</div>

    <h4>请求参数</h4>
    <div class="param-list">
      <div class="param-item">
        <span class="param-name">container_name</span>
        <span class="param-type">string</span>
        <span class="param-required">必填</span>
        <div class="param-desc">
          容器名称。
          <br />示例：<code>"nginx"</code>
        </div>
      </div>
      <div class="param-item">
        <span class="param-name">enabled</span>
        <span class="param-type">boolean</span>
        <span class="param-required">必填</span>
        <div class="param-desc">
          是否启用自动更新。
          <br /><code>true</code>：启用，<code>false</code>：禁用
        </div>
      </div>
    </div>

    <h4>请求示例</h4>
    <pre data-lang="bash"><code># 启用自动更新
curl -X POST http://192.168.1.100:5000/api/toggle-auto-update \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "container_name": "nginx",
    "enabled": true
  }'

# 禁用自动更新
curl -X POST http://192.168.1.100:5000/api/toggle-auto-update \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "container_name": "nginx",
    "enabled": false
  }'</code></pre>

    <h4>响应参数</h4>
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>类型</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>success</code></td>
          <td>boolean</td>
          <td>操作是否成功</td>
        </tr>
      </tbody>
    </table>

    <h4>成功响应示例</h4>
    <pre data-lang="json"><code>{
  "success": true
}</code></pre>

    <div class="note">
      <strong>自动更新说明：</strong>
      <ul>
        <li>启用后，系统会按照设定的时间间隔自动检查并更新容器</li>
        <li>更新间隔在"自动更新设置"中配置（默认7天）</li>
        <li>自动更新仅对标签为 <code>latest</code> 的容器生效</li>
      </ul>
    </div>
  </div>

  <!-- 5. 获取日志 -->
  <div class="endpoint" id="logs" data-nav-title="获取系统日志">
    <h3>获取系统日志</h3>
    <div class="endpoint-header">
      <span class="method GET">GET</span>
      <span class="endpoint-path">/api/logs</span>
    </div>
    <div class="endpoint-desc">获取系统操作日志（最近500条）</div>

    <h4>请求参数</h4>
    <p>无需参数</p>

    <h4>请求示例</h4>
    <pre data-lang="bash"><code>curl -X GET http://192.168.1.100:5000/api/logs \\
  -H "X-API-Key: YOUR_API_KEY"</code></pre>

    <h4>响应参数</h4>
    <table>
      <thead>
        <tr>
          <th>字段</th>
          <th>类型</th>
          <th>说明</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>success</code></td>
          <td>boolean</td>
          <td>请求是否成功</td>
        </tr>
        <tr>
          <td><code>data</code></td>
          <td>array</td>
          <td>日志条目数组</td>
        </tr>
        <tr>
          <td><code>data[].timestamp</code></td>
          <td>string</td>
          <td>时间戳</td>
        </tr>
        <tr>
          <td><code>data[].level</code></td>
          <td>string</td>
          <td>日志级别：INFO / SUCCESS / WARNING / ERROR</td>
        </tr>
        <tr>
          <td><code>data[].message</code></td>
          <td>string</td>
          <td>日志内容</td>
        </tr>
        <tr>
          <td><code>data[].type</code></td>
          <td>string</td>
          <td>日志类型：system / realtime / error</td>
        </tr>
        <tr>
          <td><code>count</code></td>
          <td>integer</td>
          <td>日志总数</td>
        </tr>
      </tbody>
    </table>

    <h4>成功响应示例</h4>
    <pre data-lang="json"><code>{
  "success": true,
  "data": [
    {
      "timestamp": "2025-01-15 12:00:00",
      "level": "INFO",
      "message": "🔍 开始检查容器更新（在线模式⚡），共 5 个容器",
      "type": "realtime"
    },
    {
      "timestamp": "2025-01-15 12:00:05",
      "level": "SUCCESS",
      "message": "✅ 检查完成: 共检查 5 个容器，发现 2 个可更新 ⚡",
      "type": "realtime"
    },
    {
      "timestamp": "2025-01-15 12:05:00",
      "level": "INFO",
      "message": "🔄 更新容器: nginx",
      "type": "realtime"
    },
    {
      "timestamp": "2025-01-15 12:05:30",
      "level": "SUCCESS",
      "message": "✅ 容器 [nginx] 更新成功",
      "type": "realtime"
    }
  ],
  "count": 4
}</code></pre>
  </div>

  <!-- 6. 获取系统配置 -->
  <div class="endpoint" id="config" data-nav-title="获取系统配置">
    <h3>获取系统配置</h3>
    <div class="endpoint-header">
      <span class="method GET">GET</span>
      <span class="endpoint-path">/api/config</span>
    </div>
    <div class="endpoint-desc">获取系统当前配置</div>

    <h4>请求示例</h4>
    <pre
      data-lang="bash"
    ><code>curl -X GET http://192.168.1.100:5000/api/config \\
  -H "X-API-Key: YOUR_API_KEY"</code></pre>

    <h4>成功响应示例</h4>
    <pre data-lang="json"><code>{
  "success": true,
  "data": {
    "auto_update_enabled": true,
    "update_interval_days": 7,
    "update_interval_hours": 0,
    "proxy_enabled": false,
    "proxy_host": "",
    "proxy_port": "",
    "auto_update_containers": ["nginx", "redis"],
    "api_enabled": true
  }
}</code></pre>
  </div>

  <!-- 使用示例 -->
  <h2 id="examples">完整使用示例</h2>

  <h3>Python 示例</h3>
  <p>使用 <code>requests</code> 库实现容器自动更新脚本：</p>

  <pre data-lang="python"><code>#!/usr/bin/env python3
import requests
import time

# ===== 配置 =====
API_KEY = "your_api_key_here"
BASE_URL = "http://192.168.1.100:5000"
HEADERS = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

# ===== 函数定义 =====

def get_containers():
    """获取所有容器列表"""
    url = f"{BASE_URL}/api/containers"
    response = requests.get(url, headers=HEADERS)
    
    if response.status_code == 200:
        result = response.json()
        if result["success"]:
            return result["data"]
    return []

def check_updates(container_name=None):
    """检查容器更新"""
    url = f"{BASE_URL}/api/check-updates"
    data = {}
    if container_name:
        data["container_name"] = container_name
    
    response = requests.post(url, headers=HEADERS, json=data)
    
    if response.status_code == 200:
        result = response.json()
        if result["success"]:
            return result["data"]
    return []

def update_container(container_name):
    """更新指定容器"""
    url = f"{BASE_URL}/api/update-container"
    data = {"container_name": container_name}
    
    response = requests.post(url, headers=HEADERS, json=data)
    
    if response.status_code == 200:
        result = response.json()
        return result.get("success", False)
    return False

def enable_auto_update(container_name, enabled=True):
    """启用/禁用自动更新"""
    url = f"{BASE_URL}/api/toggle-auto-update"
    data = {
        "container_name": container_name,
        "enabled": enabled
    }
    
    response = requests.post(url, headers=HEADERS, json=data)
    
    if response.status_code == 200:
        result = response.json()
        return result.get("success", False)
    return False

# ===== 主程序 =====

def main():
    print("=== DIANCUP 容器管理脚本 ===\\n")
    
    # 1. 获取容器列表
    print("📋 获取容器列表...")
    containers = get_containers()
    print(f"✅ 共找到 {len(containers)} 个容器\\n")
    
    for container in containers:
        print(f"  - {container['name']}: {container['state']}")
    
    # 2. 检查所有容器更新
    print("\\n🔍 检查容器更新...")
    updates = check_updates()
    
    updatable = [u for u in updates if u["has_update"]]
    print(f"✅ 发现 {len(updatable)} 个容器可更新\\n")
    
    # 3. 更新所有可更新的容器
    if updatable:
        for update_info in updatable:
            container_name = update_info["container_name"]
            print(f"🔄 更新容器: {container_name}")
            
            if update_container(container_name):
                print(f"✅ {container_name} 更新任务已提交")
                # 等待更新完成（实际应该通过WebSocket监听）
                time.sleep(30)
            else:
                print(f"❌ {container_name} 更新失败")
        
        print("\\n✅ 所有更新任务已完成")
    else:
        print("✅ 所有容器均为最新版本")
    
    # 4. 为所有latest容器启用自动更新
    print("\\n⏰ 配置自动更新...")
    for container in containers:
        if container["is_latest"]:
            name = container["name"]
            if enable_auto_update(name, True):
                print(f"✅ 已为 {name} 启用自动更新")
            else:
                print(f"❌ {name} 自动更新配置失败")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ 脚本执行失败: {e}")
</code></pre>

  <h3>JavaScript / Node.js 示例</h3>
  <p>使用 <code>axios</code> 库实现容器管理：</p>

  <pre data-lang="javascript"><code>// JavaScript示例（简略版）
const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'http://192.168.1.100:5000';

async function updateContainers() {
    const response = await axios.get(\`\${BASE_URL}/api/containers\`, {
        headers: { 'X-API-Key': API_KEY }
    });
    
    const containers = response.data.data;
    console.log(\`发现 \${containers.length} 个容器\`);
    
    // 检查并更新逻辑...
}

updateContainers().catch(console.error);</code></pre>

  <!-- 省略部分类似示例以保持简洁 -->

  <!-- 错误处理 -->
  <h2 id="errors">错误处理</h2>

  <h3>常见HTTP状态码</h3>
  <table>
    <thead>
      <tr>
        <th>状态码</th>
        <th>说明</th>
        <th>解决方案</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>200</code></td>
        <td>请求成功</td>
        <td>正常返回</td>
      </tr>
      <tr>
        <td><code>401</code></td>
        <td>未授权</td>
        <td>检查API Key是否正确</td>
      </tr>
      <tr>
        <td><code>500</code></td>
        <td>服务器内部错误</td>
        <td>查看系统日志</td>
      </tr>
    </tbody>
  </table>

  <!-- 最佳实践 -->
  <h2 id="best">最佳实践</h2>

  <h3>1. API Key 安全管理</h3>
  <pre data-lang="python"><code># 使用环境变量管理密钥
import os
API_KEY = os.getenv("NAS_API_KEY")</code></pre>

  <h3>2. 错误重试机制</h3>
  <pre data-lang="python"><code>import time

def api_call_with_retry(url, max_retries=3):
    for i in range(max_retries):
        try:
            response = requests.get(url, timeout=10)
            return response.json()
        except:
            if i < max_retries - 1:
                time.sleep(2 ** i)
                continue
            raise</code></pre>

  <footer class="footer">DIANCUP · API 参考</footer>
</div>
`,C=v({__name:"ApiDocs",setup(s){return(h,o)=>{function a(i,c){return e(c- -544,i)}return P(),b(f,{title:"API 文档",description:a("dNZQ",-383),content:y(I)},null,8,[a("9nlV",-387)])}}});export{C as default};
