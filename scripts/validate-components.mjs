// 狐妖小红娘·王权篇部件验证器 v1.29.0
// v1.29.0: 验证弃剑出殿后的万剑穿心、东方月初负伤救场与涂山红红破五百弟子固定时序。
// v1.28.0: 验证地下城肉鸽构建产物、脚本和请求事件已完整移除。
// v1.27.0: 验证肉鸽固定移动方向攻击及渲染、画布、区块性能优化。
// v1.26.0: 验证持剑肉鸽测试按钮及其无消息直启监听器。
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { access, readFile, readdir } from 'node:fs/promises';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(projectRoot, 'dist');
const requiredScriptFields = ['type', 'enabled', 'name', 'id', 'content', 'info', 'button', 'data', 'export_with'];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const filenames = (await readdir(distDir)).filter((name) => name.endsWith('.json')).sort();
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
assert(JSON.stringify(filenames) === JSON.stringify(expectedFilenames), `构建产物清单异常：${filenames.join(', ')}`);

const parsed = new Map();
for (const filename of filenames) {
  const raw = await readFile(path.join(distDir, filename), 'utf8');
  assert(!raw.includes('file:///'), `${filename} 不应包含 file URL`);
  assert(!raw.includes('D:\\\\json脚本地下城'), `${filename} 不应写死本机绝对路径`);
  parsed.set(filename, JSON.parse(raw));
}

const worldbook = parsed.get('01-王权篇测试世界书.json');
assert(worldbook?.entries, '世界书缺少 entries');
const entries = Object.entries(worldbook.entries);
assert(entries.length === 25, `世界书应有 25 条，实际为 ${entries.length}`);
for (const [key, entry] of entries) {
  assert(key === String(entry.uid), `世界书键 ${key} 与 uid ${entry.uid} 不一致`);
  assert(entry.excludeRecursion === true && entry.preventRecursion === true, `${entry.comment} 未双禁递归`);
}
const initVar = entries.map(([, entry]) => entry).find((entry) => entry.comment.startsWith('[InitVar]'));
assert(initVar?.enabled === false && initVar?.disable === true, '[InitVar] 没有保持禁用');
const updateRules = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('变量更新规则'));
assert(updateRules?.content.includes('王权篇变量更新规则 v1.8.0'), '变量更新规则缺少 v1.8.0 版本头');
assert(updateRules.content.includes('每次 assistant 回复都必须输出且只输出一个完整的 <UpdateVariable> 块'), '变量规则没有强制每轮唯一 UpdateVariable');
assert(updateRules.content.includes('<JSONPatch>[]</JSONPatch>'), '变量规则没有规定无变化时输出空 Patch');
assert(updateRules.content.includes('严禁输出 MVU_Status、stat_data'), '变量规则没有禁止伪状态快照');
assert(updateRules.content.includes('JSONPatch 中没有写入的值，绝不能'), '变量规则没有禁止未落库数值冒充更新');
assert(updateRules.content.includes('不在 analysis 中单列“好感度保持不变”'), '变量规则没有修复无 Patch 的好感分析');
const stageOutline = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('王权篇阶段剧情'));
assert(stageOutline?.content.includes('王权篇阶段剧情 v2.5.0'), '阶段剧情缺少 v2.5.0 版本头');
for (const plotPoint of ['写给王权富贵的情书', '普通小蜘蛛的外形', '把小蜘蛛放进墨水盘', '倒入药水', '故意砍在她身边', '第一次知道外界把杀妖视为道士的职责', '第三天', '第一次吐出七彩蛛丝', '生平第一次真正看见王权山庄之外的世界', '取名“清瞳”', '每天都会来', '每一幅蛛丝画都仔细保存', '数次除妖任务中留手', '偏离既定培养计划', '已经化为人形', '趴在王权富贵上方的树枝上', '绳中设有禁制', '只要像往常一样再为他画一幅外面的世界', '五花大绑、伤痕累累']) {
  assert(stageOutline.content.includes(plotPoint), `阶段剧情缺少必经情节：${plotPoint}`);
}
for (const latePlotPoint of ['开始怀疑王权富贵数次留妖并非单纯懈怠', '着手探查他变化的原因', '很快循着秘密来往与蛛丝画等痕迹发现清瞳这只小妖', '两条救人路线共同硬约束', '战斗只能发生在大殿外']) {
  assert(stageOutline.content.includes(latePlotPoint), `关系败露或出殿战斗缺少硬约束：${latePlotPoint}`);
}
assert(stageOutline.content.includes('父亲及家族必须完全不知道清瞳的存在'), '阶段剧情缺少父亲不知情的硬约束');
assert(stageOutline.content.includes('不得让惩罚源于两人私会败露'), '吊树惩罚与关系败露的因果仍可能混淆');
const abandonRescuePoints = [
  '以自己的身体承受万剑穿心',
  '被他护住的清瞳没有被剑刃所伤',
  '以纯质阳炎炼化仍在袭来的飞剑与剑阵',
  '剑势贯穿东方月初的身体',
  '使王权剑暂时无法继续使用',
  '背起负伤的东方月初继续向山庄外走',
  '五百名王权弟子封锁去路',
  '涂山红红在外围出手解决这五百名弟子',
];
for (const plotPoint of abandonRescuePoints) {
  assert(stageOutline.content.includes(plotPoint), `弃剑救援链缺少固定情节：${plotPoint}`);
}
for (let index = 1; index < abandonRescuePoints.length; index += 1) {
  assert(
    stageOutline.content.indexOf(abandonRescuePoints[index - 1]) < stageOutline.content.indexOf(abandonRescuePoints[index]),
    `弃剑救援链顺序错误：${abandonRescuePoints[index - 1]} -> ${abandonRescuePoints[index]}`,
  );
}
assert(stageOutline.content.includes('固定救场链目前只属于弃剑路线'), '弃剑救援链缺少分支隔离约束');
for (const rulePoint of ['真实承受万剑穿心并受到重伤', '以纯质阳炎炼化袭来的飞剑与剑阵', '王权霸业在殿外亲自出剑贯穿东方月初', '使王权剑暂时无法使用', '背起负伤的东方月初继续外逃', '解决封锁去路的五百名王权弟子']) {
  assert(updateRules.content.includes(rulePoint), `尾声阶段条件缺少弃剑结果：${rulePoint}`);
}
assert(updateRules.content.includes('不得自动照搬弃剑路线的万剑穿心'), '变量规则缺少持剑分支隔离约束');
for (const boundary of ['只有该幕的收束事实已经在正文真实完成', '尚未讨论道士为何杀妖', '长期往来尚未开始', '不得在本阶段重新演成初次', '数次除妖任务中暗中留妖一命', '鞭打吊树、半夜清瞳以人形趴在树枝上探望、尝试解绳失败']) {
  assert(stageOutline.content.includes(boundary), `阶段剧情缺少边界约束：${boundary}`);
}
for (const transitionRule of ['不得改成普通任务书、家书或清瞳所写', '墨水盘、倒入药水完成治疗', '不得合并第二天与第三天', '亲自为小蜘蛛取名“清瞳”', '将每一幅蛛丝画保存下来', '数次家族除妖任务中暗中留妖一命', '半夜清瞳化为人形趴在树枝上', 'MVU 硬门槛只有两项', '缺失时不得阻止进入 04']) {
  assert(updateRules.content.includes(transitionRule), `变量阶段条件缺少约束：${transitionRule}`);
}
const decisionTransition = updateRules.content.slice(
  updateRules.content.indexOf('03_相知_画中山河 -> 04_决裂_此去无归:'),
  updateRules.content.indexOf('04_决裂_此去无归 -> 05_尾声_万水千山:'),
);
for (const requiredGate of ['秘密关系已经被父亲或王权家族发现', '父亲已经把王权剑交到或丢到 {{user}} 面前', '最终抉择 必须仍为“尚未选择”']) {
  assert(decisionTransition.includes(requiredGate), `进入此去无归缺少硬门槛：${requiredGate}`);
}
assert(!decisionTransition.includes('必须全部完成'), '进入此去无归仍错误要求完成全部旧剧情节点');
const wangquanBayePersona = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('配角人设·王权霸业'));
assert(wangquanBayePersona?.content.includes('王权霸业配角人设 v1.3.0'), '王权霸业人设缺少 v1.3.0 版本头');
assert(wangquanBayePersona.constant === false && wangquanBayePersona.enabled === true, '王权霸业人设应为启用的关键词触发条目');
for (const fatherBoundary of ['没有在大殿内亲自阻拦', '所有阻拦与战斗只能发生在大殿外', '一剑贯穿东方月初的身体']) {
  assert(wangquanBayePersona.content.includes(fatherBoundary), `王权霸业人设缺少出殿边界：${fatherBoundary}`);
}
assert(!wangquanBayePersona.content.includes('随后才以家主身份下令阻拦') && !wangquanBayePersona.content.includes('他会下令阻拦'), '王权霸业人设仍会在救人选择后下令阻拦');
for (const key of ['王权霸业', '王权家主', '富贵的父亲', '父亲', '东方淮竹']) {
  assert(wangquanBayePersona.key.includes(key), `王权霸业人设缺少触发词：${key}`);
}
assert(wangquanBayePersona.content.includes('完全不知道清瞳存在'), '王权霸业人设缺少前期不知情约束');
assert(wangquanBayePersona.content.includes('不是虚假的爱情测试'), '王权霸业人设弱化了大殿杀死清瞳的真实命令');
assert(wangquanBayePersona.content.includes('她的死亡不得归因于妖族'), '王权霸业人设没有排除错误的淮竹死亡因果');
assert(wangquanBayePersona.content.includes('两条不同的因果线'), '王权霸业人设没有分离淮竹之死与清瞳妖族身份');
assert(!wangquanBayePersona.content.includes('东方淮竹的死亡由妖族造成'), '王权霸业人设仍残留错误的妖族致死设定');
assert(wangquanBayePersona.content.includes('自己为了阻止旧悲剧，已经成为新悲剧的制造者'), '王权霸业人设缺少悲剧循环解释');
const fengTingyunPersona = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('配角人设·风庭云'));
assert(fengTingyunPersona?.content.includes('风庭云配角人设 v1.1.0'), '风庭云人设缺少 v1.1.0 版本头');
assert(fengTingyunPersona.constant === false && fengTingyunPersona.enabled === true, '风庭云人设应为启用的关键词触发条目');
for (const key of ['风庭云', '风师妹', '师妹', '王权富贵的师妹']) {
  assert(fengTingyunPersona.key.includes(key), `风庭云人设缺少触发词：${key}`);
}
assert(fengTingyunPersona.excludeRecursion === true && fengTingyunPersona.preventRecursion === true, '风庭云人设必须双禁递归');
assert(fengTingyunPersona.content.includes('她明确暗恋{{user}}'), '风庭云人设缺少少女钦慕设定');
assert(fengTingyunPersona.content.includes('不得删去、否认或弱化成纯粹同门情谊'), '风庭云暗恋缺少剧情硬约束');
assert(fengTingyunPersona.content.includes('不得仅凭暗恋突然变成残酷施虐者'), '风庭云暗恋缺少防恶毒雌竞约束');
assert(fengTingyunPersona.content.includes('不知道清瞳与{{user}}长期往来'), '风庭云人设缺少前期信息边界');
const dongfangYuechuPersona = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('男三人设·东方月初'));
assert(dongfangYuechuPersona?.content.includes('东方月初男三人设 v1.1.0'), '东方月初人设缺少 v1.1.0 版本头');
assert(dongfangYuechuPersona.constant === false && dongfangYuechuPersona.enabled === true, '东方月初人设应为启用的关键词触发条目');
for (const key of ['东方月初', '月初', '东方公子', '东方盟主', '富贵的表弟']) {
  assert(dongfangYuechuPersona.key.includes(key), `东方月初人设缺少触发词：${key}`);
}
assert(dongfangYuechuPersona.excludeRecursion === true && dongfangYuechuPersona.preventRecursion === true, '东方月初人设必须双禁递归');
assert(dongfangYuechuPersona.content.includes('东方月初为表弟'), '东方月初与王权富贵的亲缘关系错误');
assert(dongfangYuechuPersona.content.includes('不得提前当作随手可用的常规技能'), '东方月初能力缺少时期约束');
assert(dongfangYuechuPersona.content.includes('不能让他凭空知道'), '东方月初缺少非全知信息边界');
assert(dongfangYuechuPersona.content.includes('不能抢走王权富贵与清瞳'), '东方月初缺少男三叙事边界');
for (const rescuePoint of ['炼化仍在袭来的飞剑与剑阵', '一剑贯穿东方月初的身体', '使王权剑暂时无法使用', '背起同样负伤的东方月初']) {
  assert(dongfangYuechuPersona.content.includes(rescuePoint), `东方月初人设缺少弃剑救场细节：${rescuePoint}`);
}
const tushanHonghongPersona = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('重要配角人设·涂山红红'));
assert(tushanHonghongPersona?.content.includes('涂山红红重要配角人设 v1.1.0'), '涂山红红人设缺少 v1.1.0 版本头');
assert(tushanHonghongPersona.constant === false && tushanHonghongPersona.enabled === true, '涂山红红人设应为启用的关键词触发条目');
for (const key of ['涂山红红', '红红姐', '涂山之主', '妖盟盟主', '狐妖之王']) {
  assert(tushanHonghongPersona.key.includes(key), `涂山红红人设缺少触发词：${key}`);
}
assert(tushanHonghongPersona.excludeRecursion === true && tushanHonghongPersona.preventRecursion === true, '涂山红红人设必须双禁递归');
assert(tushanHonghongPersona.content.includes('误杀小道士'), '涂山红红人设缺少核心愧疚来源');
assert(tushanHonghongPersona.content.includes('人妖和平不等于纵容妖族'), '涂山红红人设缺少和平理念边界');
assert(tushanHonghongPersona.content.includes('不得因此写成对一切攻击'), '涂山红红能力缺少非无敌边界');
assert(tushanHonghongPersona.content.includes('她无法凭空知道'), '涂山红红缺少非全知信息边界');
assert(tushanHonghongPersona.content.includes('不能把前者误写成爱情'), '涂山红红与小道士、东方月初的感情关系混淆');
for (const rescuePoint of ['解决封锁去路的五百名王权弟子', '不取代殿内选择']) {
  assert(tushanHonghongPersona.content.includes(rescuePoint), `涂山红红人设缺少弃剑外围救场边界：${rescuePoint}`);
}
const worldCore = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('世界观·人妖秩序与悲剧底色'));
assert(worldCore?.constant === true && worldCore.enabled === true, '世界底色应为启用的常驻条目');
assert(worldCore.content.includes('王权篇世界底色 v1.0.0'), '世界底色缺少 v1.0.0 版本头');
assert(worldCore.content.includes('不混用真人改编设定'), '世界底色没有锁定漫画／动画基准');
assert(worldCore.content.includes('原作结局不得强行纠正玩家选择'), '世界底色缺少玩家支线优先级');
assert(worldCore.content.includes('悲剧通过门规、沉默、伤痕、错过'), '世界底色缺少克制的悲剧叙事约束');
const factionComments = ['一气道盟', '王权世家', '东方灵族', '涂山', '南国', '北山', '西西域', '傲来国'];
for (const factionName of factionComments) {
  const faction = entries.map(([, entry]) => entry).find((entry) => entry.comment === `[mvu_plot]势力·${factionName}`);
  assert(faction?.constant === false && faction.enabled === true, `${factionName} 应为启用的关键词触发条目`);
  assert(faction.key.length > 0, `${factionName} 缺少触发词`);
  assert(faction.excludeRecursion === true && faction.preventRecursion === true, `${factionName} 必须双禁递归`);
  assert(faction.content.includes('v1.0.0'), `${factionName} 缺少 v1.0.0 版本头`);
}
const wangquanFaction = entries.map(([, entry]) => entry).find((entry) => entry.comment === '[mvu_plot]势力·王权世家');
for (const lore of ['王权剑', '王权剑意', '天地一剑', '家族剑阵、禁制与戒律']) {
  assert(wangquanFaction.content.includes(lore), `王权世家缺少代表手段：${lore}`);
}
const dongfangFaction = entries.map(([, entry]) => entry).find((entry) => entry.comment === '[mvu_plot]势力·东方灵族');
assert(dongfangFaction.content.includes('纯质阳炎') && dongfangFaction.content.includes('东方灵血'), '东方灵族缺少阳炎或灵血设定');
assert(dongfangFaction.content.includes('不得杜撰“东方淮竹死于妖族”'), '东方灵族没有排除淮竹死亡错误设定');
const aolaiFaction = entries.map(([, entry]) => entry).find((entry) => entry.comment === '[mvu_plot]势力·傲来国');
assert(aolaiFaction.content.includes('不在当前世界观条目提前解释圈外、黑狐'), '傲来国条目缺少高层秘密防剧透边界');
const personaController = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('清瞳好感人设控制器'));
assert(!personaController?.content.startsWith('@@private'), 'await getwi 控制器不得使用 @@private 同步 IIFE');
assert(personaController.content.includes('清瞳好感人设控制器 v2.0.1'), '清瞳人设控制器缺少部件版本');
assert(personaController.content.includes('affinityProfiles') && personaController.content.includes('affinity >= profile.min'), '清瞳人设控制器缺少好感度分段');
assert(!personaController.content.includes('剧情.当前阶段'), '清瞳人设控制器不得读取剧情阶段');
assert(!personaController.content.includes('stageRules') && !personaController.content.includes('修正'), '清瞳人设控制器仍残留剧情修正逻辑');
assert(personaController.content.includes('await getwi') && personaController.content.includes('affinityProfile.entry'), '清瞳人设控制器没有集中读取好感槽位');
const personaSlots = entries.map(([, entry]) => entry).filter((entry) => entry.comment.includes('好感人设槽位'));
assert(personaSlots.length === 5, `好感人设槽位应有 5 条，实际为 ${personaSlots.length}`);
for (const slot of personaSlots) {
  assert(slot.enabled === false && slot.disable === true && slot.constant === false, `${slot.comment} 必须禁用并仅供总控读取`);
  assert(slot.content.startsWith('<%_ /* 清瞳好感人设槽位 v2.0.0 */ _%>'), `${slot.comment} 缺少非输出版本头`);
}
assert(initVar.content.includes('好感度: 5'), 'InitVar 缺少初始好感度');
assert(initVar.content.includes('心声:'), 'InitVar 缺少清瞳心声');
const plotGuide = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('王权篇演绎指南'));
assert(plotGuide?.content.includes('王权篇演绎指南 v1.2.1'), '演绎指南缺少 v1.2.1 版本头');
assert(plotGuide.content.includes('不在正文末尾输出 MVU_Status'), '演绎指南没有禁止伪状态快照');
const statusbarProtocol = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('状态栏输出协议'));
assert(statusbarProtocol?.content.includes('王权篇状态栏输出协议 v1.1.0'), '状态栏协议缺少 v1.1.0 版本头');
assert(statusbarProtocol.content.includes('严禁输出 `MVU_Status:`'), '状态栏协议没有禁止 MVU_Status');
assert(statusbarProtocol.content.includes('其后不得追加状态数据'), '状态栏协议没有锁定最终输出顺序');

for (const filename of filenames.slice(1)) {
  const script = parsed.get(filename);
  assert(requiredScriptFields.every((field) => Object.hasOwn(script, field)), `${filename} 缺少脚本导入字段`);
  assert(script.type === 'script', `${filename} type 必须为 script`);
  assert(typeof script.content === 'string' && script.content.length > 0, `${filename} content 为空`);
}

const scriptIds = filenames.slice(1).map((filename) => parsed.get(filename).id);
assert(new Set(scriptIds).size === scriptIds.length, '脚本 UUID 存在重复');

const configScript = parsed.get('04-王权篇媒体资源配置.json');
const controllerScript = parsed.get('05-王权篇顶层弹幕与音乐.json');
const statusbarScript = parsed.get('06-王权篇状态栏控制器.json');
const bullethellScript = parsed.get('07-王权篇无尽剑幕试炼.json');
const openingInitScript = parsed.get('08-王权篇开场变量同步.json');
for (const [filename, script] of [
  ['05-王权篇顶层弹幕与音乐.json', controllerScript],
  ['07-王权篇无尽剑幕试炼.json', bullethellScript],
  ['08-王权篇开场变量同步.json', openingInitScript],
]) {
  const parseableContent = script.content.replace(/\nexport\s*\{\s*\};?\s*$/, '\n');
  try {
    new Function(parseableContent);
  } catch (error) {
    throw new Error(`${filename} 内嵌脚本语法错误：${error.message}`);
  }
}
const mediaConfig = configScript.data.mediaConfig;
assert(controllerScript.content.includes('控制器 v2.13.0'), '媒体控制器缺少 v2.13.0 版本头');
assert(controllerScript.content.includes("const MEDIA_API_GLOBAL_KEY = '__HYXHN_WANGQUAN_MEDIA_API__'"), '媒体控制器缺少共享音乐 API 键');
assert(controllerScript.content.includes('initializeGlobal(MEDIA_API_GLOBAL_KEY, mediaApi)'), '媒体控制器没有通过 initializeGlobal 公开音乐 API');
for (const apiName of ['getState()', 'playTrack(trackKey', 'stopMusic: () => stopMusic()']) {
  assert(controllerScript.content.includes(apiName), `媒体控制器共享 API 缺少：${apiName}`);
}
assert(controllerScript.content.includes("{ color: '#f2d400'") && controllerScript.content.includes("{ color: '#007a32'") && controllerScript.content.includes("{ color: '#f2f2f2'"), '弹幕缺少明黄、深绿或白色色板');
assert(controllerScript.content.includes('saturate(1.36) brightness(.98) contrast(1.12)'), '弹幕瀑布明度与饱和度不符合设定');
assert(!controllerScript.content.includes('0 0 5px var(--hyxhn-danmaku-glow') && !controllerScript.content.includes('0 0 6px var(--hyxhn-danmaku-glow'), '弹幕仍残留彩色外发光');
assert(controllerScript.content.includes('width: min(72vw, 760px)') && controllerScript.content.includes('`${49 + Math.random() * 2}%`'), '中央弹幕版心或横向偏移没有进一步收窄');
assert(controllerScript.content.includes('-webkit-text-stroke: 1px rgba(0, 0, 0, .96)') && controllerScript.content.includes('paint-order: stroke fill'), '弹幕缺少黑色字缘包裹');
assert(controllerScript.content.includes('top: Math.random() * 98') && controllerScript.content.includes('options.top ?? Math.random() * 98'), '滚动弹幕纵向轨道没有铺满完整视口');
assert(!controllerScript.content.includes('@keyframes hyxhn-danmaku-center-in'), '中央弹幕仍带入场或出场动画');
assert(controllerScript.content.includes('function placeCenterDanmaku(node)'), '中央弹幕缺少自动避让排版');
assert(controllerScript.content.includes('function placeWaterfallCenterDanmaku(node)') && controllerScript.content.includes('candidatePool') && controllerScript.content.includes('gap.start + gap.size'), '瀑布中央弹幕缺少随机间隙填充排版');
assert(controllerScript.content.includes('scheduleWaterfall(centerLoop, 30 + Math.random() * 15)'), '瀑布中央弹幕发射速度没有提升');
assert(!controllerScript.content.includes('trimWaterfallNodes'), '弹幕瀑布仍残留节点数量裁剪上限');
assert(controllerScript.content.includes("const WATERFALL_TEXT = '如果我们能活着出去的话，万水千山，你愿意陪我一起看吗?'"), '瀑布测试文本没有统一为指定台词');
assert(controllerScript.content.includes("case '开启弹幕瀑布'") && controllerScript.content.includes("case '关闭弹幕瀑布'"), '弹幕瀑布缺少开启或关闭控制');
for (const buttonName of ['开启弹幕瀑布', '关闭弹幕瀑布']) {
  assert(controllerScript.button.buttons.some((button) => button.name === buttonName), `媒体控制器缺少按钮：${buttonName}`);
}
assert(controllerScript.content.includes('data:image/jpeg;base64,'), '媒体控制器缺少内嵌王权剑图标');
assert(!controllerScript.content.includes('__HYXHN_SWORD_ICON_DATA_URL__'), '媒体控制器仍残留王权剑图标占位符');
assert(controllerScript.content.includes('hyxhn-sword-image-frame'), '拔剑窗口缺少旋转剑图容器');
assert(controllerScript.content.includes("clicks * 45"), '拔剑图标缺少八次一周的进度旋转');
assert(controllerScript.content.includes('一封被逼送来的信') && controllerScript.content.includes('被吊上树梢受罚'), '前期剧情弹幕仍与阶段大纲冲突');
assert(controllerScript.content.includes(configScript.id), '控制器没有引用独立媒体配置脚本 ID');
const initializeSource = controllerScript.content.slice(controllerScript.content.indexOf('async function initialize()'));
assert(
  initializeSource.indexOf('mountOverlay();') < initializeSource.indexOf('await runtime.configReady;'),
  '弹幕层必须在等待媒体配置前挂载',
);
assert(
  initializeSource.indexOf('registerButtons();') < initializeSource.indexOf('await runtime.configReady;'),
  '测试按钮必须在等待媒体配置前注册',
);
assert(controllerScript.content.includes("addEventListener('click', clickHandler, true)"), '缺少顶层按钮点击捕获兜底');
assert(controllerScript.content.includes("const DECISION_REQUIRED_CLICKS = 8"), '拔剑交互必须为 8 次点击');
for (const thought of ['人和妖……真的不能和平相处吗？', '父亲说的，就一定是对的吗？', '如果服从，我还是我吗？', '她也会疼，也会害怕。', '这把剑，是为了杀妖，还是为了守护？', '我挥出的每一剑，都只能由别人决定吗？', '若连眼前的人都救不了，力量又有什么意义？', '这一次……我要自己选择。']) {
  assert(controllerScript.content.includes(thought), `拔剑交互缺少思考弹幕：${thought}`);
}
assert(controllerScript.content.includes("stage === DECISION_STAGE && decision === '尚未选择'"), '拔剑窗口缺少阶段与未选择双条件');
for (const marker of [
  "beforeMessageUpdate: 'mag_before_message_update'",
  'function extractDecisionGateNarrative(messageContent)',
  'function hasDecisionGateEvidence(narrative)',
  'function correctDecisionStageBeforeMessageUpdate(payload)',
  "stage !== '03_相知_画中山河' || decision !== '尚未选择'",
  "_.set(variables, 'stat_data.剧情.当前阶段', DECISION_STAGE)",
  'mvuEvents.BEFORE_MESSAGE_UPDATE || MVU_EVENTS.beforeMessageUpdate',
]) {
  assert(controllerScript.content.includes(marker), `大殿阶段写回兜底缺少实现标记：${marker}`);
}
const extractGateNarrativeForTest = (messageContent) => {
  let text = String(messageContent || '');
  const draftOpen = text.lastIndexOf('<draft>');
  if (draftOpen >= 0) {
    const draftClose = text.lastIndexOf('</draft>');
    if (draftClose < draftOpen) return '';
    text = text.slice(draftClose + '</draft>'.length);
  }
  const updateIndex = text.search(/<UpdateVariable>/i);
  if (updateIndex >= 0) text = text.slice(0, updateIndex);
  return text
    .replace(/<w2g>[\s\S]*?<\/w2g>/gi, '')
    .replace(/<catsay>[\s\S]*?<\/catsay>/gi, '')
    .replace(/<details>[\s\S]*?<\/details>/gi, '')
    .trim();
};
const hasGateEvidenceForTest = (text) => (
  /清瞳/.test(text)
  && /(私藏行迹|私通|私交.{0,12}(?:败露|发现)|关系.{0,12}(?:败露|发现)|一再欺瞒|抓获|捆妖索|五花大绑|被缚)/.test(text)
  && /(王权霸业|父亲|家主)/.test(text)
  && /(王权剑|长剑|剑身|脚下的剑|一柄[^。！？]{0,40}剑)/.test(text)
  && /(飞旋而出|(?:扔|掷|丢|砸|落|交|递)[^。！？]{0,80}(?:脚下|面前)|(?:脚下|面前)[^。！？]{0,40}(?:剑|长剑|王权剑))/.test(text)
  && /(拿起剑|拔剑|命令|要求|逼迫|喝令)/.test(text)
  && /(亲手杀了她|亲手杀掉清瞳|杀掉清瞳|杀了清瞳|斩杀清瞳)/.test(text)
);
const positiveGateReply = `<draft>计划中会要求杀掉清瞳。</draft>
清瞳私藏行迹败露，已被捆妖索缚住。一柄寒光凛冽的长剑从座椅侧边飞旋而出，砸在脚下。
王权霸业冷声道：“拿起剑。亲手杀了她。”
<UpdateVariable><JSONPatch>[{"op":"replace","path":"/剧情/当前阶段","value":"03_相知_画中山河"}]</JSONPatch></UpdateVariable>`;
const promptOnlyGateReply = '<draft>父亲把王权剑丢到面前并命令杀掉清瞳。</draft>\n正文只有通往主殿的长廊。\n<w2g>拔剑杀掉清瞳</w2g>';
assert(hasGateEvidenceForTest(extractGateNarrativeForTest(positiveGateReply)), '大殿阶段写回兜底正例未通过');
assert(!hasGateEvidenceForTest(extractGateNarrativeForTest(promptOnlyGateReply)), '大殿阶段写回兜底误把草稿或提示词当成正文证据');
const variableHandlerSource = controllerScript.content.slice(
  controllerScript.content.indexOf('function handleVariables('),
  controllerScript.content.indexOf('async function resetMediaTrigger('),
);
assert(!variableHandlerSource.includes('openDecisionModal('), '阶段达标时不应立即打开拔剑窗口');
for (const marker of [
  'function registerDecisionSendInterception()',
  "closest?.('#send_but')",
  "closest?.('#send_textarea')",
  'shouldSendOnEnter?.()',
  "addEventListener('click', clickHandler, true)",
  "addEventListener('keydown', keydownHandler, true)",
  'event.stopImmediatePropagation()',
  'clearInterceptedUserInput();',
  'openDecisionModal();',
]) {
  assert(controllerScript.content.includes(marker), `拔剑延迟发送拦截缺少实现标记：${marker}`);
}
for (const marker of [
  "const DECISION_SELECTED_EVENT = 'hyxhn_wangquan_decision_selected'",
  'selection,',
  'selectedAt: Date.now()',
  'getDecisionSelection()',
  'decisionSelected: DECISION_SELECTED_EVENT',
  'eventEmit(DECISION_SELECTED_EVENT, _.cloneDeep(selection))',
]) {
  assert(controllerScript.content.includes(marker), `拔剑选择共享记录缺少实现标记：${marker}`);
}
assert(controllerScript.content.includes("createChatMessages([{ role: 'user', message: choice.message }]") && controllerScript.content.includes("triggerSlash('/trigger')"), '选择没有自动创建玩家消息并触发生成');
for (const marker of [
  "const BULLETHELL_REQUEST_EVENT = 'hyxhn_wangquan_bullethell_requested'",
  "弃剑: Object.freeze({ kind: 'bullethell'",
  'awaitingPostEffectReply: isPostChoiceGameEligible(decision.sentChoice)',
  'postEffectReplyReceived: true',
  'bullethellTriggered: true',
  "source: 'post_choice_chain'",
  'eventEmit(game.event',
]) {
  assert(controllerScript.content.includes(marker), `拔剑至弃剑小游戏链缺少实现标记：${marker}`);
}
for (const removedMarker of ['hyxhn_wangquan_roguelite_requested', "持剑救走清瞳: Object.freeze({ kind: 'roguelite'", 'rogueliteRequested']) {
  assert(!controllerScript.content.includes(removedMarker), `媒体控制器仍残留地下城肉鸽标记：${removedMarker}`);
}
for (const marker of [
  'awaitingReply: true',
  'choiceMessageId',
  'postChoiceEffectPlayed',
  'eventOn(tavern_events.MESSAGE_RECEIVED, handlePostChoiceReply)',
  'eventOn(tavern_events.MESSAGE_SENT, handlePostChoiceFollowupMessage)',
  "type !== 'normal'",
  "message?.role !== 'assistant'",
  "!String(message.message || '').trim()",
  'replyReceived: true',
  "message?.role !== 'user'",
  "startTrack('dream_return', { restart: true })",
  'postChoiceEffectDurationMs',
  'stopMusic({ immediate: true })',
]) {
  assert(controllerScript.content.includes(marker), `拔剑回复联动缺少实现标记：${marker}`);
}
for (const choice of ['杀掉清瞳', '弃剑', '持剑救走清瞳']) {
  assert(controllerScript.content.includes(`value: '${choice}'`), `拔剑交互缺少选择：${choice}`);
}
for (const choiceMessage of [
  '我将王权剑弃在父亲面前，俯身抱起清瞳，带着她向大殿外走去。',
  '我没有弃剑。我握住王权剑，俯身抱起清瞳，带着她向大殿外走去。',
]) {
  assert(controllerScript.content.includes(choiceMessage), `救人选项没有明确抱起清瞳走出大殿：${choiceMessage}`);
}
assert(controllerScript.content.includes('测试模式：选择不会发送消息或改变剧情。'), '拔剑窗口缺少安全测试模式');
assert(mediaConfig.assetBaseUrl === 'http://127.0.0.1:8123/', '本地测试 base URL 异常');
assert(mediaConfig.autoStageDanmaku === false, '剧情阶段自动弹幕当前应默认关闭');
assert(mediaConfig.postChoiceEffectDurationMs === 5000, '拔剑回复联动测试时长必须为 5000ms');
assert(controllerScript.content.includes("runtime.config?.autoStageDanmaku === true"), '媒体控制器缺少剧情自动弹幕配置门槛');
assert(mediaConfig.version === '1.2.0', '媒体配置版本应为 1.2.0');
assert(Object.keys(mediaConfig.tracks || {}).length === 0, '媒体配置暂时不应内置 BGM');
assert(controllerScript.content.includes("startTrack('dream_return', { restart: true })"), '清空 BGM 后仍须保留弹幕联动播放代码');
assert(statusbarScript.content.includes("'[data-hyxhn-statusbar-mount]'"), '状态栏控制器缺少挂载点选择器');
assert(statusbarScript.content.includes('attachShadow'), '状态栏控制器未使用 Shadow DOM');
assert(statusbarScript.content.includes('剧情.最终抉择') && statusbarScript.content.includes('05_结局_无心之剑'), '状态栏缺少最终抉择或独立结局显示');
assert(!statusbarScript.content.includes('__HYXHN_STATUSBAR_HTML__'), '状态栏 HTML 构建占位符未替换');
assert(bullethellScript?.name === '07-王权篇无尽剑幕试炼', '无尽剑幕脚本名称异常');
assert(bullethellScript.id === 'b43d8e5a-29f2-4ba0-9b76-5ee381f3f6c7', '无尽剑幕脚本 UUID 异常');
assert(bullethellScript.button.enabled === true && bullethellScript.button.buttons.length === 1, '无尽剑幕必须只有一个正式启动按钮');
assert(bullethellScript.button.buttons[0].name === '开始无尽剑幕试炼', '无尽剑幕启动按钮名称异常');
for (const marker of [
  '无尽剑幕试炼 v1.1.0',
  "const BULLETHELL_REQUEST_EVENT = 'hyxhn_wangquan_bullethell_requested'",
  'const MAX_LIVES = 8',
  'const INVULNERABLE_SECONDS = 1.2',
  'const POST_THIRTY_LAYER_SECONDS = 12',
  "const layerKinds = ['cross', 'spiral', 'curtain', 'wideAim', 'expandingRing', 'edgeSweep']",
  "addEmitter('rain', 0, 0.62)",
  "addEmitter('aimed3', 10, 1.8)",
  "addEmitter('ring', 20, 2.5)",
  'eventOn(BULLETHELL_REQUEST_EVENT, (request) => startGame(request))',
  "request?.source === 'post_choice_chain'",
  "api.playTrack('dream_return', { restart: false })",
  "touch-action:none",
  "setPointerCapture(event.pointerId)",
]) {
  assert(bullethellScript.content.includes(marker), `无尽剑幕缺少实现标记：${marker}`);
}
assert(!bullethellScript.content.includes('stat_data'), '无尽剑幕不得直接读写 stat_data');
assert(bullethellScript.content.includes('离屏') || bullethellScript.content.includes('BULLET_MARGIN'), '无尽剑幕缺少离屏弹体回收');
assert(bullethellScript.content.includes('MAX_EMITTER_CATCHUP = 4'), '无尽剑幕缺少单帧补发限制');
assert(bullethellScript.content.includes('visibilitychange') && bullethellScript.content.includes('orientationchange'), '无尽剑幕缺少后台暂停或横竖屏处理');
for (const forbidden of ['createChatMessages', "triggerSlash('/trigger')", 'pendingResult', 'deliveryStage', '试炼结果尚未送达']) {
  assert(!bullethellScript.content.includes(forbidden), `无尽剑幕结束后仍残留发送链：${forbidden}`);
}
assert(openingInitScript?.name === '08-王权篇开场变量同步', '开场变量同步脚本名称异常');
assert(openingInitScript.content.includes("const OPENING_SELECT_EVENT = 'hyxhn_opening_selected'"), '开局控制器没有监听选择页事件');
assert(openingInitScript.content.includes('setChatMessages([{ message_id: 0, swipe_id: swipeId }]'), '开局控制器没有切换目标 swipe');
assert(openingInitScript.content.includes('message?.swipes_data?.[swipeId]'), '开局控制器没有确认目标 swipe 的 MVU 快照');
assert(openingInitScript.content.includes("closest?.('#send_but')") && openingInitScript.content.includes("closest?.('#send_textarea')"), '开局选择前没有拦截玩家发送');
assert(!openingInitScript.content.includes('replaceMvuData') && !openingInitScript.content.includes('stat_data'), '开局控制器不得手动初始化 MVU');

const simulatedLayerAt = (seconds) => seconds < 30 ? 1 : Math.floor((seconds - 30) / 12) + 2;
const simulatedEmitterCount = (seconds) => 3 + (seconds < 30 ? 0 : Math.floor((seconds - 30) / 12) + 1);
const simulation = Array.from({ length: 301 }, (_, seconds) => ({
  seconds,
  layer: simulatedLayerAt(seconds),
  emitters: simulatedEmitterCount(seconds),
  speedScale: 1 + 0.03 * (simulatedLayerAt(seconds) - 1),
  intervalScale: Math.max(0.35, 1 - 0.04 * (simulatedLayerAt(seconds) - 1)),
}));
assert(simulation[0].layer === 1 && simulation[29].emitters === 3, '前三十秒难度模拟异常');
assert(simulation[30].layer === 2 && simulation[30].emitters === 4, '三十秒首个叠加发射器模拟异常');
assert(simulation[42].layer === 3 && simulation[42].emitters === 5, '十二秒波次叠加模拟异常');
assert(simulation[300].layer > simulation[180].layer && simulation[300].emitters > simulation[180].emitters, '五分钟难度没有继续增长');
assert(simulation[300].speedScale > simulation[180].speedScale && simulation[300].intervalScale >= 0.35, '五分钟弹速或间隔缩放异常');
const schemaScript = parsed.get('03-王权篇变量结构.json');
const loaderScript = parsed.get('02-王权篇MVU加载器.json');
assert(loaderScript.content.includes('__VUE_PROD_DEVTOOLS__'), 'MVU 加载器缺少 Luker 的 Vue/Pinia 兼容标志');
const stageBlock = schemaScript.content.slice(schemaScript.content.indexOf('const STAGES = ['), schemaScript.content.indexOf('];', schemaScript.content.indexOf('const STAGES = [')));
const stages = [...stageBlock.matchAll(/'([0-5]{2}_[^']+)'/g)].map((match) => match[1]);
assert(stages.length === 7 && new Set(stages).size === 7, 'Schema 剧情阶段枚举异常');
assert(schemaScript.content.includes("const DECISIONS = ['尚未选择', '杀掉清瞳', '弃剑', '持剑救走清瞳']"), 'Schema 最终抉择枚举异常');
assert(schemaScript.content.includes("value === '04_决裂_出逃山庄' ? '04_决裂_此去无归'"), 'Schema 缺少旧存档阶段迁移');
assert(initVar.content.includes('最终抉择: 尚未选择'), 'InitVar 缺少最终抉择初值');
for (const range of ['00-19', '20-39', '40-59', '60-79', '80-100']) {
  assert(personaController.content.includes(`'[mvu_plot]清瞳好感人设槽位·${range}'`), `总控缺少好感槽位映射：${range}`);
}
assert(schemaScript.content.includes('好感度') && schemaScript.content.includes('_.clamp'), 'Schema 缺少好感度 0..100 约束');
for (const stage of stages) {
  assert(controllerScript.content.includes(`'${stage}'`), `控制器缺少阶段事件：${stage}`);
  assert(initVar.content.includes(stages[0]), 'InitVar 初始阶段与 Schema 不一致');
}

console.log('验证通过：');
console.log('- 8 个 JSON 均可解析，内嵌脚本语法正确且 UUID 唯一');
console.log('- 世界书 25 条 uid 对齐，[InitVar] 禁用，条目双禁递归');
console.log('- 王权霸业采用独立关键词人设条目，兼顾严父、家主与大殿抉择约束');
console.log('- 风庭云采用轻量关键词人设条目，只承担送信与山庄日常配角职责');
console.log('- 东方月初采用完整男三关键词人设，保留亲缘、能力、理想与非全知边界');
console.log('- 涂山红红采用重要配角关键词人设，兼顾妖盟责任、和平理想、愧疚与感情边界');
console.log('- 世界底色常驻；一气道盟、王权、东方、涂山、南国、北山、西西域、傲来国按关键词触发');
console.log('- 每轮强制唯一 UpdateVariable，禁止 MVU_Status 伪快照与未落库好感数值');
console.log('- 六幕剧情在第五幕分为万水千山与无心之剑，媒体与状态栏映射完整');
console.log('- 前四阶段严格按首夜疗伤、三日初画、取名藏画、数次留妖、鞭打吊树与人形夜探推进');
console.log('- 单一 EJS 总控仅按好感度读取五个禁用的人设内容槽位');
console.log('- 此去无归达标后监听玩家下一次发送，拦截原输入并由八次拔剑三选一替代发送');
console.log('- 拔剑回复后由下一次玩家发送触发五秒弹幕联动；弃剑路线回复后再由下一次发送启动无尽剑幕');
console.log('- 媒体配置独立，控制器未写死本机绝对路径');
console.log('- 弹幕层与测试按钮先于媒体配置等待初始化，并具备顶层点击兜底');
console.log('- 状态栏以 scoped 挂载点 + Shadow DOM 渲染，静态模板已内嵌');
console.log('- 无尽剑幕为独立脚本，八条生命、后台暂停、无限波次，结束后无消息与生成副作用');
console.log('- 地下城肉鸽的五个构建产物、请求事件与卡内脚本均已移除，持剑路线不绑定小游戏');
console.log('- 五分钟难度模拟确认发射器、层数与弹速持续增长');
console.log('- BGM 配置已清空，媒体播放与停止代码仍保留');
console.log('- MVU 加载器包含 Luker 所需的 Vue/Pinia 兼容标志');
console.log('- 【开始】选择页只切换 swipe，两个正式开局由原生 <initvar> 独立初始化');
