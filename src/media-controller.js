// 狐妖小红娘·王权篇顶层弹幕与音乐控制器 v1.1.3
// v1.1.3: 显式锁定顶层容器为视口尺寸，避免酒馆窄屏布局将 fixed 容器高度压成 0。
// v1.1.2: 已有媒体配置时不再跨越 await，保留测试按钮点击带来的音频播放授权。
// v1.1.1: 弹幕层和测试按钮同步初始化；增加顶层点击捕获兜底与重复触发去重。
// v1.0.0: MVU 阶段触发、顶层滚动/中央弹幕、本地或远程音频、淡入淡出与测试按钮。

const SCRIPT_ID = '0d8f88ef-8b8e-4b25-96a4-848bfebfb205';
const CONFIG_SCRIPT_ID = '2fcf1384-8802-4b31-9ee9-2c5da8f4e011';
const ROOT_ID = 'hyxhn-wangquan-top-overlay';
const AUDIO_ID = 'hyxhn-wangquan-audio';
const AUDIO_UNLOCK_ID = 'hyxhn-wangquan-audio-unlock';
const AUDIO_UNLOCK_BRIDGE_ID = 'hyxhn-wangquan-audio-unlock-bridge';
const AUDIO_UNLOCK_CLEANUP_KEY = '__HYXHN_WANGQUAN_AUDIO_UNLOCK_CLEANUP__';
const CHAT_STATE_KEY = 'hyxhn_media_runtime';
const MEDIA_CONFIG_GLOBAL_KEY = '__HYXHN_WANGQUAN_MEDIA_CONFIG__';

const MVU_EVENTS = {
  initialized: 'mag_variable_initiailized',
  updateEnded: 'mag_variable_update_ended',
};

const STAGE_EVENTS = Object.freeze({
  '00_序章_道门兵人': {
    normal: ['王权山庄，戒律森严', '他被称作王权家最锋利的剑'],
  },
  '01_任务_蛛网疑影': {
    normal: ['新的除妖令已经下达', '这一次的妖气来自蛛网深处'],
  },
  '02_初遇_笼中清瞳': {
    music: 'dream_return',
    normal: ['清瞳登场！', '命运的蛛丝已经相连', '她带来的不只是一次刺探'],
  },
  '03_相知_画中山河': {
    normal: ['原来山庄之外还有这样的天地', '她用蛛丝织出了他未见过的风景'],
    center: ['他第一次真正向往山庄之外的世界'],
  },
  '04_决裂_出逃山庄': {
    normal: ['王权剑意与家规正面相撞', '前方是整座山庄的阻拦'],
    center: ['纵然万剑加身，他也没有回头'],
  },
  '05_尾声_万水千山': {
    normal: ['这一次，选择不再由家族替他作出'],
    center: ['若能走出这里，便一起去看万水千山'],
  },
});

const runtime = {
  parentDocument: null,
  overlay: null,
  audio: null,
  config: null,
  configReady: null,
  lastStage: null,
  lastButtonAction: null,
  currentTrack: null,
  pendingPlayback: false,
  audioUnlockCleanup: null,
  fadeTimer: null,
  timers: new Set(),
  cleanupCallbacks: [],
};

function safeParentDocument() {
  try {
    return window.parent?.document || document;
  } catch (error) {
    console.warn('[王权篇媒体] 无法访问酒馆顶层页面，降级到脚本 iframe。', error);
    return document;
  }
}

function schedule(callback, delay) {
  const timer = window.setTimeout(() => {
    runtime.timers.delete(timer);
    callback();
  }, delay);
  runtime.timers.add(timer);
  return timer;
}

function mountOverlay() {
  const doc = runtime.parentDocument;
  doc.getElementById(ROOT_ID)?.remove();

  const root = doc.createElement('div');
  root.id = ROOT_ID;
  root.setAttribute('aria-hidden', 'true');

  const style = doc.createElement('style');
  style.textContent = `
    #${ROOT_ID} {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      z-index: 2147483000;
      pointer-events: none;
      overflow: hidden;
      contain: layout paint;
      font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
    }
    #${ROOT_ID} #${AUDIO_UNLOCK_ID} {
      position: absolute;
      left: 50%;
      top: 58%;
      transform: translateX(-50%);
      pointer-events: auto;
      appearance: none;
      border: 1px solid rgba(255, 232, 190, .88);
      border-radius: 999px;
      padding: .72em 1.35em;
      color: #fff8e8;
      background: rgba(70, 17, 32, .9);
      box-shadow: 0 8px 30px rgba(0, 0, 0, .42), 0 0 18px rgba(203, 37, 75, .45);
      font: inherit;
      font-size: clamp(15px, 1.6vw, 21px);
      font-weight: 700;
      cursor: pointer;
    }
    #${ROOT_ID} .hyxhn-danmaku-normal {
      position: absolute;
      left: 100vw;
      max-width: 72vw;
      white-space: nowrap;
      color: #fff;
      font-size: clamp(18px, 2vw, 30px);
      font-weight: 700;
      line-height: 1.4;
      letter-spacing: .04em;
      text-shadow: 0 2px 3px #000, 0 0 8px rgba(214, 67, 96, .9);
      animation: hyxhn-danmaku-fly var(--hyxhn-duration, 9s) linear forwards;
      will-change: transform;
    }
    #${ROOT_ID} .hyxhn-danmaku-center {
      position: absolute;
      left: 50%;
      top: 46%;
      width: min(86vw, 1000px);
      color: #fff4df;
      font-size: clamp(26px, 4vw, 58px);
      font-weight: 800;
      line-height: 1.35;
      text-align: center;
      letter-spacing: .08em;
      text-shadow: 0 3px 4px #000, 0 0 14px rgba(203, 37, 75, .95);
      animation: hyxhn-danmaku-center-in 4.2s ease both;
      will-change: transform, opacity;
    }
    @keyframes hyxhn-danmaku-fly {
      from { transform: translateX(0); }
      to { transform: translateX(calc(-100vw - 100%)); }
    }
    @keyframes hyxhn-danmaku-center-in {
      0% { opacity: 0; transform: translate(-50%, -50%) scale(.84); filter: blur(3px); }
      16%, 72% { opacity: 1; transform: translate(-50%, -50%) scale(1); filter: blur(0); }
      100% { opacity: 0; transform: translate(-50%, -50%) scale(1.06); filter: blur(1px); }
    }
    @media (max-width: 720px) {
      #${ROOT_ID} .hyxhn-danmaku-normal { max-width: 88vw; }
      #${ROOT_ID} .hyxhn-danmaku-center { width: 92vw; top: 43%; }
    }
    @media (prefers-reduced-motion: reduce) {
      #${ROOT_ID} .hyxhn-danmaku-normal { animation-duration: 14s; }
      #${ROOT_ID} .hyxhn-danmaku-center { animation-duration: 5.5s; }
    }
  `;

  root.appendChild(style);
  doc.body.appendChild(root);
  runtime.overlay = root;
}

function mountAudioUnlockBridge() {
  const doc = runtime.parentDocument;
  const parentWindow = doc.defaultView;
  parentWindow?.[AUDIO_UNLOCK_CLEANUP_KEY]?.();
  doc.getElementById(AUDIO_UNLOCK_BRIDGE_ID)?.remove();

  const bridge = doc.createElement('script');
  bridge.id = AUDIO_UNLOCK_BRIDGE_ID;
  bridge.textContent = `(() => {
    const handler = async (event) => {
      const button = event.target?.closest?.('#${AUDIO_UNLOCK_ID}');
      if (!button) return;
      const audio = document.getElementById('${AUDIO_ID}');
      if (!audio) return;
      try {
        await audio.play();
        button.remove();
      } catch (error) {
        console.warn('[王权篇媒体] 顶层页面仍未允许播放音乐。', error);
      }
    };
    document.addEventListener('click', handler, true);
    window['${AUDIO_UNLOCK_CLEANUP_KEY}'] = () => {
      document.removeEventListener('click', handler, true);
      delete window['${AUDIO_UNLOCK_CLEANUP_KEY}'];
    };
  })();`;
  doc.head.appendChild(bridge);
}

function showNormalDanmaku(text, options = {}) {
  if (!runtime.overlay || !text) return;
  const node = runtime.parentDocument.createElement('div');
  node.className = 'hyxhn-danmaku-normal';
  node.textContent = String(text);
  node.style.top = `${options.top ?? 12 + Math.random() * 62}%`;
  node.style.setProperty('--hyxhn-duration', `${options.duration ?? 8 + Math.random() * 3}s`);
  runtime.overlay.appendChild(node);
  node.addEventListener('animationend', () => node.remove(), { once: true });
}

function showCenterDanmaku(text) {
  if (!runtime.overlay || !text) return;
  const node = runtime.parentDocument.createElement('div');
  node.className = 'hyxhn-danmaku-center';
  node.textContent = String(text);
  runtime.overlay.appendChild(node);
  node.addEventListener('animationend', () => node.remove(), { once: true });
}

async function readMediaConfig() {
  const fallback = { assetBaseUrl: '', tracks: {} };

  // 配置脚本与控制器位于不同 iframe，加载顺序不固定；短暂等待配置发布到顶层页面。
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const published = runtime.parentDocument?.defaultView?.[MEDIA_CONFIG_GLOBAL_KEY];
    if (published?.tracks && Object.keys(published.tracks).length > 0) {
      return _.merge({}, fallback, published);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  // 兼容旧版配置脚本保存到脚本变量的情况。
  try {
    const scriptData = getVariables({ type: 'script', script_id: CONFIG_SCRIPT_ID });
    const source = scriptData?.mediaConfig || scriptData || {};
    return _.merge({}, fallback, source);
  } catch (error) {
    console.error('[王权篇媒体] 读取媒体配置失败。', error);
    return fallback;
  }
}

function resolveAssetUrl(relativeOrAbsolute) {
  if (!relativeOrAbsolute) return '';
  try {
    return new URL(relativeOrAbsolute, runtime.config.assetBaseUrl).href;
  } catch (error) {
    console.error('[王权篇媒体] 无法解析资源地址。', relativeOrAbsolute, error);
    return '';
  }
}

function ensureAudioElement() {
  if (runtime.audio?.isConnected) return runtime.audio;
  const oldAudio = runtime.parentDocument.getElementById(AUDIO_ID);
  oldAudio?.remove();

  const audio = runtime.parentDocument.createElement('audio');
  audio.id = AUDIO_ID;
  audio.preload = 'auto';
  audio.style.display = 'none';
  runtime.parentDocument.body.appendChild(audio);
  runtime.audio = audio;
  return audio;
}

function clearFade() {
  if (runtime.fadeTimer !== null) {
    window.clearInterval(runtime.fadeTimer);
    runtime.fadeTimer = null;
  }
}

function fadeVolume(target, duration, onDone) {
  clearFade();
  const audio = ensureAudioElement();
  const start = Number.isFinite(audio.volume) ? audio.volume : 0;
  const startedAt = Date.now();
  const safeDuration = Math.max(0, duration || 0);

  if (safeDuration === 0) {
    audio.volume = _.clamp(target, 0, 1);
    onDone?.();
    return;
  }

  runtime.fadeTimer = window.setInterval(() => {
    const progress = Math.min(1, (Date.now() - startedAt) / safeDuration);
    audio.volume = _.clamp(start + (target - start) * progress, 0, 1);
    if (progress >= 1) {
      clearFade();
      onDone?.();
    }
  }, 50);
}

function armAudioUnlock() {
  if (runtime.pendingPlayback) return;
  runtime.pendingPlayback = true;
  showCenterDanmaku('音乐已准备，点击页面后开始播放');

  let unlockButton = runtime.parentDocument.getElementById(AUDIO_UNLOCK_ID);
  if (!unlockButton) {
    unlockButton = runtime.parentDocument.createElement('button');
    unlockButton.id = AUDIO_UNLOCK_ID;
    unlockButton.type = 'button';
    unlockButton.textContent = '点击启用音乐';
    unlockButton.setAttribute('aria-label', '点击启用音乐');
    runtime.overlay?.appendChild(unlockButton);
  }

  let retrying = false;
  const cleanupUnlock = () => {
    unlockButton?.removeEventListener('click', retry);
    runtime.parentDocument.removeEventListener('pointerdown', retry, true);
    unlockButton?.remove();
    if (runtime.audioUnlockCleanup === cleanupUnlock) runtime.audioUnlockCleanup = null;
  };
  const retry = async () => {
    if (retrying) return;
    retrying = true;
    try {
      await runtime.audio?.play();
      runtime.pendingPlayback = false;
      cleanupUnlock();
    } catch (error) {
      console.warn('[王权篇媒体] 用户交互后仍无法播放音乐。', error);
    } finally {
      retrying = false;
    }
  };

  runtime.audioUnlockCleanup?.();
  runtime.audioUnlockCleanup = cleanupUnlock;
  unlockButton.addEventListener('click', retry);
  runtime.parentDocument.addEventListener('pointerdown', retry, { capture: true });
}

async function startTrack(trackKey, { restart = false } = {}) {
  // 已加载配置时必须保持在按钮点击的同步调用链里；无条件 await 会丢失浏览器的用户激活状态。
  if (!runtime.config && runtime.configReady) await runtime.configReady;
  const track = runtime.config?.tracks?.[trackKey];
  if (!track) {
    console.warn(`[王权篇媒体] 未找到曲目配置：${trackKey}`);
    return;
  }

  const url = resolveAssetUrl(track.src);
  if (!url) return;
  const audio = ensureAudioElement();
  const targetVolume = _.clamp(Number(track.volume ?? 0.4), 0, 1);

  if (runtime.currentTrack === trackKey && audio.src === url && !restart) {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        armAudioUnlock();
      }
    }
    fadeVolume(targetVolume, Number(track.fadeInMs ?? 800));
    return;
  }

  const loadAndPlay = async () => {
    audio.src = url;
    audio.loop = track.loop !== false;
    audio.volume = 0;
    audio.load();
    runtime.currentTrack = trackKey;
    try {
      await audio.play();
      fadeVolume(targetVolume, Number(track.fadeInMs ?? 1200));
    } catch (error) {
      console.info('[王权篇媒体] 浏览器阻止了自动播放，等待玩家点击。', error);
      armAudioUnlock();
    }
  };

  if (!audio.paused && audio.currentTime > 0) {
    fadeVolume(0, Number(track.fadeOutMs ?? 700), () => {
      audio.pause();
      void loadAndPlay();
    });
  } else {
    await loadAndPlay();
  }
}

function stopMusic() {
  runtime.pendingPlayback = false;
  runtime.audioUnlockCleanup?.();
  if (!runtime.audio) return;
  fadeVolume(0, 600, () => {
    runtime.audio.pause();
    runtime.audio.currentTime = 0;
    runtime.currentTrack = null;
  });
}

function getChatRuntime() {
  try {
    return getVariables({ type: 'chat' })?.[CHAT_STATE_KEY] || { triggered: {} };
  } catch {
    return { triggered: {} };
  }
}

function markTriggered(stage) {
  updateVariablesWith((variables) => {
    const next = _.cloneDeep(variables || {});
    const current = next[CHAT_STATE_KEY] || { triggered: {} };
    current.triggered = current.triggered || {};
    current.triggered[stage] = true;
    current.lastStage = stage;
    next[CHAT_STATE_KEY] = current;
    return next;
  }, { type: 'chat' });
}

function extractStage(variables) {
  return _.get(variables, 'stat_data.剧情.当前阶段')
    ?? _.get(variables, '剧情.当前阶段')
    ?? null;
}

async function playStageEvent(stage, { force = false } = {}) {
  const event = STAGE_EVENTS[stage];
  if (!event) return;

  const chatRuntime = getChatRuntime();
  if (!force && chatRuntime.triggered?.[stage]) return;

  event.normal?.forEach((text, index) => {
    schedule(() => showNormalDanmaku(text), index * 850);
  });
  event.center?.forEach((text, index) => {
    schedule(() => showCenterDanmaku(text), index * 4400);
  });
  if (event.music) await startTrack(event.music, { restart: Boolean(event.restartMusic) });

  if (!force) markTriggered(stage);
}

function handleVariables(variables, { allowInitial = false } = {}) {
  const stage = extractStage(variables);
  if (!stage || stage === runtime.lastStage) return;
  runtime.lastStage = stage;

  if (!allowInitial && getChatRuntime().triggered?.[stage]) return;
  void playStageEvent(stage);
}

async function resetMediaTrigger() {
  try {
    await deleteVariable(CHAT_STATE_KEY, { type: 'chat' });
    runtime.lastStage = null;
    showCenterDanmaku('本聊天的媒体触发记录已重置');
  } catch (error) {
    console.error('[王权篇媒体] 重置媒体触发记录失败。', error);
  }
}

function executeButtonAction(name, source) {
  const now = Date.now();
  if (runtime.lastButtonAction?.name === name && now - runtime.lastButtonAction.at < 180) return;
  runtime.lastButtonAction = { name, at: now };
  console.info(`[王权篇媒体] 已处理测试按钮：${name}（${source}）`);

  switch (name) {
    case '测试右移弹幕':
      showNormalDanmaku('测试弹幕：从右向左穿过酒馆最上层');
      break;
    case '测试中央弹幕':
      showCenterDanmaku('测试弹幕：屏幕中央显示');
      break;
    case '测试音乐':
      void startTrack('dream_return', { restart: true });
      break;
    case '停止音乐':
      stopMusic();
      break;
    case '重置媒体触发':
      void resetMediaTrigger();
      break;
  }
}

function registerButtons() {
  const buttonNames = ['测试右移弹幕', '测试中央弹幕', '测试音乐', '停止音乐', '重置媒体触发'];

  for (const name of buttonNames) {
    try {
      const disposer = eventOn(getButtonEvent(name), () => executeButtonAction(name, '事件总线'));
      if (disposer?.stop) runtime.cleanupCallbacks.push(() => disposer.stop());
    } catch (error) {
      console.warn(`[王权篇媒体] 注册按钮事件失败，保留顶层点击兜底：${name}`, error);
    }
  }

  // 助手按钮位于宿主页面；捕获阶段先于 Vue 的 stopPropagation，可覆盖加载时序和事件总线异常。
  const clickHandler = (event) => {
    const button = event.target?.closest?.(`#script_container_${SCRIPT_ID} .qr--button`);
    const name = button?.textContent?.trim();
    if (buttonNames.includes(name)) executeButtonAction(name, '顶层点击兜底');
  };
  runtime.parentDocument.addEventListener('click', clickHandler, true);
  runtime.cleanupCallbacks.push(() => runtime.parentDocument.removeEventListener('click', clickHandler, true));
  console.info('[王权篇媒体] 弹幕层与测试按钮已就绪。');
}

async function initialize() {
  runtime.parentDocument = safeParentDocument();
  mountOverlay();
  mountAudioUnlockBridge();
  ensureAudioElement();
  registerButtons();
  runtime.configReady = readMediaConfig().then((config) => {
    runtime.config = config;
    return config;
  });
  await runtime.configReady;

  const mvu = await waitGlobalInitialized('Mvu');
  const mvuEvents = mvu?.events || window.Mvu?.events || MVU_EVENTS;
  eventOn(mvuEvents.VARIABLE_INITIALIZED || MVU_EVENTS.initialized, (variables) => handleVariables(variables, { allowInitial: true }));
  eventOn(mvuEvents.VARIABLE_UPDATE_ENDED || MVU_EVENTS.updateEnded, (variables) => handleVariables(variables));
  eventOn(tavern_events.CHAT_CHANGED, () => window.location.reload());

  try {
    const latestVariables = getVariables({ type: 'message', message_id: 'latest' });
    handleVariables(latestVariables, { allowInitial: true });
  } catch (error) {
    console.info('[王权篇媒体] 当前还没有可读取的消息变量，等待 MVU 初始化。', error);
  }
}

function cleanup() {
  clearFade();
  runtime.audioUnlockCleanup?.();
  runtime.timers.forEach((timer) => window.clearTimeout(timer));
  runtime.timers.clear();
  runtime.cleanupCallbacks.forEach((callback) => callback());
  runtime.cleanupCallbacks.length = 0;
  runtime.audio?.pause();
  runtime.parentDocument?.defaultView?.[AUDIO_UNLOCK_CLEANUP_KEY]?.();
  runtime.parentDocument?.getElementById(AUDIO_UNLOCK_BRIDGE_ID)?.remove();
  runtime.parentDocument?.getElementById(AUDIO_ID)?.remove();
  runtime.parentDocument?.getElementById(ROOT_ID)?.remove();
}

$(async () => {
  try {
    await initialize();
  } catch (error) {
    console.error('[王权篇媒体] 初始化失败。', error);
    toastr?.error?.('王权篇媒体控制器初始化失败，请查看控制台。');
  }
});

$(window).on('pagehide', cleanup);

export {};
