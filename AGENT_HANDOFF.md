# 狐妖小红娘·王权篇项目 Agent 交接文档

最后更新：2026-07-15  
当前角色卡版本：v1.2.0  
项目目录：`hyxhn`  
角色卡名称：`狐妖小红娘·王权篇·沉浸测试`

## 1. 项目目标与范围

本项目是一张 SillyTavern 酒馆助手 MVU 角色卡测试工程，围绕《狐妖小红娘》的王权富贵与清瞳篇展开。

当前已实现：

- 玩家以 `{{user}}` 扮演王权富贵，禁止把王权富贵另写成与玩家并存的 NPC。
- 六阶段剧情进度，由 MVU `剧情.当前阶段` 记录。
- 清瞳好感度独立于剧情阶段更新。
- EJS 使用“剧情阶段 × 好感度”双条件控制清瞳人设。
- 剧情阶段变化触发酒馆页面顶层弹幕和背景音乐。
- 消息楼层内显示响应式状态栏：阶段、时间、地点、清瞳状态、好感度和心声。
- 本地音乐地址与未来 Cloudflare R2 地址通过独立配置切换。

仓库只包含本角色卡工程及音乐文件。`D:\json脚本地下城\主体\SillyTavern` 是本机测试宿主，不属于本仓库，禁止复制或提交。

## 2. 必须保持的产品约束

### 玩家身份

- `{{user}}` 始终代表王权富贵本人。
- 不硬编码酒馆当前玩家名。
- 不代写 `{{user}}` 的内心、台词和未声明行动。

### 唯一变量结构

Schema 是变量结构的唯一事实源，当前只允许以下六项数据：

```yaml
剧情:
  当前阶段: string enum
  时间: string
  地点: string
清瞳:
  状态: string
  好感度: integer 0..100
  心声: string
```

禁止新增背包、任务、战斗、经济、玩家属性或事件流水等字段，除非用户重新确认需求。

### 六个剧情阶段

1. `00_序章_道门兵人`
2. `01_任务_蛛网疑影`
3. `02_初遇_笼中清瞳`
4. `03_相知_画中山河`
5. `04_决裂_出逃山庄`
6. `05_尾声_万水千山`

每轮最多推进一个相邻阶段。阶段只代表事件进度，不代表感情进度。

### 清瞳好感度分档

- `0–19`：疏离 / 警戒
- `20–39`：试探 / 有限合作
- `40–59`：信任 / 同伴
- `60–79`：亲近 / 牵挂
- `80–100`：深情 / 相守

普通一轮最多变化 `-5..+5`，重大事件最多 `-15..+15`。好感度不得因为阶段推进自动增加。

EJS 中已有两类关键修正，后续修改不得删除：

- 低好感进入相知、出逃或尾声时，关系仍可保持疏离、合作或分别，禁止自动恋爱。
- 高好感处在早期阶段时，仍受经历门槛限制，禁止提前使用恋人关系和共同余生表述。

## 3. 目录和核心文件

```text
config/
  media-assets.json              唯一媒体地址配置入口
src/
  mvu-loader.js                  MVU 主/备 CDN 加载
  mvu-schema.js                  Zod Schema
  media-config.js                构建时注入媒体配置
  media-controller.js            顶层弹幕、音乐与测试按钮
  statusbar.html                 状态栏静态模板
  statusbar-controller.js        Shadow DOM 状态栏渲染器
worldbook/
  00-initvar.yaml                初始变量，世界书中必须保持禁用
  10-update-rules.txt            RFC 6902 变量更新规则
  20-current-variables.txt       无前缀 EJS 当前变量读取条目
  30-plot-guide.txt              演绎与玩家身份约束
  40-stage-outline.txt           六阶段剧情骨架
  50-stage-persona.ejs           阶段 × 好感度清瞳人设控制器
  60-statusbar-protocol.txt      每轮状态栏占位符输出协议
scripts/
  build-components.mjs           构建六个可导入 JSON
  validate-components.mjs        静态一致性验证
  deploy-to-sillytavern.mjs      打包 PNG 并部署到本机酒馆
tools/
  local-media-server.mjs         本地 MP3 静态服务
音乐/
  呦猫UNEKO - 梦回还.mp3         当前测试 BGM
dist/
  01..06 JSON                    可独立导入的世界书/脚本
  06-狐妖小红娘·王权篇·沉浸测试.png  可直接导入的完整角色卡
```

## 4. 世界书、脚本和正则绑定

完整卡内应包含：

- 世界书：7 条。
- 酒馆助手脚本：5 支。
- scoped 正则：4 条。

世界书关键规则：

- `[InitVar]王权篇变量初始化勿开` 必须 `enabled=false`。
- `王权篇当前变量` 必须无 `[mvu_plot]` 或 `[mvu_update]` 前缀。
- EJS 条目使用 `@@private`，允许安全声明 `const` / `let`。
- 世界书 JSON 的 `entries` 键必须等于对应字符串化 `uid`。

正则顺序：

1. `01-显示隐藏变量更新`
2. `02-对AI隐藏变量更新`
3. `03-显示王权篇状态栏`
4. `04-对AI隐藏状态栏占位符`

状态栏正则只生成 `<div data-hyxhn-statusbar-mount></div>`。常驻状态栏控制器再通过 Shadow DOM 渲染 UI。不要改回正则生成 HTML 代码块：当前 TavernHelper 环境会把那种结果直接显示成代码。

## 5. 媒体系统

当前本地配置位于 `config/media-assets.json`：

```json
{
  "assetBaseUrl": "http://127.0.0.1:8123/"
}
```

本地测试时运行：

```powershell
node .\tools\local-media-server.mjs
```

未来迁移 Cloudflare R2 时，只修改：

- `assetBaseUrl`
- 对应曲目的 `src`

然后重新构建和部署。不要把 R2 地址直接写进 `media-controller.js`。

浏览器的自动播放策略可能阻止首次播放，媒体控制器会提供“点击启用音乐”授权按钮。

## 6. 构建、验证与部署

在项目根目录运行：

```powershell
node .\scripts\build-components.mjs
node .\scripts\validate-components.mjs
```

验证器当前检查：

- 六个 JSON 构建产物可解析且字段完整。
- 世界书 7 条、uid 对齐、InitVar 禁用、双禁递归。
- 六阶段枚举与媒体映射一致。
- 好感度约束及阶段 × 好感度 EJS 修正存在。
- 状态栏使用 scoped 挂载点与 Shadow DOM。
- 媒体配置未写死本机项目路径，MP3 文件存在。

本机部署命令：

```powershell
node .\scripts\deploy-to-sillytavern.mjs "D:\json脚本地下城\主体\SillyTavern"
```

部署器会：

- 备份已有同名卡与世界书到本地 `backups/`。
- 生成完整 PNG 角色卡。
- 把世界书、脚本和正则绑定进卡。
- 将角色卡与独立世界书复制到本机 SillyTavern。

部署后必须刷新酒馆并新建聊天。旧聊天不会重新执行新版 InitVar 或替换旧开场白。

已知部署坑：当前 SillyTavern 的同名 `/api/characters/import` 流程曾保留旧卡顶层字段，只更新部分嵌入内容。开发阶段优先使用本项目部署脚本，并在酒馆角色列表确认版本号为 `1.2.0`。

## 7. 修改变量时的同步链

任何变量字段调整必须同步修改：

1. `src/mvu-schema.js`
2. `worldbook/00-initvar.yaml`
3. `worldbook/10-update-rules.txt`
4. `worldbook/20-current-variables.txt`
5. `worldbook/50-stage-persona.ejs`（如涉及人设）
6. `src/statusbar.html`
7. `src/statusbar-controller.js`
8. 相关媒体或剧情脚本
9. 构建与验证断言

Schema 未同步时，可能出现字段被静默丢弃、状态栏读取旧路径或 LLM 生成无效 JSONPatch。

## 8. 当前验证结果

最后一次验证已确认：

- 构建、JSON 解析和项目验证全部通过。
- 完整卡实际包含 7 条世界书、5 支脚本、4 条正则。
- 酒馆真机状态栏成功显示：`序章 · 道门兵人 / 暮色将临 / 王权山庄·演武场 / 好感 5`。
- 状态栏没有代码块外露。
- 尾声阶段好感度为 5 时输出“低好感后期修正”。
- 尾声阶段好感度为 85 时启用“深情 / 相守”层。
- 顶层弹幕此前已验证可在桌面与窄窗口显示。

## 9. 后续建议

优先级建议：

1. 用真实模型进行多轮 MVU 推进测试，检查 JSONPatch 的稳定性。
2. 分别测试绝情线、同伴线与恋爱线，确认 EJS 人设差异自然。
3. 把 MP3 迁移到 Cloudflare R2，再只替换媒体配置。
4. 后续再增加剧情图片与图床资源，不要把大体积 base64 图片直接塞进消息和角色卡。

接手 Agent 在改动前必须先阅读 `tavern-card-builder` skill，并以本项目已验证实现和当前 SillyTavern 运行时为准。
