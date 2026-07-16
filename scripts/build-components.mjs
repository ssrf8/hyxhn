// 狐妖小红娘·王权篇部件构建器 v1.29.0
// v1.29.0: 固化弃剑出殿后的万剑穿心、东方月初负伤救场与涂山红红破五百弟子剧情链。
// v1.28.0: 完全移除角色卡中的地下城肉鸽模块及其五个构建产物。
// v1.27.0: 肉鸽攻击改为最后移动方向，并缓存画布/区块、限制绘制频率以降低卡顿。
// v1.26.0: 为持剑肉鸽运行时增加不发送消息的手动测试启动按钮。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');

const paths = {
  loader: path.join(projectRoot, 'src', 'mvu-loader.js'),
  schema: path.join(projectRoot, 'src', 'mvu-schema.js'),
  mediaConfigScript: path.join(projectRoot, 'src', 'media-config.js'),
  controller: path.join(projectRoot, 'src', 'media-controller.js'),
  swordIcon: path.join(projectRoot, 'assets', 'wangquan-sword-button.jpg'),
  statusbarController: path.join(projectRoot, 'src', 'statusbar-controller.js'),
  statusbarHtml: path.join(projectRoot, 'src', 'statusbar.html'),
  bullethellController: path.join(projectRoot, 'src', 'bullethell-controller.js'),
  openingInitController: path.join(projectRoot, 'src', 'opening-init-controller.js'),
  mediaConfig: path.join(projectRoot, 'config', 'media-assets.json'),
  initVar: path.join(projectRoot, 'worldbook', '00-initvar.yaml'),
  updateRules: path.join(projectRoot, 'worldbook', '10-update-rules.txt'),
  currentVariables: path.join(projectRoot, 'worldbook', '20-current-variables.txt'),
  plotGuide: path.join(projectRoot, 'worldbook', '30-plot-guide.txt'),
  stageOutline: path.join(projectRoot, 'worldbook', '40-stage-outline.txt'),
  wangquanBayePersona: path.join(projectRoot, 'worldbook', '41-npc-wangquan-baye.txt'),
  fengTingyunPersona: path.join(projectRoot, 'worldbook', '42-npc-fengtingyun.txt'),
  dongfangYuechuPersona: path.join(projectRoot, 'worldbook', '43-npc-dongfang-yuechu.txt'),
  tushanHonghongPersona: path.join(projectRoot, 'worldbook', '44-npc-tushan-honghong.txt'),
  worldCore: path.join(projectRoot, 'worldbook', '70-world-core.txt'),
  factionEntries: [
    '71-faction-yiqi-daomeng.txt',
    '72-faction-wangquan.txt',
    '73-faction-dongfang.txt',
    '74-faction-tushan.txt',
    '75-faction-nanguo.txt',
    '76-faction-beishan.txt',
    '77-faction-xixiyu.txt',
    '78-faction-aolai.txt',
  ].map((filename) => path.join(projectRoot, 'worldbook', filename)),
  stagePersona: path.join(projectRoot, 'worldbook', '50-stage-persona.ejs'),
  affinityPersonaSlots: [
    '51-affinity-persona-00-19.ejs',
    '52-affinity-persona-20-39.ejs',
    '53-affinity-persona-40-59.ejs',
    '54-affinity-persona-60-79.ejs',
    '55-affinity-persona-80-100.ejs',
  ].map((filename) => path.join(projectRoot, 'worldbook', filename)),
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

function makeEntry({ uid, comment, content, enabled = true, constant = true, order, keys = [] }) {
  return {
    uid,
    key: keys,
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
  if (entries.length !== 25) throw new Error(`世界书条目数量异常：${entries.length}`);
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
for (const staleRogueliteOutput of [
  '09-持剑肉鸽内容库.json',
  '10-持剑肉鸽运行时.json',
  '11-持剑肉鸽窗口与输入.json',
  '12-持剑肉鸽存档桥.json',
  '13-持剑肉鸽诊断工具.json',
]) {
  await rm(path.join(distDir, staleRogueliteOutput), { force: true });
}

const [
  loader,
  schema,
  mediaConfigScript,
  controller,
  swordIcon,
  statusbarController,
  statusbarHtml,
  bullethellController,
  openingInitController,
  mediaConfigRaw,
  initVar,
  updateRules,
  currentVariables,
  plotGuide,
  stageOutline,
  wangquanBayePersona,
  fengTingyunPersona,
  dongfangYuechuPersona,
  tushanHonghongPersona,
  worldCore,
  factionEntries,
  stagePersona,
  affinityPersonaSlots,
  statusbarProtocol,
] = await Promise.all([
  readText(paths.loader),
  readText(paths.schema),
  readText(paths.mediaConfigScript),
  readText(paths.controller),
  readFile(paths.swordIcon),
  readText(paths.statusbarController),
  readText(paths.statusbarHtml),
  readText(paths.bullethellController),
  readText(paths.openingInitController),
  readText(paths.mediaConfig),
  readText(paths.initVar),
  readText(paths.updateRules),
  readText(paths.currentVariables),
  readText(paths.plotGuide),
  readText(paths.stageOutline),
  readText(paths.wangquanBayePersona),
  readText(paths.fengTingyunPersona),
  readText(paths.dongfangYuechuPersona),
  readText(paths.tushanHonghongPersona),
  readText(paths.worldCore),
  Promise.all(paths.factionEntries.map(readText)),
  readText(paths.stagePersona),
  Promise.all(paths.affinityPersonaSlots.map(readText)),
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
const swordIconPlaceholder = '__HYXHN_SWORD_ICON_DATA_URL__';
if (!controller.includes(swordIconPlaceholder)) {
  throw new Error(`媒体控制器缺少王权剑图标占位符：${swordIconPlaceholder}`);
}
const swordIconDataUrl = `data:image/jpeg;base64,${swordIcon.toString('base64')}`;
const builtController = controller.replace(swordIconPlaceholder, swordIconDataUrl);
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
  makeEntry({
    uid: 141,
    comment: '[mvu_plot]配角人设·王权霸业',
    content: wangquanBayePersona,
    constant: false,
    order: 141,
    keys: ['王权霸业', '王权家主', '家主大人', '富贵的父亲', '父亲', '东方淮竹'],
  }),
  makeEntry({
    uid: 142,
    comment: '[mvu_plot]配角人设·风庭云',
    content: fengTingyunPersona,
    constant: false,
    order: 142,
    keys: ['风庭云', '庭云', '风师妹', '师妹', '王权富贵的师妹'],
  }),
  makeEntry({
    uid: 143,
    comment: '[mvu_plot]男三人设·东方月初',
    content: dongfangYuechuPersona,
    constant: false,
    order: 143,
    keys: ['东方月初', '月初', '东方公子', '东方盟主', '一气道盟盟主', '富贵的表弟'],
  }),
  makeEntry({
    uid: 144,
    comment: '[mvu_plot]重要配角人设·涂山红红',
    content: tushanHonghongPersona,
    constant: false,
    order: 144,
    keys: ['涂山红红', '红红', '红红姐', '涂山之主', '妖盟盟主', '狐妖之王'],
  }),
  makeEntry({ uid: 150, comment: '[mvu_plot]清瞳好感人设控制器', content: stagePersona, order: 150 }),
  ...affinityPersonaSlots.map((content, index) => makeEntry({
    uid: 151 + index,
    comment: `[mvu_plot]清瞳好感人设槽位·${['00-19', '20-39', '40-59', '60-79', '80-100'][index]}`,
    content,
    enabled: false,
    constant: false,
    order: 151 + index,
  })),
  makeEntry({ uid: 160, comment: '[mvu_plot]王权篇状态栏输出协议', content: statusbarProtocol, order: 160 }),
  makeEntry({ uid: 170, comment: '[mvu_plot]世界观·人妖秩序与悲剧底色', content: worldCore, order: 170 }),
  ...[
    { uid: 171, comment: '[mvu_plot]势力·一气道盟', keys: ['一气道盟', '道盟', '道门', '道士', '盟主', '符箓', '法剑', '阵法'] },
    { uid: 172, comment: '[mvu_plot]势力·王权世家', keys: ['王权世家', '王权家', '王权山庄', '王权剑', '王权剑意', '天地一剑', '道门兵人'] },
    { uid: 173, comment: '[mvu_plot]势力·东方灵族', keys: ['东方灵族', '东方家', '东方血脉', '东方灵血', '纯质阳炎', '灭妖神火'] },
    { uid: 174, comment: '[mvu_plot]势力·涂山', keys: ['涂山', '狐妖', '妖盟', '苦情树', '再世续缘', '红线仙', '绝缘之爪'] },
    { uid: 175, comment: '[mvu_plot]势力·南国', keys: ['南国', '毒皇', '毒术', '毒功', '毒雾', '万毒之体'] },
    { uid: 176, comment: '[mvu_plot]势力·北山', keys: ['北山', '北山妖帝', '毁灭天君', '石宽', '法天象地'] },
    { uid: 177, comment: '[mvu_plot]势力·西西域', keys: ['西西域', '沙狐', '梵云飞', '御沙术', '沙妖'] },
    { uid: 178, comment: '[mvu_plot]势力·傲来国', keys: ['傲来国', '傲来三少', '三少', '六耳', '定海棒'] },
  ].map((config, index) => makeEntry({ ...config, content: factionEntries[index], constant: false, order: config.uid })),
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
  content: builtController,
  info: '监听 MVU 当前阶段，在酒馆页面最上层显示弹幕、控制 BGM，并以嵌入式图标呈现拔剑抉择。',
  buttons: ['测试右移弹幕', '测试中央弹幕', '开启弹幕瀑布', '关闭弹幕瀑布', '测试音乐', '停止音乐', '测试拔剑窗口', '重置拔剑进度', '重置媒体触发'],
})));
outputs.push(await writeJson('06-王权篇状态栏控制器.json', makeScript({
  id: '734aa2c7-0a90-44e9-8ccc-4ab1756bb89b',
  name: '06-王权篇状态栏控制器',
  content: builtStatusbarController,
  info: '监听消息楼层中的状态栏挂载点，以 Shadow DOM 安全渲染该楼层的 MVU 状态。',
})));
outputs.push(await writeJson('07-王权篇无尽剑幕试炼.json', makeScript({
  id: 'b43d8e5a-29f2-4ba0-9b76-5ee381f3f6c7',
  name: '07-王权篇无尽剑幕试炼',
  content: bullethellController,
  info: '全屏无尽躲弹幕试炼。弃剑路线在指定对话链节点自动启动；结束后不发送消息、不触发生成。',
  buttons: ['开始无尽剑幕试炼'],
})));
outputs.push(await writeJson('08-王权篇开场变量同步.json', makeScript({
  id: '1baf5487-9e8a-4b85-8815-2a73d9f9af31',
  name: '08-王权篇开场变量同步',
  content: openingInitController,
  info: '响应开局选择页按钮，仅切换到已由原生 <initvar> 初始化的目标 swipe；不手动写入 MVU。',
})));
console.log(`已生成 ${outputs.length} 个可导入部件：`);
for (const output of outputs) console.log(`- ${path.relative(projectRoot, output)}`);
