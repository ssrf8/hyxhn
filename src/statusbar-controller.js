// 狐妖小红娘·王权篇状态栏控制器 v1.0.0
// scoped 正则只投放安全挂载点，本脚本以 Shadow DOM 渲染并读取挂载点所在楼层的 MVU。
const STATUSBAR_HTML = __HYXHN_STATUSBAR_HTML__;
const MOUNT_SELECTOR = '[data-hyxhn-statusbar-mount]';
const roots = new Map();

const STAGE_NAMES = Object.freeze({
  '00_序章_道门兵人': '序章 · 道门兵人',
  '01_任务_蛛网疑影': '任务 · 蛛网疑影',
  '02_初遇_笼中清瞳': '初遇 · 笼中清瞳',
  '03_相知_画中山河': '相知 · 画中山河',
  '04_决裂_出逃山庄': '决裂 · 出逃山庄',
  '05_尾声_万水千山': '尾声 · 万水千山',
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
      剧情: { 当前阶段: '00_序章_道门兵人', 时间: '暮色将临', 地点: '王权山庄·演武场' },
      清瞳: { 状态: '未正式现身，正在暗处侦察王权山庄', 好感度: 5, 心声: '王权家的兵器……最好不要惊动他。' },
    };
    const stage = _.get(stat, '剧情.当前阶段', '00_序章_道门兵人');
    const affinity = _.clamp(Math.round(Number(_.get(stat, '清瞳.好感度', 5)) || 0), 0, 100);
    write(root, 'stage', STAGE_NAMES[stage] || stage);
    write(root, 'time', _.get(stat, '剧情.时间'));
    write(root, 'location', _.get(stat, '剧情.地点'));
    write(root, 'qing-status', _.get(stat, '清瞳.状态'), '暂无状态记录');
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
