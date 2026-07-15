# 狐妖小红娘·王权篇媒体触发测试

当前版本：v1.2.0。

后续 Agent 接手前请先阅读 [AGENT_HANDOFF.md](./AGENT_HANDOFF.md)。其中记录了变量契约、EJS 双条件路由、状态栏架构、部署注意事项和当前验证结果。

这是一个最小可跑测试包：玩家以 `{{user}}` 扮演王权富贵；LLM 分别判断 MVU 剧情阶段与清瞳好感度，EJS 以“阶段 × 好感度”双条件控制清瞳人设；常驻脚本监听阶段变化，在整个 SillyTavern 页面最上层显示两类弹幕并播放音乐。消息楼层内另有自适应状态栏。

## 目录

- `config/media-assets.json`：唯一媒体地址配置入口。以后切换 Cloudflare R2 时只改这里。
- `src/`：MVU 加载器、Schema、状态栏与媒体控制器源代码。
- `worldbook/`：剧情阶段、更新规则和 InitVar 源文件。
- `scripts/build-components.mjs`：生成可导入 JSON。
- `scripts/deploy-to-sillytavern.mjs`：生成新角色卡并绑定世界书、脚本和正则，再部署到本机酒馆。
- `tools/local-media-server.mjs`：测试用本地静态资源服务器。
- `dist/`：构建后可直接导入 SillyTavern/酒馆助手的文件。

## 构建

在本目录运行：

```powershell
node .\scripts\build-components.mjs
node .\scripts\validate-components.mjs
```

## 本地音乐测试

保持终端窗口开启：

```powershell
node .\tools\local-media-server.mjs
```

默认地址是 `http://127.0.0.1:8123/`。脚本会从该地址读取 `音乐/呦猫UNEKO - 梦回还.mp3`。

浏览器首次自动播放可能被拦截。脚本会在页面中央显示“点击启用音乐”，玩家点击一次即可授权；点击“停止音乐”也会清理尚未处理的授权提示。

## 部署新角色卡到本机酒馆

```powershell
node .\scripts\deploy-to-sillytavern.mjs "D:\json脚本地下城\主体\SillyTavern"
```

该命令会创建并安装 `狐妖小红娘·王权篇·沉浸测试.png`，同时安装同名绑定世界书。覆盖旧测试版本前会自动备份到 `backups/时间戳/`。

## 导入顺序

1. 在世界书页面导入 `dist/01-王权篇测试世界书.json`，确认 `[InitVar]王权篇变量初始化勿开` 保持禁用。
2. 在“酒馆助手 → 脚本库”依次导入 `02` 至 `06`。
3. 已经有 MVU 加载器时，不要重复启用 `02-王权篇MVU加载器`。
4. 重载脚本并新建聊天，让 MVU 走标准 InitVar 初始化流程。

脚本库按钮提供：测试右移弹幕、测试中央弹幕、测试音乐、停止音乐、重置媒体触发。

## 切换到 Cloudflare R2

只修改 `config/media-assets.json`：

```json
{
  "assetBaseUrl": "https://你的公开R2域名/王权篇/",
  "tracks": {
    "dream_return": {
      "src": "bgm/dream-return.mp3"
    }
  }
}
```

保留其他曲目设置，重新运行构建命令。若使用独立脚本库，只重导 `dist/04-王权篇媒体资源配置.json`；若使用本项目生成的绑定角色卡，再运行部署命令即可，控制器源码无需修改。

## 阶段触发

测试剧情共六阶段：

1. `00_序章_道门兵人`
2. `01_任务_蛛网疑影`
3. `02_初遇_笼中清瞳`
4. `03_相知_画中山河`
5. `04_决裂_出逃山庄`
6. `05_尾声_万水千山`

同一聊天内每个阶段默认只自动触发一次。需要重测时点击“重置媒体触发”。
