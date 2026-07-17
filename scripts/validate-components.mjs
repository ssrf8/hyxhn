// 狐妖小红娘·王权篇部件验证器 v1.72.0
// v1.72.0: 验证所有构建产物不再包含固定主角名，统一以 {{user}} 承接玩家身份。
// v1.71.0: 验证王权剑凝聚插图由主模型证据标记触发，小游戏不再写入结果图楼层。
// v1.70.0: 验证弃剑线万剑穿心独占一轮、东方月初下一轮登场及 07 阶段承接闸门。
// v1.69.0: 验证主模型与额外模型分别获得同门槛变量协议，并保证主模型断线兜底可独立落库。
// v1.68.0: 验证独立横版结果插图为受控体积 WebP，不再复用玩家角色小图。
// v1.67.0: 验证死亡收尾无暂停字幕，结果图只用短占位符写入对应助手楼层。
// v1.66.0: 验证剑刃主体保持等宽，只有前端肩点之后收束成尖头。
// v1.65.0: 验证剑身不使用加色混合、具备实体轮廓、渐变刃面与中央剑脊。
// v1.64.0: 验证飞弹使用速度向量绘制剑刃、护手、剑柄与尾迹，碰撞半径不变。
// v1.63.0: 验证透明 WebP 玩家角色图完整内嵌，并保持独立小判定点。
// v1.62.0: 验证弹幕海 BGM 不循环，并在原生 ended 事件发生时硬性停止视听效果。
// v1.61.0: 验证完整曲长压缩 BGM，以及正常、空返回、HTTP 错误、异常、中止和超时的收尾链。
// v1.60.0: 验证内嵌 BGM 使用裁去尾部三分之一的 128 kbps 压缩资产，并限制体积。
// v1.59.0: 验证《梦回还》完整编码进媒体配置脚本，且播放链不依赖外部地址。
// v1.58.0: 验证无尽剑幕不再调用背景音乐，同时弹幕瀑布保留《梦回还》。
// v1.57.0: 验证两条默认关闭的常驻形态覆写、双模型路由与纯蜘蛛优先级。
// v1.56.0: 验证清瞳完整核心人设、性格调色盘、压力三面、信息边界与二次解释。
// v1.55.0: 验证滚动弹幕恢复字号、固定每批 40 条及安全高密间隔。
// v1.54.0: 验证滚动弹幕瀑布超密模式参数。
// v1.53.0: 验证滚动弹幕瀑布的小字号、高批量与高频率参数。
// v1.52.0: 验证卡内候选选项防剧透协议、即时行动边界与未点击不生效纪律。
// v1.51.0: 验证额外解析必须输出 UpdateVariable/JSONPatch 双层容器并显式禁止裸数组。
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
const forbiddenFixedProtagonistName = ['王权', '富贵'].join('');
for (const filename of filenames) {
  const raw = await readFile(path.join(distDir, filename), 'utf8');
  assert(!raw.includes('file:///'), `${filename} 不应包含 file URL`);
  assert(!raw.includes(forbiddenFixedProtagonistName), `${filename} 仍包含固定主角名，应使用 {{user}}`);
  parsed.set(filename, JSON.parse(raw));
}

const worldbook = parsed.get(expectedFilenames[0]);
const entries = Object.entries(worldbook?.entries || {});
assert(entries.length === 42, `世界书应有 42 条，实际为 ${entries.length}`);
for (const [key, entry] of entries) {
  assert(key === String(entry.uid), `世界书键 ${key} 与 uid ${entry.uid} 不一致`);
  assert(entry.excludeRecursion && entry.preventRecursion, `${entry.comment} 未双禁递归`);
}
const byComment = (fragment) => entries.map(([, entry]) => entry).find((entry) => entry.comment.includes(fragment));
const initVar = byComment('[InitVar]');
assert(initVar?.enabled === false && initVar.disable === true, '[InitVar] 必须禁用');
const updateRules = byComment('[mvu_update]王权篇变量更新规则');
const mainUpdateRules = byComment('[mvu_plot]王权篇主模型变量更新规则');
const stageOutline = byComment('王权篇阶段剧情');
const detailController = byComment('王权篇阶段详案控制器');
const plotGuide = byComment('王权篇演绎指南');
assert(updateRules?.comment.startsWith('[mvu_update]'), '变量更新规则路由异常');
assert(updateRules.content.includes('王权篇变量更新规则 v2.13.0'), '变量更新规则版本异常');
assert(mainUpdateRules?.comment.startsWith('[mvu_plot]'), '主模型变量更新规则路由异常');
assert(mainUpdateRules.content.includes('王权篇主模型变量更新规则 v1.0.0'), '主模型变量更新规则版本异常');
for (const mainGuard of [
  '先正常完成本轮正文',
  '主模型补丁是额外 MVU 接口失败时的落库兜底',
  '<UpdateVariable><JSONPatch>[]</JSONPatch></UpdateVariable>',
  '06_败露_主殿杀令 -> 07_决裂_此去无归',
  '四项必须同时为正文事实',
]) {
  assert(mainUpdateRules.content.includes(mainGuard), `主模型变量协议缺少双更新约束：${mainGuard}`);
}
for (const protocolGuard of [
  '<UpdateVariable><JSONPatch>JSON 数组</JSONPatch></UpdateVariable>',
  '<UpdateVariable><JSONPatch>[]</JSONPatch></UpdateVariable>',
  '禁止把裸数组直接放在 <UpdateVariable> 下',
  '唯一直接子节点必须是一个 <JSONPatch>',
  '误写成 <UpdateVariable>[...]</UpdateVariable>',
]) {
  assert(updateRules.content.includes(protocolGuard), `变量输出协议缺少防回归约束：${protocolGuard}`);
}
assert(updateRules.content.includes('00 阶段硬闸门') && updateRules.content.includes('四项缺一不可'), '序章阶段缺少防提前推进闸门');
assert(updateRules.content.includes('意外跌落') && updateRules.content.includes('玩家尚未发送新的善意行动时保持原值'), '好感度缺少被动接触防误加约束');
assert(stageOutline?.content.includes('王权篇阶段剧情 v4.1.0'), '阶段骨架版本异常');
assert(plotGuide?.content.includes('王权篇演绎指南 v1.12.0'), '演绎指南版本异常');
assert(plotGuide.content.includes('凡涉及玩家一律写 {{user}}') && stageOutline.content.includes('不得恢复固定主角姓名'), '缺少玩家姓名宏硬约束');
assert(plotGuide.content.includes('不得再声称王权家尚不知道清瞳'), '主殿开局缺少当前变量防回退约束');
for (const antiSpoilerGuard of [
  '候选选项防剧透协议',
  '选行为，不选结果',
  '不得被改写成对玩家公开的路线预告',
  '只能描述 {{user}} 基于当前正文已知事实',
  '玩家未点击并实际发送前，候选选项不构成正文事实',
  '选项显示给玩家的文字与实际发送语义必须一致',
]) {
  assert(plotGuide.content.includes(antiSpoilerGuard), `演绎指南缺少选项防剧透约束：${antiSpoilerGuard}`);
}
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
assert(affinityController?.content.includes('version="3.4.0"'), '清瞳关系控制器版本异常');
for (const range of ['00-19', '20-39', '40-59', '60-79', '80-100']) {
  const entry = byComment(`清瞳好感人设槽位·${range}`);
  assert(entry && entry.enabled === false && entry.constant === false, `清瞳关系条目 ${range} 应为禁用动态条目`);
  assert(entry.content.includes('关系边界:') && !entry.content.includes('空槽位'), `清瞳关系条目 ${range} 尚未填入门槛`);
}
assert(affinityController.content.includes('不单独创造恋人关系'), '清瞳关系控制器缺少关系事实约束');
const qingTongCorePersona = byComment('清瞳核心人设');
assert(qingTongCorePersona && qingTongCorePersona.enabled === false && qingTongCorePersona.constant === false, '清瞳核心人设应为禁用动态条目');
assert(qingTongCorePersona.content.includes('清瞳核心人设 v2.0.0'), '清瞳核心人设版本异常');
assert(!qingTongCorePersona.content.includes('【待作者手动填写】'), '清瞳核心人设仍保留待填标记');
for (const personaGuard of [
  '<qing_tong_id1>',
  '底色_对选择权的珍惜',
  '胆怯中的行动力',
  '压力下的三面',
  '行动习惯与能力边界',
  '作者层秘密与信息边界',
  '痴情不等于只会献命',
  '依恋不等于失去自我',
]) {
  assert(qingTongCorePersona.content.includes(personaGuard), `清瞳核心人设缺少关键结构：${personaGuard}`);
}
assert(affinityController.content.includes('[mvu_plot]清瞳核心人设') && affinityController.content.includes('corePersonaReady'), '清瞳核心人设未接入控制器');

const spiderlingOverride = byComment('清瞳始终小蜘蛛娘');
const pureSpiderOverride = byComment('清瞳始终纯小蜘蛛');
for (const [entry, label] of [[spiderlingOverride, '小蜘蛛娘'], [pureSpiderOverride, '纯小蜘蛛']]) {
  assert(entry, `缺少${label}形态覆写条目`);
  assert(entry.enabled === false && entry.disable === true && entry.constant === true, `${label}形态覆写必须默认关闭且启用后常驻`);
  assert(!entry.comment.startsWith('[mvu_plot]') && !entry.comment.startsWith('[mvu_update]'), `${label}形态覆写必须同时提供给正文与变量模型`);
  assert(entry.key.length === 0, `${label}形态覆写不得依赖关键词触发`);
  assert(entry.order >= 9900, `${label}形态覆写注入顺序不够高`);
  assert(entry.content.includes('开启后的第一条回复直接按此形态继续'), `${label}形态覆写缺少无缝启用规则`);
  assert(entry.content.includes('恢复角色卡通常设定'), `${label}形态覆写缺少关闭后的默认回退规则`);
}
assert(spiderlingOverride.content.includes('priority="100"') && spiderlingOverride.content.includes('自动让位'), '小蜘蛛娘覆写缺少冲突让位规则');
assert(pureSpiderOverride.content.includes('priority="200"') && pureSpiderOverride.content.includes('最高优先级'), '纯小蜘蛛覆写缺少最高优先级规则');
assert(pureSpiderOverride.order > spiderlingOverride.order, '纯小蜘蛛覆写必须晚于小蜘蛛娘覆写注入');
for (const physicalGuard of ['没有人形头脸', '没有人形头脸、头发', '绝不生出人形部位']) {
  assert(pureSpiderOverride.content.includes(physicalGuard), `纯小蜘蛛覆写缺少完全非人形约束：${physicalGuard}`);
}

const requiredPlotPoints = [
  '闻伯霖战死黄风城外', '恶喙兽放大王权霸业怒火', '鹿妖在临死前从暴怒恢复清明',
  '尸山血海', '操控群妖的仇恨红线', '彼此认出却一言未发', '自困密室',
  '金灵鳞从凤牺处突然获得近似妖皇的力量', '斩断凤牺临走前留下的控制中枢',
  '身外不得出现笼子、牢笼、囚车、铁笼、刑架、封妖箱、结界容器',
  '第一个完整动作都是{{user}}主动挥出一剑、精准斩断捆妖索且不伤清瞳',
  '身上插满剑，怀中清瞳仍安然无恙', '东方月初赶到，以纯质阳炎炼去整座剑阵',
  '王权霸业在这一剑后愿意放{{user}}离开', '代号 12580',
  '清瞳不怕死，只求以我之命，以证我心', '用不着，我信你',
  '只要我王权在手，无人可伤我们分毫', '破除她桂冠上毒夫子留下的封禁', '龙湾',
  '无法凝聚王权剑', '东方月初立即从山头介入', '独立侠客身份行走天下', '返回王权山庄，受家法后继续作为家族兵器',
  '模糊卧底任务', '初见被放过、解除符咒并疗伤之时', '织画没有任务成分',
  '自由进出部分禁制的令牌', '最先察觉异常的是风庭云', '风庭云同时在主殿内',
  '让圈外力量向圈内渗入', '受到圈外力量污染', '红线同时干涉受控者的情绪与行动',
  '金灵鳞从凤牺处', '王权剑本身压倒性的强度', '完成求援后返回自己的地界',
  '阻止这件事演变成新一轮报复', '清瞳就是 12580', '确认自己打不过此刻的{{user}}',
  '王权剑既是最强兵刃，也是王权家继承与正统的象征', '关系未暴露时，不得让王权霸业、长老或道盟凭空知道清瞳',
  '玩家明确拒绝并持剑救走清瞳后，进入持剑突围', '本线是两人共同流浪，与拒绝清瞳后的独行侠客线严格区分',
  '带剑会显著提高王权家与道盟的追索强度', '离庄不会自动洗掉这件事',
  '涂山是可选目的地，不是私奔后的强制终点', '临时庇护', '合作换取立足', '外交对峙',
  '涂山红红负责判断是否给予庇护', '涂山容容负责核对情报', '涂山雅雅更可能直接质疑', '翠玉灵只在确有伤情',
  '击败王权家长老', '王权霸业依旧不会亲自出手', '东方月初接手撤离',
  '持剑线不会遭遇毒娘子', '保持 08 并自由行动',
  '{{user}}既是加害者，也是王权家长期塑造出的兵器', '维护清瞳遗体与遗物的尊严',
  '更加安静、更加精确的训练与服从误读为剑心重新稳定',
  '余火未熄', '不完整的真话', '救人仍被驱逐', '半块糖饼', '把去留交还玩家',
  '只明确救下两条命不等于修好一段关系', '一个被救的孩子可以偷偷送来半块糖饼',
  '不偷偷消失、不故意留下遗书', '重新或暂时选择彼此',
  '手持王权剑的{{user}}就是王权家最强者', '长老随后亲自出手，仍被{{user}}逐一击败',
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
const betrayalDetail = byComment('阶段详案·开天与叛门');
assert(betrayalDetail.content.includes('王权篇阶段详案·开天与叛门 v1.6.0'), '开天与叛门详案版本异常');
assert(betrayalDetail.content.includes('适用阶段: 05_黄风_一剑开天、06_败露_主殿杀令、07_决裂_此去无归、08_结局_无心之剑'), '开天与叛门详案未声明适用于无心之剑');
for (const pacingGuard of [
  '强制拆成至少两个连续的 assistant 回复',
  '第一回复必须停在{{user}}已经万剑穿心',
  '东方月初在该回复中绝对不得出现',
  '且玩家又发送了下一条消息后',
  '不得用同一回复中的段落切换冒充两个回合',
]) {
  assert(betrayalDetail.content.includes(pacingGuard), `弃剑线回合切分缺少约束：${pacingGuard}`);
}
for (const variablePacingGuard of [
  '逃离链完成前保持 07',
  '尚未万剑穿心，东方月初不得登场',
  '{{user}}已万剑穿心跪地护住清瞳；东方月初尚未登场',
  '只有后续玩家消息到来后',
]) {
  assert(updateRules.content.includes(variablePacingGuard), `弃剑线变量承接缺少约束：${variablePacingGuard}`);
}
const dragonbayDetail = byComment('阶段详案·一二五八零与龙湾');
assert(dragonbayDetail.content.includes('王权篇阶段详案·一二五八零与龙湾 v1.8.0'), '一二五八零与龙湾详案版本异常');
for (const imageMarkerGuard of [
  '王权剑凝聚插图协议',
  '<HyxhnWangquanSwordAwakening/>',
  '玩家明确相信并保护清瞳',
  '王权剑已经于手中凝聚成形',
  '位于本轮 <UpdateVariable> 之前',
  '持剑逃离路线中原本保留实体王权剑',
  '不得反过来作为凝聚成功',
]) {
  assert(dragonbayDetail.content.includes(imageMarkerGuard), `王权剑凝聚插图协议缺少约束：${imageMarkerGuard}`);
}
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
const mediaConfigScript = parsed.get('04-王权篇媒体资源配置.json');
assert(mediaConfigScript.content.includes('v1.4.0'), '媒体配置脚本版本异常');
const embeddedAudioMatch = mediaConfigScript.content.match(/data:audio\/mpeg;base64,([A-Za-z0-9+/=]+)/);
assert(embeddedAudioMatch, '媒体配置脚本缺少内嵌 MP3 data URL');
const sourceAudio = await readFile(path.join(projectRoot, '音乐', '呦猫UNEKO - 梦回还·内嵌压缩版.mp3'));
const embeddedAudio = Buffer.from(embeddedAudioMatch[1], 'base64');
assert(embeddedAudio.equals(sourceAudio), '媒体配置脚本内嵌 MP3 与源文件不一致');
assert(sourceAudio.length < 4_200_000, `完整曲长内嵌压缩版 BGM 仍然过大：${sourceAudio.length} 字节`);
assert(!mediaConfigScript.content.includes('http://') && !mediaConfigScript.content.includes('https://'), '媒体配置脚本仍依赖外部音频地址');
assert(mediaConfigScript.data.mediaConfig.tracks.dream_return.sourceMode === 'embedded-data-url', '媒体配置未标记内嵌音频模式');
assert(mediaConfigScript.data.mediaConfig.tracks.dream_return.sourceAsset.includes('内嵌压缩版'), '媒体配置未指向压缩音频资产');
assert(media.content.includes('v2.27.0'), '媒体控制器版本异常');
assert(media.content.includes("/^data:audio\\/[a-z0-9.+-]+;base64,/i"), '媒体控制器缺少 data URL 直通逻辑');
for (const waterfallDensityGuard of [
  'font-size: clamp(12px, 1.15vw, 17px)',
  'const burst = 40',
  'duration: 6.4 + Math.random() * 2.4',
  'scheduleWaterfall(normalLoop, 72 + Math.random() * 24)',
]) {
  assert(media.content.includes(waterfallDensityGuard), `滚动弹幕瀑布密度参数异常：${waterfallDensityGuard}`);
}
assert(media.content.includes("const DECISION_STAGE = '07_决裂_此去无归'"), '拔剑窗口决裂阶段异常');
for (const stage of stages) assert(media.content.includes(`'${stage}'`), `媒体事件缺少阶段 ${stage}`);
assert(media.content.includes("music: 'dream_return'"), '《梦回还》阶段音乐配置缺失');
assert(media.content.includes('tavern_events.MESSAGE_RECEIVED') && media.content.includes('stopPostChoiceFollowupEffect'), '弹幕/BGM 未绑定正常回复完成事件');
for (const lifecycleGuard of [
  'tavern_events.GENERATION_ENDED',
  'tavern_events.GENERATION_STOPPED',
  'handlePostChoiceGenerationEnded',
  'handlePostChoiceGenerationStopped',
  '生成生命周期结束（含空返回、HTTP 400/502 与请求异常）',
  'POST_CHOICE_REQUEST_TIMEOUT_MS = 300000',
]) {
  assert(media.content.includes(lifecycleGuard), `弹幕/BGM 请求异常收尾缺少约束：${lifecycleGuard}`);
}
for (const audioEndGuard of [
  "audio.addEventListener('ended', handlePostChoiceAudioEnded)",
  "startTrack('dream_return', { restart: true, loopOverride: false })",
  "audio.loop = typeof loopOverride === 'boolean' ? loopOverride : track.loop !== false",
  'BGM 完整播放结束，触发硬性收尾',
  "finishPostChoiceRequest('BGM 完整播放结束，触发硬性收尾', null, { immediateMusic: true })",
]) {
  assert(media.content.includes(audioEndGuard), `弹幕/BGM 音频结束硬闸缺少约束：${audioEndGuard}`);
}
assert(media.content.indexOf('stopPostChoiceFollowupEffect(replyId)') < media.content.indexOf('postEffectReplyReceived: gameEligible'), '正常回复必须先停止视听效果再推进小游戏链');

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
assert(bullethell.content.includes("version: '1.8.0'"), '无尽剑幕脚本运行时版本异常');
assert(!bullethell.content.includes('dream_return') && !bullethell.content.includes('playTrack(') && !bullethell.content.includes('stopMusic'), '无尽剑幕仍残留背景音乐调用');
assert(bullethell.content.includes('createAudioEngine()'), '无尽剑幕本地操作音效被误删');
const playerSprite = await readFile(path.join(projectRoot, 'assets', 'bullethell-player.webp'));
assert(playerSprite.length < 30_000, `无尽剑幕玩家角色图仍然过大：${playerSprite.length} 字节`);
const playerSpriteMatch = bullethell.content.match(/data:image\/webp;base64,([A-Za-z0-9+/=]+)/);
assert(playerSpriteMatch, '无尽剑幕玩家角色图未编码进脚本');
assert(Buffer.from(playerSpriteMatch[1], 'base64').equals(playerSprite), '脚本内玩家角色图与压缩资产不一致');
assert(!bullethell.content.includes('__HYXHN_BULLETHELL_PLAYER_SPRITE_DATA_URL__'), '无尽剑幕仍残留玩家角色图占位符');
assert(bullethell.content.includes('ctx.drawImage(sprite') && bullethell.content.includes('radius: 4'), '玩家角色图绘制或小判定点异常');
const bullethellResultImage = await readFile(path.join(projectRoot, 'assets', 'bullethell-result.webp'));
assert(bullethellResultImage.length > 40_000 && bullethellResultImage.length < 120_000, `王权剑凝聚插图体积异常：${bullethellResultImage.length} 字节`);
assert(bullethellResultImage.subarray(0, 4).toString('ascii') === 'RIFF' && bullethellResultImage.subarray(8, 12).toString('ascii') === 'WEBP', '王权剑凝聚插图不是有效 WebP 容器');
assert(!bullethellResultImage.equals(playerSprite), '王权剑凝聚插图错误复用玩家角色小图');
for (const swordBulletGuard of [
  'Math.hypot(bullet.vx, bullet.vy)',
  'const tip = point(radius * 3.25)',
  'const tipShoulderLeft = point(radius * 2.45, radius * 0.68)',
  'const tipShoulderRight = point(radius * 2.45, -radius * 0.68)',
  'const bladeLeft = point(-radius * 0.48, radius * 0.68)',
  "ctx.globalCompositeOperation = 'source-over'",
  'const bladeGradient = ctx.createLinearGradient',
  "ctx.strokeStyle = '#4a2a0d'",
  'ctx.moveTo(bladeBase.x, bladeBase.y)',
  'ctx.lineTo(tipShoulderLeft.x, tipShoulderLeft.y)',
  'const guardLeft = point(-radius * 0.72, radius * 1.16)',
  'const gripEnd = point(-radius * 1.72)',
  'const trailEnd = point(-radius * 4.1)',
]) {
  assert(bullethell.content.includes(swordBulletGuard), `剑形飞弹绘制缺少约束：${swordBulletGuard}`);
}
const finishDeathBlock = bullethell.content.slice(bullethell.content.indexOf('async function finishDeath()'), bullethell.content.indexOf('function countdownStep'));
assert(finishDeathBlock.includes("run.mode = 'finishing'") && finishDeathBlock.includes("status.textContent = ''"), '死亡收尾未清除暂停字幕');
assert(!finishDeathBlock.includes("run.mode = 'paused'"), '死亡收尾仍会进入暂停字幕分支');
for (const removedGameImageHook of [
  'RESULT_MARKER',
  'HyxhnBullethellResult',
  'queueResultMarker',
  'tryAttachResultMarker',
  'setChatMessages(',
  'getChatMessages(',
]) {
  assert(!bullethell.content.includes(removedGameImageHook), `无尽剑幕仍残留游戏结束插图逻辑：${removedGameImageHook}`);
}
assert(!bullethell.content.includes('createChatMessages('), '无尽剑幕不应为插图额外创建消息楼层');

console.log('验证通过');
console.log('- 8 个 JSON 可解析，7 支脚本九字段完整且 UUID 唯一');
console.log(`- 《梦回还》已作为 ${embeddedAudio.length} 字节 MP3 完整编码进媒体配置脚本，无外部音频请求`);
console.log(`- 玩家角色图已作为 ${playerSprite.length} 字节透明 WebP 编码进无尽剑幕脚本，独立小判定点保持不变`);
console.log(`- 王权剑凝聚插图沿用 ${bullethellResultImage.length} 字节 WebP，由主模型标记和显示正则触发`);
console.log('- 世界书 42 条，含主模型与额外模型双重变量更新、17 阶段、6 条动态剧情详案、1 条完整清瞳核心人设与 2 条可选形态覆写');
console.log('- 常驻大纲字符预算、17 阶段导航、动态详案迁移与全部关键剧情锚点均已验证');
