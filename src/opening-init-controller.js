// 狐妖小红娘·王权篇开局选择控制器 v2.0.0
// v2.0.0: 不再手动写 MVU；选择页只切换到已由原生 <initvar> 初始化的目标 swipe。
const OPENING_SELECT_EVENT = 'hyxhn_opening_selected';
const SELECTOR_TEXT = '【开始】';
const ALLOWED_SWIPE_IDS = new Set([1, 2]);
let selecting = false;

function currentOpeningMessage() {
  try {
    return getChatMessages(0, { include_swipes: true })?.[0] || null;
  } catch (_) {
    return null;
  }
}

function selectorIsActive() {
  const message = currentOpeningMessage();
  if (!message || getLastMessageId() !== 0) return false;
  const currentText = message.swipes?.[message.swipe_id] ?? '';
  return message.swipe_id === 0 && String(currentText).trim() === SELECTOR_TEXT;
}

async function selectOpening(rawSwipeId) {
  const swipeId = Number(rawSwipeId);
  if (selecting || !ALLOWED_SWIPE_IDS.has(swipeId)) return;

  const message = currentOpeningMessage();
  if (!selectorIsActive() || !message?.swipes?.[swipeId] || !message?.swipes_data?.[swipeId]) {
    toastr.warning('开局尚未完成 MVU 初始化，请重载脚本后新建聊天。', '王权篇开局');
    return;
  }

  selecting = true;
  try {
    await setChatMessages([{ message_id: 0, swipe_id: swipeId }], { refresh: 'affected' });
    console.info(`[王权篇开局] 已切换到 swipe ${swipeId}，正文与原生 MVU 变量快照同步生效。`);
  } catch (error) {
    console.error('[王权篇开局] 切换失败。', error);
    toastr.error('开局切换失败，请查看日志。', '王权篇开局');
  } finally {
    selecting = false;
  }
}

function blockPrematureSend(event) {
  if (!selectorIsActive()) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  toastr.info('请先在开局选择页中选择一个故事起点。', '王权篇开局');
}

function registerSendGuard() {
  let parentDocument;
  try {
    parentDocument = window.parent?.document || document;
  } catch (_) {
    parentDocument = document;
  }

  const clickHandler = event => {
    if (event.target?.closest?.('#send_but')) blockPrematureSend(event);
  };
  const keydownHandler = event => {
    if (event.key === 'Enter' && !event.shiftKey && event.target?.closest?.('#send_textarea')) {
      blockPrematureSend(event);
    }
  };

  parentDocument.addEventListener('click', clickHandler, true);
  parentDocument.addEventListener('keydown', keydownHandler, true);
  $(window).on('pagehide', () => {
    parentDocument.removeEventListener('click', clickHandler, true);
    parentDocument.removeEventListener('keydown', keydownHandler, true);
  });
}

eventOn(OPENING_SELECT_EVENT, selectOpening);
registerSendGuard();

export {};
