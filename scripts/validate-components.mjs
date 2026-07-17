// 狐妖小红娘·王权篇部件验证器 v1.50.0
// v1.50.0: 验证常驻大纲字符预算、17 阶段导航与 00 至 02 动态关键细节。
// v1.49.0: 验证六段式携瞳私奔旅程、证据追索与六条路线绿灯世界书。
// v1.48.0: 验证持剑最强、弟子剑阵、长老败退与三种掌权结果。
// v1.47.0: 验证五幕关系修复、悲喜基调、渐进门槛与三种玩家出口。
// v1.46.0: 验证持剑固定突围链、无毒娘子自由行动与无心之剑配角余波。
// v1.45.0: 验证涂山落脚链与雅雅、容容、翠玉灵三条当前时间线绿灯 NPC。
// v1.44.0: 验证执剑夺权、关系暴露回流与携瞳远走两条自由主线。
// v1.43.0: 验证圈外污染链、红线机制、王权剑结算与配角后续口径。
// v1.42.0: 验证清瞳真实动机、软糯分歧、条件令牌、败露捕获与非固定对白门槛。
// v1.41.0: 验证十五阶段、偏离承接、修复/独立分流与两个新增动态条目。
// v1.40.0: 验证参考剧情轨道、关系门槛与玩家选择优先级。
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
assert(entries.length === 39, `世界书应有 39 条，实际为 ${entries.length}`);
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
assert(updateRules.content.includes('王权篇变量更新规则 v2.9.0'), '变量更新规则版本异常');
assert(stageOutline?.content.includes('王权篇阶段剧情 v4.0.0'), '阶段骨架版本异常');
assert(stageOutline.content.includes('默认剧情轨道') && stageOutline.content.includes('玩家已发送的行动'), '阶段骨架缺少参考轨道优先级');
assert(stageOutline.content.length >= 2200 && stageOutline.content.length <= 3200, `常驻阶段骨架字符预算异常：${stageOutline.content.length}`);
assert(detailController?.content.includes('剧情详案控制器 v1.3.0'), '阶段详案控制器缺失');
assert(detailController.content.includes('await getwi(') && !detailController.content.includes('const '), '阶段详案控制器不符合 EJS/getwi 约束');

const detailComments = [
  '阶段详案·黄风怒火',
  '阶段详案·红线家法',
  '阶段详案·开天与叛门',
  '阶段详案·一二五八零与龙湾',
  '阶段详案·王权山庄日常',
  '阶段详案·自由主线',
];
for (const comment of detailComments) {
  const entry = byComment(comment);
  assert(entry && entry.enabled === false && entry.constant === false, `${comment} 应为禁用的动态详案`);
  assert(detailController.content.includes(`[mvu_plot]${comment}`), `控制器未引用 ${comment}`);
}
const dailyDetail = byComment('阶段详案·王权山庄日常');
for (const point of ['00阶段·首夜送信与疗伤', '01阶段·次日问妖与数日绘景', '02阶段·取名与长期秘密日常', '墨水盘并倒入药水疗伤', '误判迎面蛛丝是攻击', '王权剑中感知历代持剑者']) {
  assert(dailyDetail.content.includes(point), `王权山庄动态详案缺少关键细节：${point}`);
}

const affinityController = byComment('清瞳好感人设控制器');
assert(affinityController?.content.includes('version="3.3.0"'), '清瞳关系控制器版本异常');
for (const range of ['00-19', '20-39', '40-59', '60-79', '80-100']) {
  const entry = byComment(`清瞳好感人设槽位·${range}`);
  assert(entry && entry.enabled === false && entry.constant === false, `清瞳关系条目 ${range} 应为禁用动态条目`);
  assert(entry.content.includes('关系边界:') && !entry.content.includes('空槽位'), `清瞳关系条目 ${range} 尚未填入门槛`);
}
assert(affinityController.content.includes('不单独创造恋人关系'), '清瞳关系控制器缺少关系事实约束');
const qingTongCorePersona = byComment('清瞳核心人设');
assert(qingTongCorePersona && qingTongCorePersona.enabled === false && qingTongCorePersona.constant === false, '清瞳核心人设应为禁用动态条目');
assert(qingTongCorePersona.content.includes('【待作者手动填写】'), '清瞳核心人设缺少待填标记');
assert(affinityController.content.includes('[mvu_plot]清瞳核心人设') && affinityController.content.includes('corePersonaReady'), '清瞳核心人设未接入控制器');

const requiredPlotPoints = [
  '闻伯霖战死黄风城外', '恶喙兽放大王权霸业怒火', '鹿妖在临死前从暴怒恢复清明',
  '尸山血海', '操控群妖的仇恨红线', '彼此认出却一言未发', '自困密室',
  '金灵鳞从凤牺处突然获得近似妖皇的力量', '斩断凤牺临走前留下的控制中枢',
  '身外不得出现笼子、牢笼、囚车、铁笼、刑架、封妖箱、结界容器',
  '第一个完整动作都是王权富贵主动挥出一剑、精准斩断捆妖索且不伤清瞳',
  '身上插满剑，怀中清瞳仍安然无恙', '东方月初赶到，以纯质阳炎炼去整座剑阵',
  '王权霸业在这一剑后愿意放王权富贵离开', '代号 12580',
  '清瞳不怕死，只求以我之命，以证我心', '用不着，我信你',
  '只要我王权在手，无人可伤我们分毫', '破除她桂冠上毒夫子留下的封禁', '龙湾',
  '无法凝聚王权剑', '东方月初立即从山头介入', '独立侠客身份行走天下', '返回王权山庄，受家法后继续作为家族兵器',
  '模糊卧底任务', '初见被放过、解除符咒并疗伤之时', '织画没有任务成分',
  '自由进出部分禁制的令牌', '最先察觉异常的是风庭云', '风庭云同时在主殿内',
  '让圈外力量向圈内渗入', '受到圈外力量污染', '红线同时干涉受控者的情绪与行动',
  '金灵鳞从凤牺处', '王权剑本身压倒性的强度', '完成求援后返回自己的地界',
  '阻止这件事演变成新一轮报复', '清瞳就是 12580', '确认自己打不过此刻的王权富贵',
  '王权剑既是最强兵刃，也是王权家继承与正统的象征', '关系未暴露时，不得让王权霸业、长老或道盟凭空知道清瞳',
  '玩家明确拒绝并持剑救走清瞳后，进入持剑突围', '本线是两人共同流浪，与拒绝清瞳后的独行侠客线严格区分',
  '带剑会显著提高王权家与道盟的追索强度', '离庄不会自动洗掉这件事',
  '涂山是可选目的地，不是私奔后的强制终点', '临时庇护', '合作换取立足', '外交对峙',
  '涂山红红负责判断是否给予庇护', '涂山容容负责核对情报', '涂山雅雅更可能直接质疑', '翠玉灵只在确有伤情',
  '击败王权家长老', '王权霸业依旧不会亲自出手', '东方月初接手撤离',
  '持剑线不会遭遇毒娘子', '保持 08 并自由行动',
  '王权富贵既是加害者，也是王权家长期塑造出的兵器', '维护清瞳遗体与遗物的尊严',
  '更加安静、更加精确的训练与服从误读为剑心重新稳定',
  '余火未熄', '不完整的真话', '救人仍被驱逐', '半块糖饼', '把去留交还玩家',
  '只明确救下两条命不等于修好一段关系', '一个被救的孩子可以偷偷送来半块糖饼',
  '不偷偷消失、不故意留下遗书', '重新或暂时选择彼此',
  '手持王权剑的王权富贵就是王权家最强者', '长老随后亲自出手，仍被王权富贵逐一击败',
  '完全接任家主、保留王权霸业名位形成父子共治', '武力层面的夺权已经成功',
  '第一幕·离开笼中', '第二幕·山路追索', '第三幕·山外同路', '第四幕·旧网追来', '第五幕·涂山门前', '第六幕·借地立足',
  '山道塌方同时困住人族商旅与弱小妖怪', '王权追猎队先追查继承人与王权剑的去向',
  '毒娘子知道自己交过模糊潜入任务', '涂山边境巡守先拦下两人', '完成任务不等于自动成为涂山成员',
];
const allPlotText = entries.map(([, entry]) => entry.content).join('\n');
for (const point of requiredPlotPoints) assert(allPlotText.includes(point), `缺少剧情硬点：${point}`);
assert(allPlotText.includes('不得把毒娘子单方面揭露直接扩写成“所有感情均为骗局”'), '缺少 12580 对冲约束');
assert(allPlotText.includes('本线不复制弃剑路线的跪地插满飞剑'), '持剑分支未与弃剑固定链隔离');
assert(detailController.content.includes("'08_结局_无心之剑': '[mvu_plot]阶段详案·开天与叛门'"), '无心之剑未接入动态详案');
assert(byComment('阶段详案·开天与叛门').content.includes('适用阶段: 05_黄风_一剑开天、06_败露_主殿杀令、07_决裂_此去无归、08_结局_无心之剑'), '开天与叛门详案未声明适用于无心之剑');
assert(updateRules.content.includes('夸赞她的画') && updateRules.content.includes('温柔摸头') && updateRules.content.includes('威胁胁迫'), '好感度心意判定样例缺失');
assert(updateRules.content.includes('不要求四句固定对白说完') && !updateRules.content.includes('依次说完四句固定对白'), '首次织画仍被固定对白阻塞');
assert(allPlotText.includes('玩家没有给予时，后续调查绝不能补出这枚令牌'), '禁制令牌缺少玩家选择保护');
assert(allPlotText.includes('不得简化成嫉妒告密'), '风庭云败露动机缺少反恶毒化约束');
assert(updateRules.content.includes('06_分岔_执剑夺权 -> 07_决裂_此去无归'), '夺权关系暴露回流规则缺失');
assert(updateRules.content.includes('王权剑原本就在玩家手中，不要求重新赐剑') && updateRules.content.includes('不要求风庭云必须在场'), '夺权回流仍错误套用默认主殿门槛');
assert(updateRules.content.includes('此路线是两人同行') && updateRules.content.includes('不得因进入本阶段把 /剧情/最终抉择 写成弃剑或持剑救走清瞳'), '携瞳远走与主殿抉择未隔离');
assert(updateRules.content.includes('玩家只提出“去涂山”时保持当前地点') && updateRules.content.includes('涂山临时庇护必须以涂山方面已经明确同意'), '涂山落脚变量证据门槛缺失');
assert(updateRules.content.includes('一次解释、一次亲昵、一次合作或好感数值均不能单独视为修复完成'), '关系修复缺少渐进完成门槛');
assert(updateRules.content.includes('认可清瞳的改变却仍未明确恢复信任时保持本阶段'), '关系修复缺少继续修复出口');
assert(updateRules.content.includes('击破弟子剑阵、击败阻拦长老并让王权霸业停止武力抵抗'), '夺权成功证据链缺失');
assert(updateRules.content.includes('不得继续记录为夺权失败或被普通弟子、长老压制'), '持剑最强约束缺失');

const tushanNpcExpectations = [
  { fragment: '重要配角人设·涂山红红', version: '涂山红红重要配角人设 v1.5.0', keys: ['涂山红红', '红红'] },
  { fragment: '涂山NPC·涂山雅雅', version: '涂山雅雅当前时间线人设 v1.0.0', keys: ['涂山雅雅', '雅雅'] },
  { fragment: '涂山NPC·涂山容容', version: '涂山容容当前时间线人设 v1.0.0', keys: ['涂山容容', '容容'] },
  { fragment: '涂山NPC·翠玉灵', version: '翠玉灵当前时间线人设 v1.0.0', keys: ['翠玉灵', '蛭妖之王'] },
  { fragment: '私奔线NPC·毒娘子', version: '毒娘子当前时间线人设 v1.0.0', keys: ['毒娘子', '五毒太保'] },
  { fragment: '私奔线群像·王权追猎队', version: '王权追猎队群像 v1.0.0', keys: ['王权追猎队', '王权追兵'] },
  { fragment: '私奔线群像·涂山边境巡守', version: '涂山边境巡守群像 v1.0.0', keys: ['涂山边境巡守', '涂山守卫'] },
];
for (const expectation of tushanNpcExpectations) {
  const entry = byComment(expectation.fragment);
  assert(entry && entry.enabled === true && entry.constant === false, `${expectation.fragment} 必须是启用的绿灯条目`);
  assert(entry.content.includes(expectation.version), `${expectation.fragment} 版本异常`);
  for (const key of expectation.keys) assert(entry.key.includes(key), `${expectation.fragment} 缺少关键词 ${key}`);
  for (const futureName of ['涂山苏苏', '白月初', '王富贵']) {
    assert(!entry.content.includes(futureName), `${expectation.fragment} 混入后世角色 ${futureName}`);
  }
}
const schema = parsed.get('03-王权篇变量结构.json');
const schemaContent = schema.content;
assert(schemaContent.includes("const ROUTE_STATES = ['贴合参考', '已偏离', '独立结局']"), '参考轨道状态枚举缺失');
assert(schemaContent.includes('承接约束: str'), '最短承接约束字段缺失');
const stageBlock = schemaContent.slice(schemaContent.indexOf('const STAGES = ['), schemaContent.indexOf('];', schemaContent.indexOf('const STAGES = [')));
const stages = [...stageBlock.matchAll(/'(\d{2}_[^']+)'/g)].map((match) => match[1]);
assert(stages.length === 17 && new Set(stages).size === 17, `Schema 阶段枚举应为 17，实际 ${stages.length}`);
for (const stage of stages) {
  assert(updateRules.content.includes(stage), `变量规则缺少阶段 ${stage}`);
  assert(stageOutline.content.includes(stage), `阶段骨架缺少阶段 ${stage}`);
}
for (const oldStage of ['03_相知_画中山河', '04_决裂_出逃山庄', '04_决裂_此去无归', '05_尾声_万水千山', '05_结局_无心之剑']) {
  assert(schemaContent.includes(`'${oldStage}'`), `Schema 缺少旧存档迁移 ${oldStage}`);
}

const media = parsed.get('05-王权篇顶层弹幕与音乐.json');
assert(media.content.includes('v2.21.0'), '媒体控制器版本异常');
assert(media.content.includes("const DECISION_STAGE = '07_决裂_此去无归'"), '拔剑窗口决裂阶段异常');
for (const stage of stages) assert(media.content.includes(`'${stage}'`), `媒体事件缺少阶段 ${stage}`);
assert(media.content.includes("music: 'dream_return'"), '《梦回还》阶段音乐配置缺失');
assert(media.content.includes('tavern_events.MESSAGE_RECEIVED') && media.content.includes('stopPostChoiceFollowupEffect'), '弹幕/BGM 未绑定正常回复完成事件');

const statusbar = parsed.get('06-王权篇状态栏控制器.json');
assert(statusbar.content.includes('v1.4.0'), '状态栏版本异常');
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
console.log('- 世界书 39 条，含 17 阶段、6 条动态剧情详案、7 条相关人物/群像绿灯条目与 1 条待填核心人设');
console.log('- 常驻大纲字符预算、17 阶段导航、动态详案迁移与全部关键剧情锚点均已验证');
