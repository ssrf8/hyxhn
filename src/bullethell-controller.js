// 狐妖小红娘·王权篇无尽剑幕试炼 v1.8.0
// v1.8.0: 移除游戏结束后的结果图楼层写入；插图改由王权剑凝聚剧情的主模型标记触发。
// v1.7.0: 死亡收尾不再显示暂停字幕；把短占位符写入对应新回复楼层，由卡内正则渲染结果图。
// v1.6.0: 将剑刃改为等宽长方形主体，仅在最前端短距离收束为剑尖。
// v1.5.0: 强化剑身实体轮廓、刃面渐变与中央剑脊，避免加色发光吞没剑刃。
// v1.4.0: 将圆形飞弹改绘为朝向飞行方向的发光剑形，碰撞半径保持不变。
// v1.3.0: 使用内嵌透明 WebP 角色图替换玩家光标，保留原有小判定点。
// v1.2.0: 移除小游戏背景音乐调用，保留碰撞、倒计时等本地音效。
// v1.1.0: 支持剧情链事件启动；游戏结束只关闭界面，不再发送结果或触发生成。
// v1.0.0: 全屏 Canvas 无尽躲弹幕、八条生命、死亡结果自动续写。
const SCRIPT_ID = 'b43d8e5a-29f2-4ba0-9b76-5ee381f3f6c7';
const BUTTON_NAME = '开始无尽剑幕试炼';
const ROOT_ID = 'hyxhn-bullethell-root';
const GLOBAL_API_KEY = '__HYXHN_BULLETHELL_API__';
const BULLETHELL_REQUEST_EVENT = 'hyxhn_wangquan_bullethell_requested';
const MAX_LIVES = 8;
const INVULNERABLE_SECONDS = 1.2;
const INITIAL_COUNTDOWN_SECONDS = 3;
const POST_THIRTY_LAYER_SECONDS = 12;
const MAX_FRAME_SECONDS = 1 / 30;
const MAX_EMITTER_CATCHUP = 4;
const BULLET_MARGIN = 72;
const PLAYER_SPRITE_DATA_URL = '__HYXHN_BULLETHELL_PLAYER_SPRITE_DATA_URL__';

function hostWindow() {
  try {
    if (window.parent && window.parent !== window && window.parent.document) return window.parent;
  } catch (_) {}
  return window;
}

function hostDocument() {
  try { return hostWindow().document || document; } catch (_) { return document; }
}

function makeResultId() {
  try { return hostWindow().crypto?.randomUUID?.() || crypto?.randomUUID?.(); } catch (_) {}
  return `hyxhn-bullethell-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function swordLayerAt(seconds) {
  if (seconds < 30) return 1;
  return Math.floor((seconds - 30) / POST_THIRTY_LAYER_SECONDS) + 2;
}

function speedScaleAt(seconds) {
  return 1 + 0.03 * (swordLayerAt(seconds) - 1);
}

function intervalScaleAt(seconds) {
  return Math.max(0.35, 1 - 0.04 * (swordLayerAt(seconds) - 1));
}

function unlockedLayerEmitterCount(seconds) {
  return seconds < 30 ? 0 : Math.floor((seconds - 30) / POST_THIRTY_LAYER_SECONDS) + 1;
}

const script = {
  version: '1.8.0',
  disposers: [],
  parentWindow: null,
  parentDocument: null,
  activeRun: null,
  lastButtonActionAt: 0,
  destroyed: false,
};

function safeInvoke(callback) {
  try { callback?.(); } catch (_) {}
}

function addDisposer(callback) {
  if (typeof callback === 'function') script.disposers.push(callback);
}

function createAudioEngine() {
  let context = null;
  try {
    const AudioContext = script.parentWindow?.AudioContext || script.parentWindow?.webkitAudioContext;
    if (AudioContext) context = new AudioContext();
  } catch (_) {}

  const tone = (frequency, duration = 0.08, volume = 0.035, type = 'sine', offset = 0) => {
    if (!context) return;
    try {
      if (context.state === 'suspended') void context.resume();
      const start = context.currentTime + offset;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch (_) {}
  };

  return {
    countdown(value) { tone(value === 1 ? 660 : 440, 0.11, 0.035, 'triangle'); },
    start() { tone(880, 0.09, 0.04, 'triangle'); tone(1320, 0.11, 0.035, 'sine', 0.08); },
    hit() { tone(150, 0.16, 0.055, 'sawtooth'); tone(90, 0.22, 0.035, 'square', 0.04); },
    death() { [420, 330, 240, 150].forEach((f, i) => tone(f, 0.22, 0.045, 'sawtooth', i * 0.11)); },
    close() { try { void context?.close?.(); } catch (_) {} context = null; },
  };
}

function createPlayerSprite(win) {
  try {
    const image = new win.Image();
    image.decoding = 'async';
    image.src = PLAYER_SPRITE_DATA_URL;
    return image;
  } catch (_) {
    return null;
  }
}

function createRun(request = {}) {
  const doc = script.parentDocument;
  const win = script.parentWindow;
  const root = doc.createElement('section');
  root.id = ROOT_ID;
  root.setAttribute('role', 'application');
  root.setAttribute('aria-label', '无尽剑幕试炼');

  const canvas = doc.createElement('canvas');
  canvas.className = 'hyxhn-bullethell-canvas';
  canvas.setAttribute('aria-label', '拖动以闪避王权剑气');

  const hud = doc.createElement('div');
  hud.className = 'hyxhn-bullethell-hud';
  const livesNode = doc.createElement('div');
  const timeNode = doc.createElement('div');
  const layerNode = doc.createElement('div');
  hud.append(livesNode, timeNode, layerNode);

  const status = doc.createElement('div');
  status.className = 'hyxhn-bullethell-status';
  status.setAttribute('aria-live', 'polite');

  const closeButton = doc.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'hyxhn-bullethell-close';
  closeButton.setAttribute('aria-label', '退出试炼');
  closeButton.textContent = '×';

  const style = doc.createElement('style');
  style.textContent = `
    #${ROOT_ID} { position:fixed; inset:0; width:100vw; width:100dvw; height:100vh; height:100dvh;
      z-index:2147483400; overflow:hidden; background:#02040a; color:#f7e7b8;
      font-family:"Microsoft YaHei","PingFang SC",sans-serif; touch-action:none; user-select:none;
      overscroll-behavior:none; isolation:isolate; }
    #${ROOT_ID} .hyxhn-bullethell-canvas { position:absolute; inset:0; width:100%; height:100%; display:block;
      touch-action:none; cursor:grab; }
    #${ROOT_ID} .hyxhn-bullethell-canvas:active { cursor:grabbing; }
    #${ROOT_ID} .hyxhn-bullethell-hud { position:absolute; z-index:3; top:max(14px, env(safe-area-inset-top));
      left:max(14px, env(safe-area-inset-left)); display:grid; gap:4px; padding:10px 14px;
      border:1px solid rgba(231,190,99,.34); border-radius:10px; background:rgba(4,6,12,.68);
      box-shadow:0 8px 30px rgba(0,0,0,.34); pointer-events:none; font-size:clamp(12px, 1.8vw, 16px); }
    #${ROOT_ID} .hyxhn-bullethell-status { position:absolute; z-index:3; left:50%; top:50%;
      transform:translate(-50%,-50%); min-width:min(78vw,520px); text-align:center; pointer-events:none;
      color:#fff0bf; font-family:"STKaiti","KaiTi",serif; font-size:clamp(28px,8vw,72px);
      font-weight:700; letter-spacing:.12em; text-shadow:0 0 12px #d8a340,0 4px 18px #000; }
    #${ROOT_ID} .hyxhn-bullethell-close { position:absolute; z-index:5; top:max(12px, env(safe-area-inset-top));
      right:max(12px, env(safe-area-inset-right)); width:48px; height:48px; border:1px solid rgba(236,201,128,.52);
      border-radius:50%; background:rgba(7,8,14,.72); color:#efd99f; font-size:28px; line-height:1;
      cursor:pointer; touch-action:manipulation; }
    #${ROOT_ID} .hyxhn-bullethell-confirm { position:absolute; z-index:8; inset:0; display:grid; place-items:center;
      padding:max(18px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right))
      max(18px, env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left)); background:rgba(1,2,7,.82); }
    #${ROOT_ID} .hyxhn-bullethell-confirm-panel { width:min(430px, calc(100vw - 36px)); padding:26px;
      border:1px solid rgba(231,190,99,.58); border-radius:16px; background:#090b13; text-align:center; }
    #${ROOT_ID} .hyxhn-bullethell-confirm-panel strong { display:block; margin-bottom:10px; font-size:21px; }
    #${ROOT_ID} .hyxhn-bullethell-confirm-panel p { color:#bdb6a7; line-height:1.6; }
    #${ROOT_ID} .hyxhn-bullethell-confirm-panel button { min-width:128px; min-height:44px; margin:6px;
      border:1px solid #c99b46; border-radius:999px; background:#17121a; color:#f5d993; cursor:pointer; }
    @media (max-width:450px) {
      #${ROOT_ID} .hyxhn-bullethell-hud { max-width:60vw; padding:8px 10px; }
      #${ROOT_ID} .hyxhn-bullethell-close { width:44px; height:44px; }
    }
    @media (prefers-reduced-motion:reduce) {
      #${ROOT_ID} .hyxhn-bullethell-status { text-shadow:0 2px 7px #000; }
    }
  `;

  root.append(style, canvas, hud, status, closeButton);
  doc.body.appendChild(root);

  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) throw new Error('当前浏览器无法创建 Canvas 2D');

  const run = {
    id: makeResultId(),
    root,
    canvas,
    ctx,
    livesNode,
    timeNode,
    layerNode,
    status,
    closeButton,
    width: 0,
    height: 0,
    dpr: 1,
    minDimension: 0,
    player: { x: 0, y: 0, radius: 4, visualRadius: 18, sprite: createPlayerSprite(win) },
    bullets: [],
    bulletPool: [],
    emitters: [],
    simTime: 0,
    countdown: INITIAL_COUNTDOWN_SECONDS,
    countdownAnnounced: INITIAL_COUNTDOWN_SECONDS + 1,
    mode: 'countdown',
    lives: MAX_LIVES,
    invulnerableUntil: -1,
    lastFrameAt: performance.now(),
    raf: 0,
    ended: false,
    finishing: false,
    pointerId: null,
    pointerX: 0,
    pointerY: 0,
    unlockedEmitters: 0,
    disposers: [],
    audio: createAudioEngine(),
    historyGuard: false,
    suppressPop: false,
    confirmNode: null,
    randomPhase: Math.random() * Math.PI * 2,
  };

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    run.disposers.push(() => target.removeEventListener(name, handler, options));
  }

  function resize() {
    const rect = root.getBoundingClientRect();
    const nextWidth = Math.max(1, rect.width || win.innerWidth || 1);
    const nextHeight = Math.max(1, rect.height || win.innerHeight || 1);
    const oldWidth = run.width || nextWidth;
    const oldHeight = run.height || nextHeight;
    const oldMin = run.minDimension || Math.min(nextWidth, nextHeight);
    const nextMin = Math.min(nextWidth, nextHeight);
    const sx = nextWidth / oldWidth;
    const sy = nextHeight / oldHeight;
    const sv = nextMin / oldMin;

    run.width = nextWidth;
    run.height = nextHeight;
    run.minDimension = nextMin;
    run.dpr = clamp(win.devicePixelRatio || 1, 1, 2);
    canvas.width = Math.round(nextWidth * run.dpr);
    canvas.height = Math.round(nextHeight * run.dpr);
    ctx.setTransform(run.dpr, 0, 0, run.dpr, 0, 0);

    run.player.x *= sx;
    run.player.y *= sy;
    run.player.radius = clamp(nextMin * 0.006, 3.2, 6.5);
    run.player.visualRadius = clamp(nextMin * 0.025, 14, 25);
    run.bullets.forEach((bullet) => {
      bullet.x *= sx;
      bullet.y *= sy;
      bullet.vx *= sv;
      bullet.vy *= sv;
      bullet.radius = clamp(nextMin * 0.009, 4.5, 9);
    });
    clampPlayer();
  }

  function clampPlayer() {
    const margin = run.player.visualRadius * 2.1 + 4;
    run.player.x = clamp(run.player.x || run.width / 2, margin, run.width - margin);
    run.player.y = clamp(run.player.y || run.height * 0.78, margin, run.height - margin);
  }

  function acquireBullet(x, y, vx, vy) {
    const bullet = run.bulletPool.pop() || {};
    bullet.x = x;
    bullet.y = y;
    bullet.vx = vx;
    bullet.vy = vy;
    bullet.radius = clamp(run.minDimension * 0.009, 4.5, 9);
    bullet.phase = Math.random() * Math.PI * 2;
    run.bullets.push(bullet);
  }

  function releaseBullet(index) {
    const [bullet] = run.bullets.splice(index, 1);
    if (bullet) run.bulletPool.push(bullet);
  }

  function bulletVelocity(angle, baseSpeed) {
    const speed = baseSpeed * speedScaleAt(run.simTime) * clamp(run.minDimension / 720, 0.7, 1.35);
    return { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
  }

  function shoot(x, y, angle, baseSpeed = 118) {
    const velocity = bulletVelocity(angle, baseSpeed);
    acquireBullet(x, y, velocity.vx, velocity.vy);
  }

  function aimAngle(x, y) {
    return Math.atan2(run.player.y - y, run.player.x - x);
  }

  function fireRain(emitter) {
    const x = Math.random() * run.width;
    shoot(x, -12, Math.PI / 2 + (Math.random() - 0.5) * 0.14, 105 + Math.random() * 28);
    emitter.phase += 0.17;
  }

  function fireAimedFan(count, spread, sourceX = Math.random() * run.width, sourceY = -12, speed = 112) {
    const center = aimAngle(sourceX, sourceY);
    for (let i = 0; i < count; i += 1) {
      const offset = count === 1 ? 0 : (i / (count - 1) - 0.5) * spread;
      shoot(sourceX, sourceY, center + offset, speed);
    }
  }

  function fireRing(emitter, count = 18, gapSize = 3, speed = 104) {
    const x = run.width * (0.28 + 0.44 * ((Math.sin(emitter.phase) + 1) / 2));
    const y = run.height * 0.17;
    const towardPlayer = aimAngle(x, y);
    const gapIndex = Math.round(((towardPlayer - emitter.phase + Math.PI * 4) % (Math.PI * 2)) / (Math.PI * 2) * count);
    for (let i = 0; i < count; i += 1) {
      const distance = Math.min((i - gapIndex + count) % count, (gapIndex - i + count) % count);
      if (distance <= Math.floor(gapSize / 2)) continue;
      shoot(x, y, emitter.phase + i / count * Math.PI * 2, speed);
    }
    emitter.phase += 0.23;
  }

  function fireCross(emitter) {
    const fromLeft = emitter.flip = !emitter.flip;
    const x = fromLeft ? -12 : run.width + 12;
    for (let i = 0; i < 7; i += 1) {
      const y = run.height * (0.12 + i * 0.12);
      const angle = fromLeft ? 0.22 : Math.PI - 0.22;
      shoot(x, y, angle, 126 + i * 2);
    }
  }

  function fireSpiral(emitter) {
    const x = run.width * (emitter.index % 2 === 0 ? 0.28 : 0.72);
    const y = run.height * 0.18;
    for (let i = 0; i < 8; i += 1) shoot(x, y, emitter.phase + i * Math.PI / 4, 108);
    emitter.phase += 0.31;
  }

  function fireCurtain(emitter) {
    const columns = clamp(Math.round(run.width / 44), 10, 28);
    const gapCenter = Math.round((Math.sin(emitter.phase) * 0.5 + 0.5) * (columns - 1));
    for (let i = 0; i < columns; i += 1) {
      if (Math.abs(i - gapCenter) <= 1) continue;
      shoot((i + 0.5) / columns * run.width, -12, Math.PI / 2, 116);
    }
    emitter.phase += 0.55;
  }

  function fireWideAim() {
    fireAimedFan(5, 0.72, Math.random() < 0.5 ? run.width * 0.18 : run.width * 0.82, -12, 128);
  }

  function fireExpandingRing(emitter) {
    fireRing(emitter, 24, 5, 119);
  }

  function fireEdgeSweep(emitter) {
    emitter.flip = !emitter.flip;
    const fromLeft = emitter.flip;
    const x = fromLeft ? -12 : run.width + 12;
    for (let i = 0; i < 10; i += 1) {
      const y = run.height * (0.05 + i * 0.095);
      const angle = fromLeft ? -0.02 + i * 0.018 : Math.PI + 0.02 - i * 0.018;
      shoot(x, y, angle, 138);
    }
  }

  const layerKinds = ['cross', 'spiral', 'curtain', 'wideAim', 'expandingRing', 'edgeSweep'];
  const layerIntervals = { cross: 1.55, spiral: 1.35, curtain: 2.25, wideAim: 1.2, expandingRing: 2.1, edgeSweep: 1.8 };

  function addEmitter(kind, activeFrom, baseInterval, index = 0) {
    run.emitters.push({ kind, activeFrom, baseInterval, nextFire: activeFrom + 0.15, phase: run.randomPhase + index * 0.73, index, flip: false });
  }

  function unlockEmitters() {
    const target = unlockedLayerEmitterCount(run.simTime);
    while (run.unlockedEmitters < target) {
      const index = run.unlockedEmitters;
      const kind = layerKinds[index % layerKinds.length];
      addEmitter(kind, 30 + index * POST_THIRTY_LAYER_SECONDS, layerIntervals[kind], index);
      run.unlockedEmitters += 1;
    }
  }

  function fireEmitter(emitter) {
    switch (emitter.kind) {
      case 'rain': fireRain(emitter); break;
      case 'aimed3': fireAimedFan(3, 0.36); break;
      case 'ring': fireRing(emitter); break;
      case 'cross': fireCross(emitter); break;
      case 'spiral': fireSpiral(emitter); break;
      case 'curtain': fireCurtain(emitter); break;
      case 'wideAim': fireWideAim(emitter); break;
      case 'expandingRing': fireExpandingRing(emitter); break;
      case 'edgeSweep': fireEdgeSweep(emitter); break;
    }
  }

  function updateEmitters() {
    unlockEmitters();
    const intervalScale = intervalScaleAt(run.simTime);
    for (const emitter of run.emitters) {
      if (run.simTime < emitter.activeFrom) continue;
      let catchup = 0;
      while (run.simTime >= emitter.nextFire && catchup < MAX_EMITTER_CATCHUP) {
        fireEmitter(emitter);
        emitter.nextFire += emitter.baseInterval * intervalScale;
        catchup += 1;
      }
      if (catchup === MAX_EMITTER_CATCHUP && run.simTime >= emitter.nextFire) {
        emitter.nextFire = run.simTime + emitter.baseInterval * intervalScale;
      }
    }
  }

  function collideBullet(bullet) {
    const dx = bullet.x - run.player.x;
    const dy = bullet.y - run.player.y;
    const radius = bullet.radius + run.player.radius;
    return dx * dx + dy * dy <= radius * radius;
  }

  function takeHit() {
    if (run.simTime < run.invulnerableUntil || run.finishing) return;
    run.lives -= 1;
    run.invulnerableUntil = run.simTime + INVULNERABLE_SECONDS;
    run.audio.hit();
    root.animate?.([
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.8) saturate(.5)' },
      { filter: 'brightness(1)' },
    ], { duration: 260, easing: 'ease-out' });
    if (run.lives <= 0) void finishDeath();
  }

  function updateBullets(dt) {
    for (let i = run.bullets.length - 1; i >= 0; i -= 1) {
      const bullet = run.bullets[i];
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.phase += dt * 5;
      if (bullet.x < -BULLET_MARGIN || bullet.x > run.width + BULLET_MARGIN || bullet.y < -BULLET_MARGIN || bullet.y > run.height + BULLET_MARGIN) {
        releaseBullet(i);
        continue;
      }
      if (run.simTime >= run.invulnerableUntil && collideBullet(bullet)) takeHit();
    }
  }

  function drawBackground() {
    const gradient = ctx.createRadialGradient(run.width * 0.5, run.height * 0.45, 0, run.width * 0.5, run.height * 0.5, Math.max(run.width, run.height) * 0.75);
    gradient.addColorStop(0, '#12131b');
    gradient.addColorStop(0.45, '#070912');
    gradient.addColorStop(1, '#010208');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, run.width, run.height);

    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#d7b466';
    ctx.lineWidth = 1;
    const spacing = clamp(run.minDimension / 13, 34, 64);
    for (let x = -run.height; x < run.width + run.height; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - run.height * 0.35, run.height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBullets() {
    ctx.save();
    for (const bullet of run.bullets) {
      const radius = bullet.radius;
      const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
      const ux = bullet.vx / speed;
      const uy = bullet.vy / speed;
      const nx = -uy;
      const ny = ux;
      const point = (along, across = 0) => ({
        x: bullet.x + ux * along + nx * across,
        y: bullet.y + uy * along + ny * across,
      });
      const tip = point(radius * 3.25);
      const tipShoulderLeft = point(radius * 2.45, radius * 0.68);
      const tipShoulderRight = point(radius * 2.45, -radius * 0.68);
      const bladeBase = point(-radius * 0.48);
      const bladeLeft = point(-radius * 0.48, radius * 0.68);
      const bladeRight = point(-radius * 0.48, -radius * 0.68);
      const guardCenter = point(-radius * 0.72);
      const guardLeft = point(-radius * 0.72, radius * 1.16);
      const guardRight = point(-radius * 0.72, -radius * 1.16);
      const gripEnd = point(-radius * 1.72);
      const pommel = point(-radius * 2.02);
      const trailEnd = point(-radius * 4.1);

      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = '#e8ad3e';
      ctx.shadowBlur = radius * 1.35;
      ctx.strokeStyle = 'rgba(215,150,43,.32)';
      ctx.lineWidth = Math.max(1, radius * 0.42);
      ctx.beginPath();
      ctx.moveTo(trailEnd.x, trailEnd.y);
      ctx.lineTo(gripEnd.x, gripEnd.y);
      ctx.stroke();

      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowColor = 'rgba(232,173,62,.7)';
      ctx.shadowBlur = radius * 0.85;
      const bladeGradient = ctx.createLinearGradient(bladeLeft.x, bladeLeft.y, bladeRight.x, bladeRight.y);
      bladeGradient.addColorStop(0, '#a96618');
      bladeGradient.addColorStop(0.28, '#f1bd4d');
      bladeGradient.addColorStop(0.52, '#fffbe1');
      bladeGradient.addColorStop(0.76, '#e7a934');
      bladeGradient.addColorStop(1, '#7b4611');
      ctx.fillStyle = bladeGradient;
      ctx.strokeStyle = '#4a2a0d';
      ctx.lineWidth = Math.max(1.2, radius * 0.3);
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(tipShoulderLeft.x, tipShoulderLeft.y);
      ctx.lineTo(bladeLeft.x, bladeLeft.y);
      ctx.lineTo(bladeRight.x, bladeRight.y);
      ctx.lineTo(tipShoulderRight.x, tipShoulderRight.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,238,.92)';
      ctx.lineWidth = Math.max(0.8, radius * 0.16);
      ctx.beginPath();
      ctx.moveTo(bladeBase.x, bladeBase.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255,240,177,.72)';
      ctx.lineWidth = Math.max(0.7, radius * 0.12);
      ctx.beginPath();
      ctx.moveTo(bladeLeft.x, bladeLeft.y);
      ctx.lineTo(tipShoulderLeft.x, tipShoulderLeft.y);
      ctx.moveTo(bladeRight.x, bladeRight.y);
      ctx.lineTo(tipShoulderRight.x, tipShoulderRight.y);
      ctx.stroke();

      ctx.strokeStyle = '#4a2a0d';
      ctx.lineWidth = Math.max(2.4, radius * 0.62);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(guardLeft.x, guardLeft.y);
      ctx.lineTo(guardRight.x, guardRight.y);
      ctx.moveTo(guardCenter.x, guardCenter.y);
      ctx.lineTo(gripEnd.x, gripEnd.y);
      ctx.stroke();

      ctx.strokeStyle = '#ffd878';
      ctx.lineWidth = Math.max(1.2, radius * 0.27);
      ctx.beginPath();
      ctx.moveTo(guardLeft.x, guardLeft.y);
      ctx.lineTo(guardRight.x, guardRight.y);
      ctx.moveTo(guardCenter.x, guardCenter.y);
      ctx.lineTo(gripEnd.x, gripEnd.y);
      ctx.stroke();

      ctx.fillStyle = '#4a2a0d';
      ctx.beginPath();
      ctx.arc(pommel.x, pommel.y, Math.max(1.8, radius * 0.42), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe6a0';
      ctx.beginPath();
      ctx.arc(pommel.x, pommel.y, Math.max(0.9, radius * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPlayer() {
    const invulnerable = run.simTime < run.invulnerableUntil;
    const { x, y, visualRadius, radius, sprite } = run.player;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = invulnerable && Math.floor(run.simTime * 12) % 2 === 0 ? 0.32 : 1;
    ctx.shadowColor = '#f4c96a';
    ctx.shadowBlur = visualRadius * 0.9;
    if (sprite?.complete && sprite.naturalWidth > 0 && sprite.naturalHeight > 0) {
      const displayHeight = visualRadius * 4;
      const displayWidth = displayHeight * (sprite.naturalWidth / sprite.naturalHeight);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sprite, -displayWidth / 2, -displayHeight / 2, displayWidth, displayHeight);
    } else {
      ctx.fillStyle = '#f4d68a';
      ctx.beginPath();
      ctx.arc(0, 0, visualRadius * 0.72, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = invulnerable && Math.floor(run.simTime * 12) % 2 === 0 ? 0.48 : 1;
    ctx.globalCompositeOperation = 'lighter';
    ctx.shadowBlur = visualRadius * 0.7;
    ctx.fillStyle = '#fffbea';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function updateHud() {
    livesNode.textContent = `命灯 ${'◆'.repeat(Math.max(0, run.lives))}${'◇'.repeat(Math.max(0, MAX_LIVES - run.lives))}`;
    timeNode.textContent = `存续 ${run.simTime.toFixed(1)} 秒`;
    layerNode.textContent = `剑幕 第 ${swordLayerAt(run.simTime)} 重 · 弹体 ${run.bullets.length}`;
  }

  function render() {
    drawBackground();
    drawBullets();
    drawPlayer();
    updateHud();
  }

  function teardownRun() {
    if (run.ended) return;
    run.ended = true;
    if (run.raf) win.cancelAnimationFrame(run.raf);
    run.disposers.splice(0).reverse().forEach(safeInvoke);
    if (run.pointerId !== null) safeInvoke(() => canvas.releasePointerCapture(run.pointerId));
    run.audio.close();
    run.confirmNode?.remove();
    root.remove();
    if (script.activeRun === run) script.activeRun = null;
    if (run.historyGuard) {
      run.suppressPop = true;
      safeInvoke(() => win.history.back());
      run.historyGuard = false;
    }
  }

  function showExitConfirm({ fromHistory = false } = {}) {
    if (run.ended || run.confirmNode) return;
    const previousMode = run.mode;
    run.mode = 'paused';
    const layer = doc.createElement('div');
    layer.className = 'hyxhn-bullethell-confirm';
    const panel = doc.createElement('div');
    panel.className = 'hyxhn-bullethell-confirm-panel';
    const title = doc.createElement('strong');
    title.textContent = '要中止这场试炼吗？';
    const copy = doc.createElement('p');
    copy.textContent = '退出后不会发送消息，也不会推进剧情。';
    const continueButton = doc.createElement('button');
    continueButton.type = 'button';
    continueButton.textContent = '继续试炼';
    const exitButton = doc.createElement('button');
    exitButton.type = 'button';
    exitButton.textContent = '确认退出';
    panel.append(title, copy, continueButton, exitButton);
    layer.appendChild(panel);
    root.appendChild(layer);
    run.confirmNode = layer;

    continueButton.addEventListener('click', () => {
      layer.remove();
      run.confirmNode = null;
      run.countdown = INITIAL_COUNTDOWN_SECONDS;
      run.countdownAnnounced = INITIAL_COUNTDOWN_SECONDS + 1;
      run.mode = previousMode === 'countdown' ? 'countdown' : 'countdown';
      run.lastFrameAt = performance.now();
      if (fromHistory && !run.historyGuard) {
        safeInvoke(() => win.history.pushState({ hyxhnBullethell: run.id }, '', win.location.href));
        run.historyGuard = true;
      }
    });
    exitButton.addEventListener('click', () => teardownRun());
  }

  async function finishDeath() {
    if (run.finishing || run.ended) return;
    run.finishing = true;
    run.mode = 'finishing';
    status.textContent = '';
    run.audio.death();
    render();
    await new Promise((resolve) => win.setTimeout(resolve, 420));
    teardownRun();
  }

  function countdownStep(dt) {
    run.countdown -= dt;
    const number = Math.max(1, Math.ceil(run.countdown));
    if (number < run.countdownAnnounced) {
      run.countdownAnnounced = number;
      run.audio.countdown(number);
    }
    status.textContent = run.countdown > 0 ? String(number) : '剑幕开';
    if (run.countdown <= 0) {
      run.mode = 'running';
      run.countdown = 0;
      run.lastFrameAt = performance.now();
      run.audio.start();
      win.setTimeout(() => { if (!run.ended && run.mode === 'running') status.textContent = ''; }, 520);
    }
  }

  function frame(now) {
    if (run.ended) return;
    const rawDt = Math.max(0, (now - run.lastFrameAt) / 1000);
    run.lastFrameAt = now;
    const dt = Math.min(rawDt, MAX_FRAME_SECONDS);

    if (run.mode === 'countdown') countdownStep(dt);
    else if (run.mode === 'running') {
      run.simTime += dt;
      updateEmitters();
      updateBullets(dt);
    } else if (run.mode === 'paused' && !run.confirmNode) {
      status.textContent = '试炼暂停';
    }

    render();
    run.raf = win.requestAnimationFrame(frame);
  }

  function pauseForVisibility() {
    if (run.ended || run.confirmNode || run.mode === 'paused') return;
    run.mode = 'paused';
    run.pointerId = null;
    status.textContent = '试炼暂停';
  }

  function resumeFromVisibility() {
    if (run.ended || run.confirmNode || doc.visibilityState === 'hidden') return;
    if (run.mode !== 'paused') return;
    run.countdown = INITIAL_COUNTDOWN_SECONDS;
    run.countdownAnnounced = INITIAL_COUNTDOWN_SECONDS + 1;
    run.mode = 'countdown';
    run.lastFrameAt = performance.now();
  }

  function pointerDown(event) {
    if (run.ended || run.confirmNode || run.pointerId !== null) return;
    event.preventDefault();
    event.stopPropagation();
    run.pointerId = event.pointerId;
    run.pointerX = event.clientX;
    run.pointerY = event.clientY;
    safeInvoke(() => canvas.setPointerCapture(event.pointerId));
  }

  function pointerMove(event) {
    if (event.pointerId !== run.pointerId || run.ended || run.confirmNode) return;
    event.preventDefault();
    event.stopPropagation();
    const dx = event.clientX - run.pointerX;
    const dy = event.clientY - run.pointerY;
    run.pointerX = event.clientX;
    run.pointerY = event.clientY;
    run.player.x += dx;
    run.player.y += dy;
    clampPlayer();
  }

  function pointerUp(event) {
    if (event.pointerId !== run.pointerId) return;
    event.preventDefault();
    event.stopPropagation();
    safeInvoke(() => canvas.releasePointerCapture(event.pointerId));
    run.pointerId = null;
  }

  function keydown(event) {
    if (event.key !== 'Escape' || run.ended) return;
    event.preventDefault();
    event.stopPropagation();
    showExitConfirm();
  }

  function popstate() {
    if (run.suppressPop) { run.suppressPop = false; return; }
    if (run.ended) return;
    run.historyGuard = false;
    showExitConfirm({ fromHistory: true });
  }

  addEmitter('rain', 0, 0.62);
  addEmitter('aimed3', 10, 1.8);
  addEmitter('ring', 20, 2.5);

  run.player.x = run.width / 2;
  run.player.y = run.height * 0.78;
  resize();
  run.player.x = run.width / 2;
  run.player.y = run.height * 0.78;
  clampPlayer();

  listen(canvas, 'pointerdown', pointerDown, { passive: false });
  listen(canvas, 'pointermove', pointerMove, { passive: false });
  listen(canvas, 'pointerup', pointerUp, { passive: false });
  listen(canvas, 'pointercancel', pointerUp, { passive: false });
  listen(closeButton, 'click', () => showExitConfirm());
  listen(win, 'keydown', keydown, true);
  listen(win, 'blur', pauseForVisibility);
  listen(win, 'focus', resumeFromVisibility);
  listen(doc, 'visibilitychange', () => doc.visibilityState === 'hidden' ? pauseForVisibility() : resumeFromVisibility());
  listen(win, 'resize', resize);
  listen(win, 'orientationchange', () => win.setTimeout(resize, 300));
  listen(win, 'popstate', popstate);

  safeInvoke(() => {
    win.history.pushState({ hyxhnBullethell: run.id }, '', win.location.href);
    run.historyGuard = true;
  });
  run.raf = win.requestAnimationFrame(frame);
  return { run, teardownRun };
}

function startGame(request = {}) {
  if (script.activeRun && !script.activeRun.ended) {
    toastr?.info?.('无尽剑幕试炼已经在进行。');
    return;
  }
  try {
    const { run } = createRun(request);
    script.activeRun = run;
    if (request?.source === 'post_choice_chain') {
      console.info(`[无尽剑幕] 已由拔剑路线 ${request.choice || '未知'} 的后续玩家消息触发。`);
    }
  } catch (error) {
    console.error('[无尽剑幕] 启动失败。', error);
    toastr?.error?.(`无尽剑幕启动失败：${error?.message || error}`);
  }
}

function handleButtonAction() {
  const now = Date.now();
  if (now - script.lastButtonActionAt < 180) return;
  script.lastButtonActionAt = now;
  startGame();
}

function registerButton() {
  try {
    const disposer = eventOn(getButtonEvent(BUTTON_NAME), handleButtonAction);
    if (disposer?.stop) addDisposer(() => disposer.stop());
  } catch (error) {
    console.warn('[无尽剑幕] 按钮事件总线注册失败，保留顶层点击兜底。', error);
  }

  const clickHandler = (event) => {
    const button = event.target?.closest?.(`#script_container_${SCRIPT_ID} .qr--button`);
    if (button?.textContent?.trim() === BUTTON_NAME) handleButtonAction();
  };
  script.parentDocument.addEventListener('click', clickHandler, true);
  addDisposer(() => script.parentDocument?.removeEventListener('click', clickHandler, true));
}

function exposeApi() {
  const api = {
    version: script.version,
    start: startGame,
    isActive: () => Boolean(script.activeRun && !script.activeRun.ended),
    destroy,
  };
  window[GLOBAL_API_KEY] = api;
  try { script.parentWindow[GLOBAL_API_KEY] = api; } catch (_) {}
  try { if (typeof initializeGlobal === 'function') initializeGlobal(GLOBAL_API_KEY, api); } catch (_) {}
  script.api = api;
}

function destroy() {
  if (script.destroyed) return;
  script.destroyed = true;
  const run = script.activeRun;
  if (run && !run.ended) {
    if (run.raf) script.parentWindow?.cancelAnimationFrame?.(run.raf);
    run.disposers?.splice(0).reverse().forEach(safeInvoke);
    run.audio?.close?.();
    run.root?.remove?.();
    run.ended = true;
    if (run.historyGuard) {
      run.suppressPop = true;
      safeInvoke(() => script.parentWindow?.history?.back?.());
    }
  }
  script.activeRun = null;
  script.disposers.splice(0).reverse().forEach(safeInvoke);
  try { if (window[GLOBAL_API_KEY] === script.api) delete window[GLOBAL_API_KEY]; } catch (_) {}
  try { if (script.parentWindow?.[GLOBAL_API_KEY] === script.api) delete script.parentWindow[GLOBAL_API_KEY]; } catch (_) {}
}

async function initialize() {
  script.parentWindow = hostWindow();
  script.parentDocument = hostDocument();

  const previous = script.parentWindow?.[GLOBAL_API_KEY] || window[GLOBAL_API_KEY];
  if (previous?.destroy) safeInvoke(() => previous.destroy());

  script.parentDocument.getElementById(ROOT_ID)?.remove();
  registerButton();
  exposeApi();

  if (typeof eventOn === 'function') {
    const requestDisposer = eventOn(BULLETHELL_REQUEST_EVENT, (request) => startGame(request));
    if (requestDisposer?.stop) addDisposer(() => requestDisposer.stop());
  }

  if (typeof eventOn === 'function' && window.tavern_events?.CHAT_CHANGED) {
    const disposer = eventOn(tavern_events.CHAT_CHANGED, () => {
      const run = script.activeRun;
      if (run && !run.ended) {
        run.ended = true;
        if (run.raf) script.parentWindow?.cancelAnimationFrame?.(run.raf);
        run.disposers?.splice(0).reverse().forEach(safeInvoke);
        run.audio?.close?.();
        run.root?.remove?.();
        script.activeRun = null;
      }
      script.parentWindow?.setTimeout?.(() => window.location.reload(), 0);
    });
    if (disposer?.stop) addDisposer(() => disposer.stop());
  }
  console.info('[无尽剑幕] 试炼脚本已就绪。');
}

$(async () => {
  try { await initialize(); }
  catch (error) {
    console.error('[无尽剑幕] 初始化失败。', error);
    toastr?.error?.('无尽剑幕脚本初始化失败，请查看控制台。');
  }
});

$(window).on('pagehide', destroy);

export {};
