// 狐妖小红娘·王权篇部件构建器 v1.72.0
// v1.72.0: 将固定主角名统一替换为 {{user}}，避免玩家名称与正文身份冲突。
// v1.71.0: 将结果插图从小游戏收尾迁移为主模型在王权剑凝聚剧情中输出的正则标记。
// v1.70.0: 强制弃剑线将万剑穿心与东方月初登场拆为两个回复，并延后尾声阶段结算。
// v1.69.0: 为剧情主模型派生完整变量更新协议，与额外 MVU 模型形成同层双重更新和断线兜底。
// v1.68.0: 接入独立压缩的横版无尽剑幕结果插图资产。
// v1.67.0: 构建死亡无暂停字幕与新回复楼层结果图占位符写入逻辑。
// v1.66.0: 将剑形飞弹改为等宽长方形剑身与独立短剑尖结构。
// v1.65.0: 强化剑形飞弹的实体剑身、深色轮廓、刃面层次与中央剑脊。
// v1.64.0: 将无尽剑幕飞弹构建为沿速度方向旋转的发光剑形。
// v1.63.0: 压缩并内嵌无尽剑幕玩家角色图，替换原光标且不扩大碰撞判定。
// v1.62.0: 构建弹幕海 BGM 单次播放与音频自然结束硬性收尾。
// v1.61.0: 恢复完整曲长的 128 kbps 内嵌 BGM，并构建生成结束/中止异常收尾逻辑。
// v1.60.0: 内嵌 BGM 改用保留前 2/3、128 kbps 的有损压缩版，原始音频保持不动。
// v1.59.0: 将《梦回还》编码进媒体配置脚本，弹幕瀑布离线播放且不再请求云端或本地服务。
// v1.58.0: 移除无尽剑幕小游戏 BGM，保留弹幕瀑布的《梦回还》联动。
// v1.57.0: 新增两条默认关闭的清瞳常驻形态覆写，并规定纯蜘蛛模式优先。
// v1.56.0: 构建清瞳完整核心人设并接入五档关系控制器。
// v1.55.0: 构建恢复字号且每批固定 40 条的高密滚动弹幕瀑布。
// v1.54.0: 构建滚动弹幕瀑布超密模式。
// v1.53.0: 构建更小字号、更高批量与更高频率的滚动弹幕瀑布。
// v1.52.0: 在卡内演绎指南加入候选选项防剧透协议，锁定“选行为，不选结果”。
// v1.51.0: 锁死额外解析输出的 UpdateVariable/JSONPatch 双层容器，防止裸数组解析失败。
// v1.50.0: 将常驻阶段大纲精简为导航总控，并把 00 至 02 关键细节迁入动态日常详案。
// v1.49.0: 构建六段式携瞳私奔旅程与毒娘子、追猎队、涂山巡守三条绿灯世界书。
// v1.48.0: 构建持剑必胜的三段式王权家夺权短线。
// v1.47.0: 构建蛛丝之外五幕关系修复线与三种玩家结算出口。
// v1.46.0: 构建持剑破阵、长老战、深山自由行动与无心之剑配角余波。
// v1.45.0: 构建携瞳远走涂山延伸与雅雅、容容、翠玉灵三条绿灯 NPC 条目。
// v1.44.0: 构建执剑夺权与携瞳远走两条自由主线及其动态详案。
// v1.43.0: 构建黄风城圈外幕后因果与风庭云、金灵鳞、涂山红红、毒娘子后续收束。
// v1.42.0: 构建清瞳卧底真相、关系里程碑、风庭云发现与主殿在场，以及非固定对白推进。
// v1.41.0: 构建偏离承接、关系修复/独立前路、清瞳待填核心人设与山庄日常详案。
// v1.40.0: 构建可偏离参考轨道、五档关系门槛与补强后的配角人设。
// v1.39.0: 新增黄风城觉醒、红线家法、一剑开天、12580 真相与龙湾衔接的分阶段详案。
// v1.38.0: 首次绘景补全误判斩丝、花朵揭示、王权家全景织锦与“成为你的眼睛”固定对白。
// v1.37.0: 次日问妖后改为相隔数日初画，补充清瞳绕行山庄寻找最佳绘景角度的过程。
// v1.36.0: 撤回清瞳代写人设并恢复五档空槽位；拔剑弹幕与 BGM 持续到对应回复落地。
// v1.35.0: 清瞳人设扩展为固定核心、双形态专项与五档完整关系人格的模块化总控。
// v1.34.0: 完成清瞳固定核心、五档好感人设、性格对冲与不可逆双形态契约。
// v1.33.0: 拔剑联动状态适配额外模型解析覆盖，并恢复本地《梦回还》BGM 配置。
// v1.32.0: 阶段变量完全由额外解析模型按正文证据更新，移除脚本写回纠正。
// v1.31.0: 弃剑与持剑流程统一先挥剑斩断捆妖索，再按是否留剑分流。
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
  bullethellPlayerSprite: path.join(projectRoot, 'assets', 'bullethell-player.webp'),
  openingInitController: path.join(projectRoot, 'src', 'opening-init-controller.js'),
  mediaConfig: path.join(projectRoot, 'config', 'media-assets.json'),
  dreamReturnAudio: path.join(projectRoot, '音乐', '呦猫UNEKO - 梦回还·内嵌压缩版.mp3'),
  initVar: path.join(projectRoot, 'worldbook', '00-initvar.yaml'),
  updateRules: path.join(projectRoot, 'worldbook', '10-update-rules.txt'),
  currentVariables: path.join(projectRoot, 'worldbook', '20-current-variables.txt'),
  plotGuide: path.join(projectRoot, 'worldbook', '30-plot-guide.txt'),
  stageOutline: path.join(projectRoot, 'worldbook', '40-stage-outline.txt'),
  wangquanBayePersona: path.join(projectRoot, 'worldbook', '41-npc-wangquan-baye.txt'),
  fengTingyunPersona: path.join(projectRoot, 'worldbook', '42-npc-fengtingyun.txt'),
  dongfangYuechuPersona: path.join(projectRoot, 'worldbook', '43-npc-dongfang-yuechu.txt'),
  tushanHonghongPersona: path.join(projectRoot, 'worldbook', '44-npc-tushan-honghong.txt'),
  stageDetailController: path.join(projectRoot, 'worldbook', '45-stage-detail-controller.ejs'),
  stageDetailEntries: [
    '46-stage-detail-huangfeng-anger.txt',
    '47-stage-detail-redline-family-law.txt',
    '48-stage-detail-heaven-sword-betrayal.txt',
    '49-stage-detail-12580-dragonbay.txt',
  ].map((filename) => path.join(projectRoot, 'worldbook', filename)),
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
  tushanNpcEntries: [
    '79-npc-tushan-yaya.txt',
    '80-npc-tushan-rongrong.txt',
    '81-npc-cuiyuling.txt',
    '82-npc-duniangzi.txt',
    '83-npc-wangquan-pursuit.txt',
    '84-npc-tushan-border-patrol.txt',
  ].map((filename) => path.join(projectRoot, 'worldbook', filename)),
  qingTongCorePersona: path.join(projectRoot, 'worldbook', '56-qingtong-core-persona.txt'),
  wangquanDailyDetail: path.join(projectRoot, 'worldbook', '57-stage-detail-wangquan-daily.txt'),
  freeMainlineDetail: path.join(projectRoot, 'worldbook', '58-stage-detail-free-mainlines.txt'),
  qingTongSpiderlingOverride: path.join(projectRoot, 'worldbook', '59-qingtong-form-override-spiderling.txt'),
  qingTongPureSpiderOverride: path.join(projectRoot, 'worldbook', '61-qingtong-form-override-pure-spider.txt'),
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
  if (entries.length !== 42) throw new Error(`世界书条目数量异常：${entries.length}`);
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
  bullethellPlayerSprite,
  openingInitController,
  mediaConfigRaw,
  dreamReturnAudio,
  initVar,
  updateRules,
  currentVariables,
  plotGuide,
  stageOutline,
  wangquanBayePersona,
  fengTingyunPersona,
  dongfangYuechuPersona,
  tushanHonghongPersona,
  stageDetailController,
  stageDetailEntries,
  worldCore,
  factionEntries,
  tushanNpcEntries,
  stagePersona,
  affinityPersonaSlots,
  qingTongCorePersona,
  wangquanDailyDetail,
  freeMainlineDetail,
  qingTongSpiderlingOverride,
  qingTongPureSpiderOverride,
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
  readFile(paths.bullethellPlayerSprite),
  readText(paths.openingInitController),
  readText(paths.mediaConfig),
  readFile(paths.dreamReturnAudio),
  readText(paths.initVar),
  readText(paths.updateRules),
  readText(paths.currentVariables),
  readText(paths.plotGuide),
  readText(paths.stageOutline),
  readText(paths.wangquanBayePersona),
  readText(paths.fengTingyunPersona),
  readText(paths.dongfangYuechuPersona),
  readText(paths.tushanHonghongPersona),
  readText(paths.stageDetailController),
  Promise.all(paths.stageDetailEntries.map(readText)),
  readText(paths.worldCore),
  Promise.all(paths.factionEntries.map(readText)),
  Promise.all(paths.tushanNpcEntries.map(readText)),
  readText(paths.stagePersona),
  Promise.all(paths.affinityPersonaSlots.map(readText)),
  readText(paths.qingTongCorePersona),
  readText(paths.wangquanDailyDetail),
  readText(paths.freeMainlineDetail),
  readText(paths.qingTongSpiderlingOverride),
  readText(paths.qingTongPureSpiderOverride),
  readText(paths.statusbarProtocol),
]);

const mediaConfig = JSON.parse(mediaConfigRaw);
const embeddedDreamReturnPlaceholder = '__HYXHN_EMBEDDED_DREAM_RETURN_MP3__';
if (mediaConfig?.tracks?.dream_return?.src !== embeddedDreamReturnPlaceholder) {
  throw new Error(`媒体配置缺少内嵌音乐占位符：${embeddedDreamReturnPlaceholder}`);
}
const builtMediaConfig = structuredClone(mediaConfig);
builtMediaConfig.tracks.dream_return.src = `data:audio/mpeg;base64,${dreamReturnAudio.toString('base64')}`;
const mediaConfigPlaceholder = '__HYXHN_MEDIA_CONFIG__';
if (!mediaConfigScript.includes(mediaConfigPlaceholder)) {
  throw new Error(`媒体配置脚本缺少构建占位符：${mediaConfigPlaceholder}`);
}
const builtMediaConfigScript = mediaConfigScript.replace(
  mediaConfigPlaceholder,
  JSON.stringify(builtMediaConfig),
);
const swordIconPlaceholder = '__HYXHN_SWORD_ICON_DATA_URL__';
if (!controller.includes(swordIconPlaceholder)) {
  throw new Error(`媒体控制器缺少王权剑图标占位符：${swordIconPlaceholder}`);
}
const swordIconDataUrl = `data:image/jpeg;base64,${swordIcon.toString('base64')}`;
const builtController = controller.replace(swordIconPlaceholder, swordIconDataUrl);
const bullethellPlayerSpritePlaceholder = '__HYXHN_BULLETHELL_PLAYER_SPRITE_DATA_URL__';
if (!bullethellController.includes(bullethellPlayerSpritePlaceholder)) {
  throw new Error(`无尽剑幕脚本缺少玩家角色图占位符：${bullethellPlayerSpritePlaceholder}`);
}
const bullethellPlayerSpriteDataUrl = `data:image/webp;base64,${bullethellPlayerSprite.toString('base64')}`;
const builtBullethellController = bullethellController.replace(
  bullethellPlayerSpritePlaceholder,
  bullethellPlayerSpriteDataUrl,
);
const statusbarPlaceholder = '__HYXHN_STATUSBAR_HTML__';
if (!statusbarController.includes(statusbarPlaceholder)) {
  throw new Error(`状态栏控制器缺少构建占位符：${statusbarPlaceholder}`);
}
const builtStatusbarController = statusbarController.replace(statusbarPlaceholder, JSON.stringify(statusbarHtml));
const evidenceRulesMarker = '证据纪律:';
const evidenceRulesIndex = updateRules.indexOf(evidenceRulesMarker);
if (evidenceRulesIndex < 0) {
  throw new Error(`变量更新规则缺少派生锚点：${evidenceRulesMarker}`);
}
const mainModelUpdateRules = `王权篇主模型变量更新规则 v1.0.0

身份与输出协议:
  - 你是剧情主模型。先正常完成本轮正文；随后根据“王权篇当前变量”、玩家本轮已经发送的行动以及你刚写完的正文，计算本轮变量变化
  - 每轮正文后恰好输出一个变量块，严格使用 <UpdateVariable><JSONPatch>JSON 数组</JSONPatch></UpdateVariable>
  - <UpdateVariable> 的唯一直接子节点必须是一个 <JSONPatch>；禁止裸数组、第二个变量块、Analysis/Analyze、Markdown 代码围栏、MVU_Status 或 stat_data 镜像
  - 有变化时在同一个 JSON 数组中输出全部 patch；无变化时输出 <UpdateVariable><JSONPatch>[]</JSONPatch></UpdateVariable>
  - 只允许更新既有路径：/剧情/当前阶段、/剧情/最终抉择、/剧情/轨道状态、/剧情/承接约束、/剧情/时间、/剧情/地点、/清瞳/状态、/清瞳/好感度、/清瞳/心声
  - 更新既有字段统一使用 replace；不得新增 schema 外字段
  - 主模型补丁是额外 MVU 接口失败时的落库兜底；额外模型成功时会在同一楼层追加复核补丁，因此必须严格遵守下方相同证据门槛，避免两套结果冲突

${updateRules.slice(evidenceRulesIndex)}`;
const entryList = [
  makeEntry({ uid: 100, comment: '[InitVar]王权篇变量初始化勿开', content: initVar, enabled: false, order: 100 }),
  makeEntry({ uid: 110, comment: '[mvu_update]王权篇变量更新规则', content: updateRules, order: 110 }),
  makeEntry({ uid: 111, comment: '[mvu_plot]王权篇主模型变量更新规则', content: mainModelUpdateRules, order: 111 }),
  makeEntry({ uid: 120, comment: '王权篇当前变量', content: currentVariables, order: 120 }),
  makeEntry({ uid: 130, comment: '[mvu_plot]王权篇演绎指南', content: plotGuide, order: 130 }),
  makeEntry({ uid: 140, comment: '[mvu_plot]王权篇阶段剧情', content: stageOutline, order: 140 }),
  makeEntry({
    uid: 141,
    comment: '[mvu_plot]配角人设·王权霸业',
    content: wangquanBayePersona,
    constant: false,
    order: 141,
    keys: ['王权霸业', '王权家主', '家主大人', '少主之父', '父亲', '东方淮竹'],
  }),
  makeEntry({
    uid: 142,
    comment: '[mvu_plot]配角人设·风庭云',
    content: fengTingyunPersona,
    constant: false,
    order: 142,
    keys: ['风庭云', '庭云', '风师妹', '师妹', '{{user}}的师妹'],
  }),
  makeEntry({
    uid: 143,
    comment: '[mvu_plot]男三人设·东方月初',
    content: dongfangYuechuPersona,
    constant: false,
    order: 143,
    keys: ['东方月初', '月初', '东方公子', '东方盟主', '一气道盟盟主', '少主的表弟'],
  }),
  makeEntry({
    uid: 144,
    comment: '[mvu_plot]重要配角人设·涂山红红',
    content: tushanHonghongPersona,
    constant: false,
    order: 144,
    keys: ['涂山红红', '红红', '红红姐', '涂山之主', '妖盟盟主', '狐妖之王'],
  }),
  makeEntry({ uid: 145, comment: '[mvu_plot]王权篇阶段详案控制器', content: stageDetailController, order: 145 }),
  ...[
    '[mvu_plot]阶段详案·黄风怒火',
    '[mvu_plot]阶段详案·红线家法',
    '[mvu_plot]阶段详案·开天与叛门',
    '[mvu_plot]阶段详案·一二五八零与龙湾',
  ].map((comment, index) => makeEntry({
    uid: 146 + index,
    comment,
    content: stageDetailEntries[index],
    enabled: false,
    constant: false,
    order: 146 + index,
  })),
  makeEntry({ uid: 150, comment: '[mvu_plot]清瞳好感人设控制器', content: stagePersona, order: 150 }),
  ...affinityPersonaSlots.map((content, index) => makeEntry({
    uid: 151 + index,
    comment: `[mvu_plot]清瞳好感人设槽位·${['00-19', '20-39', '40-59', '60-79', '80-100'][index]}`,
    content,
    enabled: false,
    constant: false,
    order: 151 + index,
  })),
  makeEntry({
    uid: 156,
    comment: '[mvu_plot]清瞳核心人设',
    content: qingTongCorePersona,
    enabled: false,
    constant: false,
    order: 156,
  }),
  makeEntry({
    uid: 157,
    comment: '[mvu_plot]阶段详案·王权山庄日常',
    content: wangquanDailyDetail,
    enabled: false,
    constant: false,
    order: 157,
  }),
  makeEntry({
    uid: 158,
    comment: '[mvu_plot]阶段详案·自由主线',
    content: freeMainlineDetail,
    enabled: false,
    constant: false,
    order: 158,
  }),
  makeEntry({
    uid: 159,
    comment: '可选形态覆写·清瞳始终小蜘蛛娘',
    content: qingTongSpiderlingOverride,
    enabled: false,
    constant: true,
    order: 9900,
  }),
  makeEntry({ uid: 160, comment: '[mvu_plot]王权篇状态栏输出协议', content: statusbarProtocol, order: 160 }),
  makeEntry({
    uid: 161,
    comment: '可选形态覆写·清瞳始终纯小蜘蛛',
    content: qingTongPureSpiderOverride,
    enabled: false,
    constant: true,
    order: 9901,
  }),
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
  ...[
    { uid: 179, comment: '[mvu_plot]涂山NPC·涂山雅雅', keys: ['涂山雅雅', '雅雅', '雅雅小姐', '无尽酒壶', '寒冰妖气'] },
    { uid: 180, comment: '[mvu_plot]涂山NPC·涂山容容', keys: ['涂山容容', '容容', '容老板', '涂山二当家', '千面妖容'] },
    { uid: 181, comment: '[mvu_plot]涂山NPC·翠玉灵', keys: ['翠玉灵', '翠姐姐', '蛭妖之王', '妖界名医', '血液医术'] },
    { uid: 182, comment: '[mvu_plot]私奔线NPC·毒娘子', keys: ['毒娘子', '五毒太保', '清瞳的上级', '12580上级', '毒夫子', '蜘蛛毒'] },
    { uid: 183, comment: '[mvu_plot]私奔线群像·王权追猎队', keys: ['王权追猎队', '王权追兵', '山庄追兵', '追捕弟子', '追索队', '王权巡守'] },
    { uid: 184, comment: '[mvu_plot]私奔线群像·涂山边境巡守', keys: ['涂山边境巡守', '涂山守卫', '狐妖巡守', '边境守卫', '涂山关卡', '涂山巡逻队'] },
  ].map((config, index) => makeEntry({ ...config, content: tushanNpcEntries[index], constant: false, order: config.uid })),
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
  info: '独立媒体配置。《梦回还》已编码在脚本内，可离线播放；无需图床、本地媒体服务器或云端地址。',
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
  content: builtBullethellController,
  info: '全屏无尽躲弹幕试炼。玩家角色图已压缩并编码进脚本，碰撞仍使用独立小判定点；结束后不发送消息、不触发生成。',
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
