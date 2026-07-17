// 狐妖小红娘·王权篇部署器 v1.72.0
// v1.72.0: 部署去固定主角名版本，所有玩家身份统一由 {{user}} 宏承接。
// v1.71.0: 部署王权剑凝聚插图标记与显示/隐藏正则，并撤销小游戏结束自动插图。
// v1.70.0: 部署弃剑线双回复硬切分，万剑穿心完成前禁止东方月初登场。
// v1.69.0: 部署主模型变量补丁与额外 MVU 复核的双重更新协议，并补强主殿已败露事实承接。
// v1.68.0: 使用独立 1200×900 压缩 WebP 替换结果楼层的临时玩家小图。
// v1.67.0: 部署新回复楼层结果图显示/提示词隐藏正则，并移除死亡暂停字幕。
// v1.66.0: 部署等宽长方形剑身与独立短剑尖的飞弹图样。
// v1.65.0: 部署具备实体剑身、轮廓、刃面渐变与剑脊的飞弹图样。
// v1.64.0: 部署沿飞行方向旋转的发光剑形飞弹。
// v1.63.0: 部署内嵌透明 WebP 玩家角色图与独立小判定点。
// v1.62.0: 部署弹幕海 BGM 单次播放与音频结束硬性停止条件。
// v1.61.0: 部署完整曲长压缩 BGM，并让生成成功、空返、HTTP 错误、异常与中止统一停止视听效果。
// v1.60.0: 部署裁去尾部三分之一并降至 128 kbps 的内嵌 BGM，缩小完整卡体积。
// v1.59.0: 部署内嵌 Base64《梦回还》，弹幕瀑布无需外部音频服务即可播放。
// v1.58.0: 部署无 BGM 的无尽剑幕，并保留弹幕瀑布《梦回还》联动。
// v1.57.0: 部署两条默认关闭、可手动开启的清瞳常驻形态覆写。
// v1.56.0: 部署清瞳完整核心人设与新版关系控制器。
// v1.55.0: 部署恢复字号且每批固定 40 条的高密滚动弹幕瀑布。
// v1.54.0: 部署滚动弹幕瀑布超密模式。
// v1.53.0: 部署更小字号、更密集的滚动弹幕瀑布。
// v1.52.0: 部署卡内候选选项防剧透协议，不修改用户级全局预设。
// v1.51.0: 部署带 UpdateVariable/JSONPatch 双层容器强约束的变量更新规则。
// v1.50.0: 部署轻量常驻大纲与 00 至 02 动态关键细节。
// v1.49.0: 部署六段式携瞳私奔旅程与毒娘子、追猎队、涂山巡守三条绿灯世界书。
// v1.48.0: 部署持剑必胜的三段式王权家夺权短线。
// v1.47.0: 部署蛛丝之外五幕关系修复线与渐进信任结算。
// v1.46.0: 部署持剑固定突围链、深山自由行动与无心之剑配角余波。
// v1.45.0: 部署携瞳远走涂山延伸与三条当前时间线涂山绿灯 NPC。
// v1.44.0: 部署执剑夺权与携瞳远走两条自由主线。
// v1.43.0: 部署黄风城圈外幕后因果与配角后续收束。
// v1.42.0: 部署清瞳卧底真相、关系里程碑、风庭云败露链与非固定对白门槛。
// v1.41.0: 部署偏离承接、关系修复/独立前路、清瞳待填核心人设与山庄日常详案。
// v1.40.0: 大纲降级为可偏离参考轨道，补充清瞳关系门槛、王权霸业父爱动机、风庭云日常与东方月初返场兜底。
// v1.39.0: 部署黄风城至龙湾的十三阶段剧情与按阶段动态详案。
// v1.38.0: 首次绘景补全误判斩丝、花朵揭示、王权家全景织锦与“成为你的眼睛”固定对白。
// v1.37.0: 次日问妖后改为相隔数日初画，补充清瞳绕行山庄寻找最佳绘景角度的过程。
// v1.36.0: 撤回清瞳代写人设并恢复五档空槽位；拔剑弹幕与 BGM 持续到对应回复落地。
// v1.35.0: 部署清瞳固定核心、双形态专项与五档完整关系人格的模块化人设。
// v1.34.0: 完成清瞳固定核心、五档好感人设、性格对冲与不可逆双形态契约。
// v1.33.0: 拔剑联动状态适配额外模型解析覆盖，并恢复本地《梦回还》BGM 配置。
// v1.32.0: 阶段变量完全由额外解析模型按正文证据更新，移除脚本写回纠正。
// v1.31.0: 两条救人路线统一先挥剑斩断清瞳的捆妖索，再执行弃剑或持剑。
// v1.29.0: 固化弃剑出殿后的万剑穿心、东方月初负伤救场与涂山红红破五百弟子剧情链。
// v1.28.0: 从角色卡彻底移除地下城肉鸽五脚本与持剑路线请求事件。
// v1.27.0: 肉鸽改为最后移动方向固定攻击，并优化画布、区块与绘制帧率。
// v1.26.0: 增加“测试启动持剑肉鸽”脚本按钮，便于跳过正式剧情链路验收游戏。
// v1.25.0: 接入持剑路线单次无限肉鸽，保留弃剑无尽剑幕并隔离两种请求事件。
// v1.24.0: 家族调查后发现清瞳；弃剑与持剑均抱起她出殿，父亲不阻拦，战斗只在殿外发生。
// v1.23.0: 对齐取名清瞳、每日绘景藏画、数次放妖、偏离计划受罚与人形夜探解绳失败。
// v1.22.0: 重写前三阶段时序，对齐首夜小蜘蛛送情书与墨盘疗伤、次日问妖、第三日七彩蛛丝初见。
// v1.21.0: MVU 保存楼层前校验大殿抉择正文证据，自动纠正模型误写为 03 的阶段值。
// v1.20.0: 救人路线在弹幕联动回复后的下一次玩家发送时启动剑幕；游戏结束不再发消息；清空 BGM 配置。
// v1.19.0: 持久化拔剑选项的结构化记录，并公开跨脚本查询 API 与选择事件。
// v1.18.0: 使用【开始】向导页选择开局；各正式开局通过原生 <initvar> 独立初始化。
// v1.17.0: 新增父亲召往主殿开场，并按开场 swipe 自动同步专属 MVU 初始变量。
// v1.16.0: 拔剑回复落地后继续等待玩家下一次发送，再联动五秒弹幕瀑布与音乐测试。
// v1.15.0: 此去无归达标后等待玩家下一次发送，拦截原输入并由拔剑选择替代。
// v1.14.1: 默认关闭剧情阶段自动弹幕，保留手动弹幕、音乐与拔剑交互。
// v1.14.0: 新增无尽剑幕试炼脚本，并绑定到完整角色卡。
// v1.13.5: 滚动弹幕纵向轨道铺满完整视口，去除上下留白。
// v1.13.4: 调整黄绿明度、增加白色弹幕，进一步收窄中央偏移并加入黑色字缘。
// v1.13.3: 提亮字体本体并移除彩色外发光，仅保留黑色可读性描边。
// v1.13.2: 小幅回提弹幕明度，并收窄中央弹幕版心与横向偏移。
// v1.13.1: 弹幕保留高饱和实色，同时压低明度与辉光。
// v1.13.0: 中央弹幕采用随机最大间隙填充，大幅提高瀑布速度并升级为高饱和色板。
// v1.12.2: 移除瀑布数量上限，中央弹幕从顶到底动态密铺，测试文本统一为万水千山台词。
// v1.12.1: 加密瀑布流量，中央弹幕以十三条紧密行循环覆盖且新层压住旧层。
// v1.12.0: 弹幕增加随机七色、中央无动画避让排版与可开关的全屏瀑布压力测试。
// v1.11.0: 重绘拔剑窗口，将压缩后的王权剑图标以 Base64 内嵌并按八次点击旋转。
// v1.10.2: 放宽进入此去无归的 MVU 门槛，仅要求关系败露与父命赐剑。
// v1.10.1: 对齐送信、疗伤绘景、长期相知、吊树夜探与拔剑抉择的阶段门槛。
// v1.10.0: 新增漫画／动画基准世界观与八个关键词触发势力条目。
// v1.8.0: 新增非恒定关键词触发的重要配角“涂山红红”。
// v1.7.1: 强制每轮唯一 UpdateVariable，禁止 MVU_Status 伪状态与未落库数值。
// v1.7.0: 新增非恒定关键词触发的男三“东方月初”。
// v1.6.1: 明确风庭云对{{user}}的少女式暗恋与钦慕。
// v1.6.0: 新增非恒定关键词触发的轻量配角“风庭云”。
// v1.5.0: 部署“此去无归”八次拔剑抉择与三路线结局。
// v1.4.0: 人设总控只按好感度读取五个禁用内容槽位，剧情由 LLM 自行推断。
// v1.3.0: 部署单一 EJS 总控与六个禁用的人设内容槽位。
// v1.2.0: 部署六个按剧情阶段路由的人设槽位。
// v1.1.1: 允许部署到前端与数据契约兼容的 Luker 宿主。
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stRoot = path.resolve(process.argv[2] || 'D:\\json脚本地下城\\主体\\SillyTavern');
const userRoot = path.join(stRoot, 'data', 'default-user');
const cardName = '狐妖小红娘·王权篇·沉浸测试';
const worldName = '狐妖小红娘·王权篇·沉浸测试';
const cardFilename = `${cardName}.png`;
const worldFilename = `${worldName}.json`;
const targetCard = path.join(userRoot, 'characters', cardFilename);
const targetWorld = path.join(userRoot, 'worlds', worldFilename);
const packagedCard = path.join(projectRoot, 'dist', `06-${cardFilename}`);
const backupRoot = path.join(projectRoot, 'backups', new Date().toISOString().replace(/[:.]/g, '-'));
const requireFromSillyTavern = createRequire(path.join(stRoot, 'package.json'));
const { PNG } = requireFromSillyTavern('pngjs');

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function readText(filePath) {
  return (await readFile(filePath, 'utf8')).replace(/^\uFEFF/, '').trimEnd();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function makeAvatar() {
  const width = 400;
  const height = 600;
  const png = new PNG({ width, height });

  const setPixel = (x, y, r, g, b, a = 255) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const index = (width * y + x) << 2;
    png.data[index] = r;
    png.data[index + 1] = g;
    png.data[index + 2] = b;
    png.data[index + 3] = a;
  };
  const drawLine = (x0, y0, x1, y1, color, thickness = 1) => {
    const dx = Math.abs(x1 - x0);
    const sx = x0 < x1 ? 1 : -1;
    const dy = -Math.abs(y1 - y0);
    const sy = y0 < y1 ? 1 : -1;
    let error = dx + dy;
    while (true) {
      for (let ox = -thickness; ox <= thickness; ox++) {
        for (let oy = -thickness; oy <= thickness; oy++) setPixel(x0 + ox, y0 + oy, ...color);
      }
      if (x0 === x1 && y0 === y1) break;
      const twice = 2 * error;
      if (twice >= dy) { error += dy; x0 += sx; }
      if (twice <= dx) { error += dx; y0 += sy; }
    }
  };
  const drawCircle = (cx, cy, radius, color) => {
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= radius * radius) setPixel(cx + x, cy + y, ...color);
      }
    }
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const vertical = y / height;
      const radial = Math.max(0, 1 - Math.hypot(x - 210, y - 250) / 420);
      setPixel(x, y, 21 + radial * 25, 18 + radial * 15, 35 + vertical * 24);
    }
  }

  // 金色王权剑
  drawLine(205, 92, 205, 475, [225, 184, 87], 4);
  drawLine(190, 130, 220, 130, [242, 206, 112], 3);
  drawLine(205, 92, 193, 122, [248, 220, 145], 2);
  drawLine(205, 92, 217, 122, [248, 220, 145], 2);
  drawCircle(205, 490, 10, [173, 43, 67]);

  // 清瞳蛛丝：从右上角向剑身延伸
  const silk = [215, 216, 226, 150];
  for (const point of [[400, 0], [400, 58], [400, 118], [356, 0], [310, 0]]) {
    drawLine(point[0], point[1], 246, 206, silk, 0);
  }
  for (const radius of [45, 85, 125, 165]) {
    let previous = null;
    for (let degree = 190; degree <= 270; degree += 4) {
      const radian = degree * Math.PI / 180;
      const point = [400 + Math.cos(radian) * radius, Math.sin(radian) * radius];
      if (previous) drawLine(Math.round(previous[0]), Math.round(previous[1]), Math.round(point[0]), Math.round(point[1]), silk, 0);
      previous = point;
    }
  }

  // 山峦与远路
  drawLine(0, 505, 90, 410, [78, 48, 72], 2);
  drawLine(90, 410, 168, 505, [78, 48, 72], 2);
  drawLine(125, 505, 250, 360, [64, 43, 69], 2);
  drawLine(250, 360, 400, 520, [64, 43, 69], 2);

  return PNG.sync.write(png);
}

function toCharacterBookEntry(entry) {
  const enabled = entry.enabled ?? !entry.disable;
  return {
    id: entry.uid,
    keys: entry.key || [],
    secondary_keys: entry.keysecondary || [],
    comment: entry.comment,
    content: entry.content,
    constant: Boolean(entry.constant),
    selective: Boolean(entry.selective),
    insertion_order: entry.order ?? 100,
    enabled,
    position: 'before_char',
    use_regex: true,
    extensions: {
      position: entry.position ?? 0,
      exclude_recursion: entry.excludeRecursion ?? true,
      display_index: entry.displayIndex ?? entry.uid,
      probability: entry.probability ?? 100,
      useProbability: entry.useProbability ?? true,
      depth: entry.depth ?? 4,
      selectiveLogic: entry.selectiveLogic ?? 0,
      group: entry.group ?? '',
      group_override: entry.groupOverride ?? false,
      group_weight: entry.groupWeight ?? 100,
      prevent_recursion: entry.preventRecursion ?? true,
      delay_until_recursion: entry.delayUntilRecursion ?? false,
      scan_depth: entry.scanDepth ?? null,
      match_whole_words: entry.matchWholeWords ?? null,
      use_group_scoring: entry.useGroupScoring ?? null,
      case_sensitive: entry.caseSensitive ?? null,
      automation_id: entry.automationId ?? '',
      role: 0,
      vectorized: entry.vectorized ?? false,
      sticky: entry.sticky ?? 0,
      cooldown: entry.cooldown ?? 0,
      delay: entry.delay ?? 0,
    },
  };
}

function makeRegexScripts(openingSelectorHtml, swordAwakeningImageDataUrl) {
  const findRegex = '/<UpdateVariable>(?:[\\s\\S]*?<\\/UpdateVariable>|[\\s\\S]*$)/gi';
  return [
    {
      id: 'd8ce62c7-7609-494b-a50f-c3e19213f26a',
      scriptName: '01-显示开局选择页',
      findRegex: '/^\\s*【开始】\\s*$/g',
      replaceString: `\`\`\`html\n${openingSelectorHtml}\n\`\`\``,
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: 'd52f4cbe-f0a4-43c8-8bc5-dd8f9d9520c5',
      scriptName: '02-对AI隐藏开局选择占位符',
      findRegex: '/^\\s*【开始】\\s*$/g',
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: false,
      promptOnly: true,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: '1135ad73-ffdb-4567-b1a9-a5da9b0df591',
      scriptName: '03-显示隐藏变量更新',
      findRegex,
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: 'dd03eea8-9f97-4b9a-8ae8-d4b681744e10',
      scriptName: '04-对AI隐藏变量更新',
      findRegex,
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: false,
      promptOnly: true,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: 'ee6db68b-bb63-455b-9bed-879c68225c67',
      scriptName: '05-显示王权篇状态栏',
      findRegex: '/<StatusPlaceHolderImpl\\s*\\/>/g',
      replaceString: '<div data-hyxhn-statusbar-mount></div>',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: '27855b42-e1fa-409d-b574-320d199cce19',
      scriptName: '06-对AI隐藏状态栏占位符',
      findRegex: '/<StatusPlaceHolderImpl\\s*\\/>/g',
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: false,
      promptOnly: true,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: '37a14918-b65b-4c0a-9ca3-2170f23aa93f',
      scriptName: '07-显示王权剑凝聚插图',
      findRegex: '/<HyxhnWangquanSwordAwakening\\s*\\/>/g',
      replaceString: `<div style="display:flex;justify-content:center;align-items:center;margin:18px auto 22px;"><img src="${swordAwakeningImageDataUrl}" alt="{{user}}凝聚王权剑守护清瞳" style="display:block;width:min(100%,760px);height:auto;border:1px solid rgba(245,211,151,.32);border-radius:16px;filter:drop-shadow(0 12px 24px rgba(0,0,0,.46));" /></div>`,
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: 'd9465cea-a0e6-466b-9875-17721429b71b',
      scriptName: '08-对AI隐藏王权剑凝聚插图标记',
      findRegex: '/<HyxhnWangquanSwordAwakening\\s*\\/>/g',
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: false,
      promptOnly: true,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: '91e00be8-9160-4e95-a9fc-8ecb50f50365',
      scriptName: '09-清理旧小游戏结果图标记',
      findRegex: '/<HyxhnBullethellResult\\s*\\/>/g',
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: true,
      promptOnly: false,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
    {
      id: '46088d2c-14f7-45c5-97ed-9f33f6e46f64',
      scriptName: '10-对AI隐藏旧小游戏结果图标记',
      findRegex: '/<HyxhnBullethellResult\\s*\\/>/g',
      replaceString: '',
      trimStrings: [],
      placement: [2],
      disabled: false,
      markdownOnly: false,
      promptOnly: true,
      runOnEdit: true,
      substituteRegex: 0,
      minDepth: null,
      maxDepth: null,
    },
  ];
}

await access(path.join(stRoot, 'package.json'));
await access(path.join(stRoot, 'src', 'character-card-parser.js'));
await access(path.join(stRoot, 'public', 'scripts', 'extensions', 'third-party', 'JS-Slash-Runner', 'manifest.json'));

const packageData = await readJson(path.join(stRoot, 'package.json'));
assert(['sillytavern', 'luker'].includes(packageData.name), '目标路径不是兼容的 SillyTavern/Luker 安装目录');

const [worldbook, loader, schema, mediaConfig, controller, statusbarController, bullethellController, openingInitController] = await Promise.all([
  readJson(path.join(projectRoot, 'dist', '01-王权篇测试世界书.json')),
  readJson(path.join(projectRoot, 'dist', '02-王权篇MVU加载器.json')),
  readJson(path.join(projectRoot, 'dist', '03-王权篇变量结构.json')),
  readJson(path.join(projectRoot, 'dist', '04-王权篇媒体资源配置.json')),
  readJson(path.join(projectRoot, 'dist', '05-王权篇顶层弹幕与音乐.json')),
  readJson(path.join(projectRoot, 'dist', '06-王权篇状态栏控制器.json')),
  readJson(path.join(projectRoot, 'dist', '07-王权篇无尽剑幕试炼.json')),
  readJson(path.join(projectRoot, 'dist', '08-王权篇开场变量同步.json')),
]);

const worldEntries = Object.values(worldbook.entries).sort((a, b) => a.uid - b.uid);
assert(worldEntries.length === 42, '世界书条目数量异常');
const mainModelUpdateEntry = worldEntries.find((entry) => entry.comment === '[mvu_plot]王权篇主模型变量更新规则');
assert(mainModelUpdateEntry?.content.includes('主模型补丁是额外 MVU 接口失败时的落库兜底'), '主模型变量更新兜底条目缺失');
assert(worldEntries[0].comment.startsWith('[InitVar]') && worldEntries[0].disable === true, '[InitVar] 必须禁用');
for (const overrideName of ['清瞳始终小蜘蛛娘', '清瞳始终纯小蜘蛛']) {
  const overrideEntry = worldEntries.find((entry) => entry.comment.includes(overrideName));
  assert(overrideEntry?.enabled === false && overrideEntry.disable === true && overrideEntry.constant === true, `${overrideName}覆写必须默认关闭且常驻`);
}

const [defaultInitVar, mainHallInitVar, openingSelectorHtml, swordAwakeningImage] = await Promise.all([
  readText(path.join(projectRoot, 'worldbook', '00-initvar.yaml')),
  readText(path.join(projectRoot, 'worldbook', '01-initvar-main-hall.yaml')),
  readText(path.join(projectRoot, 'src', 'opening-selector.html')),
  readFile(path.join(projectRoot, 'assets', 'bullethell-result.webp')),
]);
assert(swordAwakeningImage.length > 40_000 && swordAwakeningImage.length < 120_000, `王权剑凝聚插图体积异常：${swordAwakeningImage.length} 字节`);
const swordAwakeningImageDataUrl = `data:image/webp;base64,${swordAwakeningImage.toString('base64')}`;

await mkdir(path.dirname(targetCard), { recursive: true });
await mkdir(path.dirname(targetWorld), { recursive: true });
await mkdir(path.dirname(packagedCard), { recursive: true });

const existingTargets = [];
for (const filePath of [targetCard, targetWorld]) {
  if (await exists(filePath)) {
    await mkdir(backupRoot, { recursive: true });
    await copyFile(filePath, path.join(backupRoot, path.basename(filePath)));
    existingTargets.push(filePath);
  }
}

const firstMessage = '【开始】';
const makeOpeningGreeting = (story, initVar) => `${story}\n\n<UpdateVariable>\n<initvar>\n${initVar}\n</initvar>\n</UpdateVariable>\n\n<StatusPlaceHolderImpl/>`;
const trainingGroundGreeting = makeOpeningGreeting(
  `暮色还未落下，王权山庄的演武场已经响起第三遍剑鸣。\n\n{{user}}站在场心，手中的长剑没有半分颤动。高台上的长老只谈命令、结果与下一场除妖，从没人问过这位道门兵人愿不愿意。\n\n墙外忽然掠过一缕极细的银光，像蛛丝，又像某种来自远方的信号。那道银光一闪即逝，藏在暗处的视线却没有立刻离开。\n\n接下来，{{user}}如何回应命令、如何看待墙外的妖，都由{{user}}亲自决定。`,
  defaultInitVar,
);
const mainHallGreeting = makeOpeningGreeting(
  `黄风城下那一剑已经过去数日。被仇恨红线操控的群妖恢复清明，金灵鳞骤得的力量消散，{{user}}最终顶着道盟众人的怒斥放走了它们。外界却只剩下一句越传越离谱的话——{{user}}为了一个女妖封剑叛道。\n\n夜色初临，王权山庄通往主殿的长廊点起一盏盏冷白灯火。一名守殿弟子匆匆停在{{user}}面前，垂首抱拳：“少爷，家主有令，请您即刻前往主殿，不得耽搁。”\n\n清瞳今晚没有如约出现。长廊尽头，主殿大门紧闭，门缝里的光把台阶切成一道森冷界线。隔着厚重殿门，父亲王权霸业的声音传来：“{{user}}，进来。”\n\n{{user}}此刻如何回应、是否立刻踏入主殿，都由{{user}}亲自决定。`,
  mainHallInitVar,
);
const description = '{{user}}与清瞳篇沉浸式互动测试卡。{{user}} 就是玩家在本篇中的身份；剧情参考轨道覆盖相识绘景、黄风城道义觉醒、斩断仇恨红线、一剑开天、主殿叛门、深山 12580 真相与龙湾前路，并允许玩家行动改变过程与关系。一剑开天后可在关系败露前主动执剑夺权或携瞳远走；携瞳远走包含离庄、追索、山外救援、12580 旧网、涂山边境审查与合作立足六段可变剧情，并可与红红、雅雅、容容、翠玉灵及毒娘子互动；12580 后可按信任与同行选择进入经典、关系修复或独立前路。清瞳五档关系条目限制演绎上限，不以数值自动确认恋人关系。“此去无归”提供八次拔剑与三路线抉择，并联动弹幕瀑布、《梦回还》和无尽剑幕试炼。';
const creatorNotes = '测试卡 v1.72.0。固定主角名已全部改为 {{user}}，正文、变量、世界书、开场与插图说明都会跟随玩家名称。';
const now = new Date().toISOString();
const characterBook = {
  entries: worldEntries.map(toCharacterBookEntry),
  name: worldName,
};
const extensions = {
  talkativeness: '0.5',
  fav: false,
  world: worldName,
  depth_prompt: { prompt: '', depth: 4, role: 'system' },
  regex_scripts: makeRegexScripts(
    openingSelectorHtml,
    swordAwakeningImageDataUrl,
  ),
  tavern_helper: {
    scripts: [openingInitController, loader, schema, mediaConfig, controller, statusbarController, bullethellController],
    variables: {},
  },
};
const data = {
  name: cardName,
  description,
  personality: '',
  scenario: '',
  first_mes: firstMessage,
  mes_example: '',
  creator_notes: creatorNotes,
  system_prompt: '',
  post_history_instructions: '',
  tags: ['狐妖小红娘', '玩家主角', '清瞳', 'MVU', '沉浸式'],
  creator: '风宝',
  character_version: '1.72.0',
  alternate_greetings: [trainingGroundGreeting, mainHallGreeting],
  extensions,
  character_book: characterBook,
  group_only_greetings: [],
};
const card = {
  name: cardName,
  description,
  personality: '',
  first_mes: firstMessage,
  avatar: 'none',
  chat: '',
  mes_example: '',
  scenario: '',
  create_date: now,
  talkativeness: '0.5',
  fav: false,
  creatorcomment: creatorNotes,
  spec: 'chara_card_v3',
  spec_version: '3.0',
  data,
  tags: data.tags,
};

const parser = await import(pathToFileURL(path.join(stRoot, 'src', 'character-card-parser.js')).href);
const avatar = makeAvatar();
const cardPng = parser.write(avatar, JSON.stringify(card));
await writeFile(packagedCard, cardPng);
await copyFile(packagedCard, targetCard);
await writeFile(targetWorld, `${JSON.stringify(worldbook, null, 2)}\n`, 'utf8');

const installedCard = JSON.parse(parser.read(await readFile(targetCard)));
const installedWorld = await readJson(targetWorld);
const forbiddenFixedProtagonistName = ['王权', '富贵'].join('');
assert(!JSON.stringify(installedCard).includes(forbiddenFixedProtagonistName), '安装后的角色卡仍包含固定主角名');
assert(!JSON.stringify(installedWorld).includes(forbiddenFixedProtagonistName), '安装后的独立世界书仍包含固定主角名');
assert(installedCard.spec === 'chara_card_v3', '安装后的角色卡不是 V3');
assert(installedCard.data.name === cardName, '安装后的角色名不一致');
assert(installedCard.data.extensions.world === worldName, '世界书绑定失败');
assert(installedCard.data.character_book.entries.length === 42, '卡内世界书条目数量异常');
assert(installedCard.data.character_book.entries[0].enabled === false, '卡内 [InitVar] 未禁用');
assert(installedCard.data.first_mes === '【开始】' && installedCard.first_mes === '【开始】', '开局选择占位符未同步到 V3 双层字段');
assert(installedCard.data.alternate_greetings.length === 2, '卡内两个正式开局缺失');
assert(installedCard.data.alternate_greetings.every((greeting) => greeting.includes('<initvar>') && greeting.includes('</initvar>')), '正式开局缺少原生 <initvar>');
assert(installedCard.data.alternate_greetings[0].includes('00_序章_道门兵人'), '演武场开局变量异常');
assert(installedCard.data.alternate_greetings[1].includes('父亲王权霸业') && installedCard.data.alternate_greetings[1].includes('06_败露_主殿杀令'), '主殿开局剧情或变量异常');
assert(installedCard.data.extensions.tavern_helper.scripts.length === 7, '卡内酒馆助手脚本数量异常');
const installedScripts = installedCard.data.extensions.tavern_helper.scripts;
assert(!installedScripts.some((script) => script.name.includes('地下城')), '卡内仍残留地下城脚本');
assert(!installedScripts.some((script) => script.content.includes('hyxhn_wangquan_roguelite_requested')), '卡内仍残留肉鸽请求事件');
const installedMediaConfig = installedScripts.find((script) => script.name === '04-王权篇媒体资源配置');
assert(installedMediaConfig?.content.includes('data:audio/mpeg;base64,'), '卡内媒体配置缺少内嵌《梦回还》');
assert(!installedMediaConfig.content.includes('http://') && !installedMediaConfig.content.includes('https://'), '卡内媒体配置仍依赖外部音频地址');
const installedBullethell = installedScripts.find((script) => script.name === '07-王权篇无尽剑幕试炼');
assert(installedBullethell?.content.includes("version: '1.8.0'"), '卡内无尽剑幕运行时版本异常');
assert(!installedBullethell.content.includes('HyxhnBullethellResult') && !installedBullethell.content.includes('setChatMessages('), '卡内无尽剑幕仍会写入游戏结果插图');
assert(installedBullethell.content.includes('data:image/webp;base64,'), '卡内无尽剑幕缺少内嵌玩家角色图');
assert(installedBullethell.content.includes('ctx.drawImage(sprite') && installedBullethell.content.includes('radius: 4'), '卡内无尽剑幕角色绘制或小判定点异常');
assert(installedBullethell.content.includes('const bladeGradient = ctx.createLinearGradient') && installedBullethell.content.includes('ctx.moveTo(bladeBase.x, bladeBase.y)'), '卡内无尽剑幕缺少实体剑身或中央剑脊');
assert(installedBullethell.content.includes('const tipShoulderLeft = point(radius * 2.45, radius * 0.68)') && installedBullethell.content.includes('ctx.lineTo(tipShoulderRight.x, tipShoulderRight.y)'), '卡内无尽剑幕缺少长方形剑身与独立剑尖结构');
assert(!installedBullethell.content.includes('__HYXHN_BULLETHELL_PLAYER_SPRITE_DATA_URL__'), '卡内无尽剑幕仍残留玩家角色图占位符');
assert(installedCard.data.extensions.regex_scripts.length === 10, '卡内正则数量异常');
assert(installedCard.data.extensions.regex_scripts[0].replaceString.includes('hyxhn_opening_selected'), '开局选择页正则缺少按钮事件');
const installedSwordDisplayRegex = installedCard.data.extensions.regex_scripts.find((regex) => regex.scriptName === '07-显示王权剑凝聚插图');
const installedSwordPromptRegex = installedCard.data.extensions.regex_scripts.find((regex) => regex.scriptName === '08-对AI隐藏王权剑凝聚插图标记');
assert(installedSwordDisplayRegex?.findRegex.includes('HyxhnWangquanSwordAwakening') && installedSwordDisplayRegex.replaceString.includes('data:image/webp;base64,') && installedSwordDisplayRegex.markdownOnly === true, '王权剑凝聚插图显示正则异常');
const installedSwordImageMatch = installedSwordDisplayRegex.replaceString.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);
assert(installedSwordImageMatch && Buffer.from(installedSwordImageMatch[1], 'base64').equals(swordAwakeningImage), '卡内王权剑凝聚插图与压缩资产不一致');
assert(installedSwordDisplayRegex.replaceString.includes('width:min(100%,760px)') && installedSwordDisplayRegex.replaceString.includes('{{user}}凝聚王权剑守护清瞳'), '王权剑凝聚插图尺寸或替代文本异常');
assert(installedSwordPromptRegex?.promptOnly === true && installedSwordPromptRegex.replaceString === '', '王权剑凝聚插图提示词隐藏正则异常');
const legacyMarkerRegexes = installedCard.data.extensions.regex_scripts.filter((regex) => regex.findRegex.includes('HyxhnBullethellResult'));
assert(legacyMarkerRegexes.length === 2 && legacyMarkerRegexes.every((regex) => regex.replaceString === ''), '旧小游戏结果图标记未在显示与提示词两路清理');
assert(Object.keys(installedWorld.entries).every((key) => key === String(installedWorld.entries[key].uid)), '独立世界书键与 uid 不一致');

console.log(`部署完成：${cardName}`);
console.log(`- 角色卡：${targetCard}`);
console.log(`- 绑定世界书：${targetWorld}`);
console.log(`- 可分发副本：${packagedCard}`);
console.log(`- 卡内世界书：${installedCard.data.character_book.entries.length} 条`);
console.log(`- 卡内酒馆助手脚本：${installedCard.data.extensions.tavern_helper.scripts.length} 支`);
console.log(`- 卡内正则：${installedCard.data.extensions.regex_scripts.length} 支`);
if (existingTargets.length > 0) console.log(`- 旧文件备份：${backupRoot}`);
