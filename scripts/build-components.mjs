// 狐妖小红娘·王权篇部件构建器 v1.1.0
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');

const paths = {
  loader: path.join(projectRoot, 'src', 'mvu-loader.js'),
  schema: path.join(projectRoot, 'src', 'mvu-schema.js'),
  mediaConfigScript: path.join(projectRoot, 'src', 'media-config.js'),
  controller: path.join(projectRoot, 'src', 'media-controller.js'),
  statusbarController: path.join(projectRoot, 'src', 'statusbar-controller.js'),
  statusbarHtml: path.join(projectRoot, 'src', 'statusbar.html'),
  mediaConfig: path.join(projectRoot, 'config', 'media-assets.json'),
  initVar: path.join(projectRoot, 'worldbook', '00-initvar.yaml'),
  updateRules: path.join(projectRoot, 'worldbook', '10-update-rules.txt'),
  currentVariables: path.join(projectRoot, 'worldbook', '20-current-variables.txt'),
  plotGuide: path.join(projectRoot, 'worldbook', '30-plot-guide.txt'),
  stageOutline: path.join(projectRoot, 'worldbook', '40-stage-outline.txt'),
  stagePersona: path.join(projectRoot, 'worldbook', '50-stage-persona.ejs'),
  statusbarProtocol: path.join(projectRoot, 'worldbook', '60-statusbar-protocol.txt'),
};

async function readText(filePath) {
  return (await readFile(filePath, 'utf8')).replace(/^\uFEFF/, '').trimEnd();
}

function makeScript({ id, name, content, info, buttons = [], data = {} }) {
  return {
    type: 'script',
    enabled: true,
    name,
    id,
    content,
    info,
    button: {
      enabled: buttons.length > 0,
      buttons: buttons.map((buttonName) => ({ name: buttonName, visible: true })),
    },
    data,
    export_with: { data: true, button: true },
  };
}

function makeEntry({ uid, comment, content, enabled = true, constant = true, order }) {
  return {
    uid,
    key: [],
    keysecondary: [],
    comment,
    content,
    constant,
    vectorized: false,
    selective: false,
    selectiveLogic: 0,
    addMemo: true,
    order,
    position: 0,
    disable: !enabled,
    enabled,
    excludeRecursion: true,
    preventRecursion: true,
    delayUntilRecursion: false,
    probability: 100,
    useProbability: true,
    depth: 4,
    role: null,
    group: '',
    groupOverride: false,
    groupWeight: 100,
    scanDepth: null,
    caseSensitive: null,
    matchWholeWords: null,
    useGroupScoring: null,
    automationId: '',
    displayIndex: uid,
  };
}

function assertWorldbook(worldbook) {
  const entries = Object.entries(worldbook.entries);
  if (entries.length !== 7) throw new Error(`世界书条目数量异常：${entries.length}`);
  const uids = new Set();
  for (const [key, entry] of entries) {
    if (key !== String(entry.uid)) throw new Error(`世界书键 ${key} 与 uid ${entry.uid} 不一致`);
    if (uids.has(entry.uid)) throw new Error(`世界书 uid 重复：${entry.uid}`);
    uids.add(entry.uid);
  }
  const initVar = entries.map(([, entry]) => entry).find((entry) => entry.comment.startsWith('[InitVar]'));
  if (!initVar || initVar.enabled !== false || initVar.disable !== true) {
    throw new Error('[InitVar] 必须保持禁用');
  }
}

async function writeJson(filename, value) {
  const outputPath = path.join(distDir, filename);
  await writeFile(outputPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  JSON.parse(await readFile(outputPath, 'utf8'));
  return outputPath;
}

await mkdir(distDir, { recursive: true });

const [
  loader,
  schema,
  mediaConfigScript,
  controller,
  statusbarController,
  statusbarHtml,
  mediaConfigRaw,
  initVar,
  updateRules,
  currentVariables,
  plotGuide,
  stageOutline,
  stagePersona,
  statusbarProtocol,
] = await Promise.all([
  readText(paths.loader),
  readText(paths.schema),
  readText(paths.mediaConfigScript),
  readText(paths.controller),
  readText(paths.statusbarController),
  readText(paths.statusbarHtml),
  readText(paths.mediaConfig),
  readText(paths.initVar),
  readText(paths.updateRules),
  readText(paths.currentVariables),
  readText(paths.plotGuide),
  readText(paths.stageOutline),
  readText(paths.stagePersona),
  readText(paths.statusbarProtocol),
]);

const mediaConfig = JSON.parse(mediaConfigRaw);
const mediaConfigPlaceholder = '__HYXHN_MEDIA_CONFIG__';
if (!mediaConfigScript.includes(mediaConfigPlaceholder)) {
  throw new Error(`媒体配置脚本缺少构建占位符：${mediaConfigPlaceholder}`);
}
const builtMediaConfigScript = mediaConfigScript.replace(
  mediaConfigPlaceholder,
  JSON.stringify(mediaConfig),
);
const statusbarPlaceholder = '__HYXHN_STATUSBAR_HTML__';
if (!statusbarController.includes(statusbarPlaceholder)) {
  throw new Error(`状态栏控制器缺少构建占位符：${statusbarPlaceholder}`);
}
const builtStatusbarController = statusbarController.replace(statusbarPlaceholder, JSON.stringify(statusbarHtml));
const entryList = [
  makeEntry({ uid: 100, comment: '[InitVar]王权篇变量初始化勿开', content: initVar, enabled: false, order: 100 }),
  makeEntry({ uid: 110, comment: '[mvu_update]王权篇变量更新规则', content: updateRules, order: 110 }),
  makeEntry({ uid: 120, comment: '王权篇当前变量', content: currentVariables, order: 120 }),
  makeEntry({ uid: 130, comment: '[mvu_plot]王权篇演绎指南', content: plotGuide, order: 130 }),
  makeEntry({ uid: 140, comment: '[mvu_plot]王权篇阶段剧情', content: stageOutline, order: 140 }),
  makeEntry({ uid: 150, comment: '[mvu_plot]清瞳阶段好感人设控制器', content: stagePersona, order: 150 }),
  makeEntry({ uid: 160, comment: '[mvu_plot]王权篇状态栏输出协议', content: statusbarProtocol, order: 160 }),
];
const worldbook = { entries: Object.fromEntries(entryList.map((entry) => [String(entry.uid), entry])) };
assertWorldbook(worldbook);

const outputs = [];
outputs.push(await writeJson('01-王权篇测试世界书.json', worldbook));
outputs.push(await writeJson('02-王权篇MVU加载器.json', makeScript({
  id: '6ba65821-cd8f-4438-9f7c-acf8f53701df',
  name: '02-王权篇MVU加载器',
  content: loader,
  info: '加载 MVU 本体。酒馆助手→脚本库→导入；已安装等效加载器时请只启用一支。',
})));
outputs.push(await writeJson('03-王权篇变量结构.json', makeScript({
  id: 'd7d4e49c-cab1-4de9-97f6-82a9e63799a2',
  name: '03-王权篇变量结构',
  content: schema,
  info: '注册王权篇测试 Schema。修改后需要重载脚本并新开对话。',
})));
outputs.push(await writeJson('04-王权篇媒体资源配置.json', makeScript({
  id: '2fcf1384-8802-4b31-9ee9-2c5da8f4e011',
  name: '04-王权篇媒体资源配置',
  content: builtMediaConfigScript,
  info: '独立媒体配置。切换到 R2 时只需修改 config/media-assets.json 并重新导入本文件。',
  data: { mediaConfig },
})));
outputs.push(await writeJson('05-王权篇顶层弹幕与音乐.json', makeScript({
  id: '0d8f88ef-8b8e-4b25-96a4-848bfebfb205',
  name: '05-王权篇顶层弹幕与音乐',
  content: controller,
  info: '监听 MVU 当前阶段，在酒馆页面最上层显示右移/中央弹幕并控制 BGM。',
  buttons: ['测试右移弹幕', '测试中央弹幕', '测试音乐', '停止音乐', '重置媒体触发'],
})));
outputs.push(await writeJson('06-王权篇状态栏控制器.json', makeScript({
  id: '734aa2c7-0a90-44e9-8ccc-4ab1756bb89b',
  name: '06-王权篇状态栏控制器',
  content: builtStatusbarController,
  info: '监听消息楼层中的状态栏挂载点，以 Shadow DOM 安全渲染该楼层的 MVU 状态。',
})));

console.log(`已生成 ${outputs.length} 个可导入部件：`);
for (const output of outputs) console.log(`- ${path.relative(projectRoot, output)}`);
