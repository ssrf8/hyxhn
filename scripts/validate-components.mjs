// 狐妖小红娘·王权篇部件验证器 v1.39.0
// v1.39.0: 验证十三阶段、动态详案、黄风城至龙湾主线及新版救场链。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, readdir } from 'node:fs/promises';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const requiredScriptFields = ['type', 'enabled', 'name', 'id', 'content', 'info', 'button', 'data', 'export_with'];
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const expectedFilenames = [
  '01-王权篇测试世界书.json',
  '02-王权篇MVU加载器.json',
  '03-王权篇变量结构.json',
  '04-王权篇媒体资源配置.json',
  '05-王权篇顶层弹幕与音乐.json',
  '06-王权篇状态栏控制器.json',
  '07-王权篇无尽剑幕试炼.json',
  '08-王权篇开场变量同步.json',
];
const filenames = (await readdir(distDir)).filter((name) => name.endsWith('.json')).sort();
assert(JSON.stringify(filenames) === JSON.stringify(expectedFilenames), `构建产物清单异常：${filenames.join(', ')}`);

const parsed = new Map();
for (const filename of filenames) {
  const raw = await readFile(path.join(distDir, filename), 'utf8');
  assert(!raw.includes('file:///'), `${filename} 不应包含 file URL`);
  parsed.set(filename, JSON.parse(raw));
}

const worldbook = parsed.get(expectedFilenames[0]);
const entries = Object.entries(worldbook?.entries || {});
assert(entries.length === 30, `世界书应有 30 条，实际为 ${entries.length}`);
for (const [key, entry] of entries) {
  assert(key === String(entry.uid), `世界书键 ${key} 与 uid ${entry.uid} 不一致`);
  assert(entry.excludeRecursion && entry.preventRecursion, `${entry.comment} 未双禁递归`);
}
const byComment = (fragment) => entries.map(([, entry]) => entry).find((entry) => entry.comment.includes(fragment));
const initVar = byComment('[InitVar]');
assert(initVar?.enabled === false && initVar.disable === true, '[InitVar] 必须禁用');
const updateRules = byComment('变量更新规则');
const stageOutline = byComment('王权篇阶段剧情');
const detailController = byComment('王权篇阶段详案控制器');
assert(updateRules?.comment.startsWith('[mvu_update]'), '变量更新规则路由异常');
assert(updateRules.content.includes('王权篇变量更新规则 v2.0.0'), '变量更新规则版本异常');
assert(stageOutline?.content.includes('王权篇阶段剧情 v3.0.0'), '阶段骨架版本异常');
assert(detailController?.content.includes('剧情详案控制器 v1.0.0'), '阶段详案控制器缺失');
assert(detailController.content.includes('await getwi(') && !detailController.content.includes('const '), '阶段详案控制器不符合 EJS/getwi 约束');

const detailComments = [
  '阶段详案·黄风怒火',
  '阶段详案·红线家法',
  '阶段详案·开天与叛门',
  '阶段详案·一二五八零与龙湾',
];
for (const comment of detailComments) {
  const entry = byComment(comment);
  assert(entry && entry.enabled === false && entry.constant === false, `${comment} 应为禁用的动态详案`);
  assert(detailController.content.includes(`[mvu_plot]${comment}`), `控制器未引用 ${comment}`);
}

const requiredPlotPoints = [
  '闻伯霖战死黄风城外', '恶喙兽放大王权霸业怒火', '鹿妖在临死前从暴怒恢复清明',
  '尸山血海', '操控群妖的仇恨红线', '彼此认出却一言未发', '自困密室',
  '金灵鳞突然获得近似妖皇的力量', '斩断凤牺临走前留下的控制中枢',
  '身外不得出现笼子、牢笼、囚车、铁笼、刑架、封妖箱、结界容器',
  '第一个完整动作都是王权富贵主动挥出一剑、精准斩断捆妖索且不伤清瞳',
  '身上插满剑，怀中清瞳仍安然无恙', '东方月初赶到，以纯质阳炎炼去整座剑阵',
  '王权霸业在这一剑后愿意放王权富贵离开', '代号 12580',
  '清瞳不怕死，只求以我之命，以证我心', '用不着，我信你',
  '只要我王权在手，无人可伤我们分毫', '破除她桂冠上毒夫子留下的封禁', '龙湾',
];
const allPlotText = entries.map(([, entry]) => entry.content).join('\n');
for (const point of requiredPlotPoints) assert(allPlotText.includes(point), `缺少剧情硬点：${point}`);
assert(allPlotText.includes('不得把毒娘子单方面揭露直接扩写成“所有感情均为骗局”'), '缺少 12580 对冲约束');
assert(allPlotText.includes('不得自动复制弃剑路线'), '持剑分支未与弃剑固定链隔离');

const schema = parsed.get('03-王权篇变量结构.json');
const schemaContent = schema.content;
const stageBlock = schemaContent.slice(schemaContent.indexOf('const STAGES = ['), schemaContent.indexOf('];', schemaContent.indexOf('const STAGES = [')));
const stages = [...stageBlock.matchAll(/'(\d{2}_[^']+)'/g)].map((match) => match[1]);
assert(stages.length === 13 && new Set(stages).size === 13, `Schema 阶段枚举应为 13，实际 ${stages.length}`);
for (const stage of stages) {
  assert(updateRules.content.includes(stage), `变量规则缺少阶段 ${stage}`);
  assert(stageOutline.content.includes(stage), `阶段骨架缺少阶段 ${stage}`);
}
for (const oldStage of ['03_相知_画中山河', '04_决裂_出逃山庄', '04_决裂_此去无归', '05_尾声_万水千山', '05_结局_无心之剑']) {
  assert(schemaContent.includes(`'${oldStage}'`), `Schema 缺少旧存档迁移 ${oldStage}`);
}

const media = parsed.get('05-王权篇顶层弹幕与音乐.json');
assert(media.content.includes('v2.19.0'), '媒体控制器版本异常');
assert(media.content.includes("const DECISION_STAGE = '07_决裂_此去无归'"), '拔剑窗口决裂阶段异常');
for (const stage of stages) assert(media.content.includes(`'${stage}'`), `媒体事件缺少阶段 ${stage}`);
assert(media.content.includes("music: 'dream_return'"), '《梦回还》阶段音乐配置缺失');
assert(media.content.includes('tavern_events.MESSAGE_RECEIVED') && media.content.includes('stopPostChoiceFollowupEffect'), '弹幕/BGM 未绑定正常回复完成事件');

const statusbar = parsed.get('06-王权篇状态栏控制器.json');
assert(statusbar.content.includes('v1.2.0'), '状态栏版本异常');
for (const stage of stages) assert(statusbar.content.includes(`'${stage}'`), `状态栏缺少阶段 ${stage}`);

const scripts = expectedFilenames.slice(1).map((filename) => parsed.get(filename));
const ids = new Set();
for (const script of scripts) {
  for (const field of requiredScriptFields) assert(Object.hasOwn(script, field), `${script.name || '脚本'} 缺少字段 ${field}`);
  assert(!ids.has(script.id), `脚本 UUID 重复：${script.id}`);
  ids.add(script.id);
}
assert(scripts.length === 7 && ids.size === 7, '脚本数量或 UUID 唯一性异常');
assert(![...parsed.values()].some((value) => JSON.stringify(value).includes('hyxhn_wangquan_roguelite_requested')), '仍残留肉鸽请求事件');

const bullethell = parsed.get('07-王权篇无尽剑幕试炼.json');
assert(bullethell.button.buttons.length === 1 && bullethell.button.buttons[0].name === '开始无尽剑幕试炼', '无尽剑幕按钮异常');
assert(bullethell.content.includes("music: 'dream_return'") || bullethell.content.includes("playTrack('dream_return'"), '无尽剑幕未接入《梦回还》');

console.log('验证通过');
console.log('- 8 个 JSON 可解析，7 支脚本九字段完整且 UUID 唯一');
console.log('- 世界书 30 条，含 13 阶段与 4 条动态剧情详案');
console.log('- 黄风城、主殿抉择、12580 真相、王权再起与龙湾衔接均已固化');
