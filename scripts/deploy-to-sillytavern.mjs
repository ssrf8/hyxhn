// 狐妖小红娘·王权篇部署器 v1.14.0
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
// v1.6.1: 明确风庭云对王权富贵的少女式暗恋与钦慕。
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

function makeRegexScripts() {
  const findRegex = '/<UpdateVariable>(?:[\\s\\S]*?<\\/UpdateVariable>|[\\s\\S]*$)/gi';
  return [
    {
      id: '1135ad73-ffdb-4567-b1a9-a5da9b0df591',
      scriptName: '01-显示隐藏变量更新',
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
      scriptName: '02-对AI隐藏变量更新',
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
      scriptName: '03-显示王权篇状态栏',
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
      scriptName: '04-对AI隐藏状态栏占位符',
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
  ];
}

await access(path.join(stRoot, 'package.json'));
await access(path.join(stRoot, 'src', 'character-card-parser.js'));
await access(path.join(stRoot, 'public', 'scripts', 'extensions', 'third-party', 'JS-Slash-Runner', 'manifest.json'));

const packageData = await readJson(path.join(stRoot, 'package.json'));
assert(['sillytavern', 'luker'].includes(packageData.name), '目标路径不是兼容的 SillyTavern/Luker 安装目录');

const [worldbook, loader, schema, mediaConfig, controller, statusbarController, bullethellController] = await Promise.all([
  readJson(path.join(projectRoot, 'dist', '01-王权篇测试世界书.json')),
  readJson(path.join(projectRoot, 'dist', '02-王权篇MVU加载器.json')),
  readJson(path.join(projectRoot, 'dist', '03-王权篇变量结构.json')),
  readJson(path.join(projectRoot, 'dist', '04-王权篇媒体资源配置.json')),
  readJson(path.join(projectRoot, 'dist', '05-王权篇顶层弹幕与音乐.json')),
  readJson(path.join(projectRoot, 'dist', '06-王权篇状态栏控制器.json')),
  readJson(path.join(projectRoot, 'dist', '07-王权篇无尽剑幕试炼.json')),
]);

const worldEntries = Object.values(worldbook.entries).sort((a, b) => a.uid - b.uid);
assert(worldEntries.length === 25, '世界书条目数量异常');
assert(worldEntries[0].comment.startsWith('[InitVar]') && worldEntries[0].disable === true, '[InitVar] 必须禁用');

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

const firstMessage = `暮色还未落下，王权山庄的演武场已经响起第三遍剑鸣。\n\n{{user}}站在场心，手中的长剑没有半分颤动。高台上的长老只谈命令、结果与下一场除妖，从没人问过这位被称作“王权富贵”的道门兵人愿不愿意。\n\n墙外忽然掠过一缕极细的银光，像蛛丝，又像某种来自远方的信号。那道银光一闪即逝，藏在暗处的视线却没有立刻离开。\n\n接下来，王权富贵如何回应命令、如何看待墙外的妖，都由{{user}}亲自决定。\n\n<StatusPlaceHolderImpl/>`;
const description = '王权富贵与清瞳篇沉浸式互动测试卡。玩家以 {{user}} 扮演王权富贵；EJS 只按清瞳好感度选择人设，“此去无归”阶段提供八次拔剑与三路线抉择，另含可随时启动的无尽剑幕生存试炼。';
const creatorNotes = '测试卡 v1.14.0。新增全屏无尽剑幕试炼：鼠标或触屏相对拖动、八条生命、王权剑意弹幕按波次无限叠加，死亡后发送固定玩家行动与成绩并继续生成；同时保留原有阶段弹幕、音乐、拔剑抉择与状态栏。需要酒馆助手、MVU 与 ST-Prompt-Template。';
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
  regex_scripts: makeRegexScripts(),
  tavern_helper: {
    scripts: [loader, schema, mediaConfig, controller, statusbarController, bullethellController],
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
  tags: ['狐妖小红娘', '王权富贵', '清瞳', 'MVU', '沉浸式'],
  creator: '风宝',
  character_version: '1.14.0',
  alternate_greetings: [],
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
assert(installedCard.spec === 'chara_card_v3', '安装后的角色卡不是 V3');
assert(installedCard.data.name === cardName, '安装后的角色名不一致');
assert(installedCard.data.extensions.world === worldName, '世界书绑定失败');
assert(installedCard.data.character_book.entries.length === 25, '卡内世界书条目数量异常');
assert(installedCard.data.character_book.entries[0].enabled === false, '卡内 [InitVar] 未禁用');
assert(installedCard.data.extensions.tavern_helper.scripts.length === 6, '卡内酒馆助手脚本数量异常');
assert(installedCard.data.extensions.regex_scripts.length === 4, '卡内正则数量异常');
assert(Object.keys(installedWorld.entries).every((key) => key === String(installedWorld.entries[key].uid)), '独立世界书键与 uid 不一致');

console.log(`部署完成：${cardName}`);
console.log(`- 角色卡：${targetCard}`);
console.log(`- 绑定世界书：${targetWorld}`);
console.log(`- 可分发副本：${packagedCard}`);
console.log(`- 卡内世界书：${installedCard.data.character_book.entries.length} 条`);
console.log(`- 卡内酒馆助手脚本：${installedCard.data.extensions.tavern_helper.scripts.length} 支`);
console.log(`- 卡内正则：${installedCard.data.extensions.regex_scripts.length} 支`);
if (existingTargets.length > 0) console.log(`- 旧文件备份：${backupRoot}`);
