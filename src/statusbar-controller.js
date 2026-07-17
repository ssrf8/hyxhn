// 狐妖小红娘·王权篇状态栏控制器 v1.4.0
// v1.4.0: 增加执剑夺权与携瞳远走两条自由主线阶段。
// v1.3.0: 增加关系修复与独立前路阶段，并同步参考轨道承接字段。
// v1.2.0: 显示黄风城、主殿决裂、12580 与龙湾阶段。
// scoped 正则只投放安全挂载点，本脚本以 Shadow DOM 渲染并读取挂载点所在楼层的 MVU。
const STATUSBAR_HTML = __HYXHN_STATUSBAR_HTML__;
const MOUNT_SELECTOR = '[data-hyxhn-statusbar-mount]';
const roots = new Map();

const STAGE_NAMES = Object.freeze({
  '00_序章_道门兵人': '序章 · 道门兵人',
  '01_任务_蛛网疑影': '任务 · 蛛网疑影',
  '02_初遇_笼中清瞳': '初遇 · 笼中清瞳',
  '03_黄风_怒火迷城': '黄风 · 怒火迷城',
  '04_黄风_红线家法': '黄风 · 红线家法',
  '05_黄风_一剑开天': '黄风 · 一剑开天',
  '06_分岔_执剑夺权': '分岔 · 执剑夺权',
  '06_分岔_携瞳远走': '分岔 · 携瞳远走',
  '06_败露_主殿杀令': '败露 · 主殿杀令',
  '07_决裂_此去无归': '决裂 · 此去无归',
  '08_尾声_万水千山': '尾声 · 万水千山',
  '08_结局_无心之剑': '结局 · 无心之剑',
  '09_深山_代号一二五八零': '深山 · 代号一二五八零',
  '10_再起_王权在手': '再起 · 王权在手',
  '11_余波_关系修复': '余波 · 关系修复',
  '11_分途_独立前路': '分途 · 独立前路',
  '11_前路_龙湾之约': '前路 · 龙湾之约',
});

function parentDocument() {
  try { return window.parent?.document || document; } catch { return document; }
}

function getMvu() {
  try { return window.parent?.Mvu || window.Mvu || null; } catch { return window.Mvu || null; }
}

function getMessageData(messageId) {
  const mvu = getMvu();
  if (mvu) return mvu.getMvuData({ type: 'message', message_id: messageId }) || {};
  if (typeof getVariables === 'function') return getVariables({ type: 'message', message_id: messageId }) || {};
  return {};
}

function affinityName(value) {
  if (value < 20) return '疏离 / 警戒';
  if (value < 40) return '试探 / 有限合作';
  if (value < 60) return '信任 / 同伴';
  if (value < 80) return '亲近 / 牵挂';
  return '深情 / 相守';
}

function messageIdOf(mount) {
  const message = mount.closest?.('.mes');
  const raw = message?.getAttribute('mesid') ?? message?.dataset?.mesid;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : 'latest';
}

function write(root, id, value, fallback = '--') {
  const node = root.getElementById(id);
  if (node) node.textContent = value === undefined || value === null || value === '' ? fallback : String(value);
}

function render(mount, root) {
  try {
    const data = getMessageData(messageIdOf(mount));
    const stat = data.stat_data || {
      剧情: { 当前阶段: '00_序章_道门兵人', 最终抉择: '尚未选择', 轨道状态: '贴合参考', 承接约束: '', 时间: '暮色将临', 地点: '王权山庄·演武场' },
      清瞳: { 状态: '未正式现身，正在暗处侦察王权山庄', 好感度: 5, 心声: '王权家的兵器……最好不要惊动他。' },
    };
    const stage = _.get(stat, '剧情.当前阶段', '00_序章_道门兵人');
    const affinity = _.clamp(Math.round(Number(_.get(stat, '清瞳.好感度', 5)) || 0), 0, 100);
    const decision = _.get(stat, '剧情.最终抉择', '尚未选择');
    write(root, 'stage', STAGE_NAMES[stage] || stage);
    write(root, 'time', _.get(stat, '剧情.时间'));
    write(root, 'location', _.get(stat, '剧情.地点'));
    write(root, 'qing-status', _.get(stat, '清瞳.状态'), '暂无状态记录');
    write(root, 'decision', decision, '尚未选择');
    const decisionSection = root.getElementById('decision-section');
    if (decisionSection) decisionSection.hidden = decision === '尚未选择' && stage !== '07_决裂_此去无归';
    write(root, 'thought', _.get(stat, '清瞳.心声'), '……');
    write(root, 'affinity-label', affinityName(affinity));
    write(root, 'affinity-value', `${affinity} / 100`);
    write(root, 'affinity-badge', `好感 ${affinity}`);
    const fill = root.getElementById('affinity-fill');
    if (fill) fill.style.width = `${affinity}%`;
  } catch (error) {
    write(root, 'stage', '状态栏暂未就绪');
    write(root, 'qing-status', error?.message, '请确认 MVU 已启用');
  }
}

function mountOne(mount) {
  if (roots.has(mount)) return;
  const root = mount.shadowRoot || mount.attachShadow({ mode: 'open' });
  root.innerHTML = STATUSBAR_HTML;
  roots.set(mount, root);
  render(mount, root);
}

function scan() {
  const doc = parentDocument();
  doc.querySelectorAll(MOUNT_SELECTOR).forEach(mountOne);
  for (const [mount] of roots) {
    if (!mount.isConnected) roots.delete(mount);
  }
}

function renderAll() {
  scan();
  for (const [mount, root] of roots) render(mount, root);
}

function initialize() {
  const doc = parentDocument();
  scan();
  const observer = new MutationObserver(scan);
  observer.observe(doc.body, { childList: true, subtree: true });
  $(window).on('pagehide', () => observer.disconnect());
  if (typeof waitGlobalInitialized === 'function') {
    waitGlobalInitialized('Mvu').then(() => {
      renderAll();
      const mvu = getMvu();
      if (typeof eventOn === 'function' && mvu?.events?.VARIABLE_UPDATE_ENDED) {
        eventOn(mvu.events.VARIABLE_UPDATE_ENDED, renderAll);
      }
    }).catch(error => console.warn('[王权篇状态栏] MVU 初始化等待失败，继续使用楼层变量。', error));
  }
}

$(initialize);

export {};
