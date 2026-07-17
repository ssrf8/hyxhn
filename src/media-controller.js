// 狐妖小红娘·王权篇顶层弹幕、音乐与拔剑抉择控制器 v2.27.0
// v2.27.0: 弹幕海 BGM 强制单次播放；音频自然结束时立即停止弹幕海并清理音乐状态。
// v2.26.0: 弹幕海按对应生成请求生命周期收尾；正常、空返回、HTTP 错误、异常与中止都会停止视听效果。
// v2.25.0: 支持直接播放媒体配置脚本内嵌的音频 data URL，不再依赖外部资源地址。
// v2.24.0: 恢复 12–17px 滚动字号，每批固定发射 40 条并以安全间隔提高总体密度。
// v2.23.0: 将滚动瀑布提升为超密模式，进一步缩小字号、增加批量并缩短发射间隔。
// v2.22.0: 缩小瀑布滚动弹幕字号并提高批量、频率与同屏密度，中央弹幕保持不变。
// v2.21.0: 增加执剑夺权与携瞳远走两条自由主线阶段路由。
// v2.20.0: 增加不信任后的关系修复与拒绝后的独立前路阶段路由。
// v2.19.0: 对齐黄风城、主殿决裂、12580 真相与龙湾前路的十三阶段路由。
// v2.18.0: 首次蛛丝画改为误判斩丝后显露花朵与山外视角的王权家全景织锦。
// v2.17.0: 拔剑联动弹幕瀑布与 BGM 不再按固定时长结束，只在对应正常回复落地后停止。
// v2.16.0: 拔剑联动状态改由按聊天分桶的脚本变量持久化，避免额外模型解析覆盖聊天变量后中断弹幕与小游戏链路。
// v2.15.0: 移除脚本对剧情阶段的写回纠正，变量推进完全交给 MVU 额外解析模型。
// v2.14.0: 弃剑与持剑救人均先挥剑斩断清瞳身上的捆妖索，再按是否留剑分流。
// v2.13.0: 移除持剑路线地下城肉鸽；持剑救走清瞳不再触发后续小游戏。
// v2.12.0: 按拔剑选择分流后续游戏：弃剑启动无尽剑幕，持剑启动单次无限肉鸽。
// v2.11.0: 两条救人选项均明确抱起清瞳走出大殿，弃剑与持剑只保留是否携剑的差异。
// v2.10.0: 对齐吊树夜探剧情，清瞳以人形解绳失败后再为{{user}}绘出外界。
// v2.9.0: 在 MVU 写入楼层前校验大殿三项硬证据，纠正模型把已达标剧情错误保留在 03 的情况。
// v2.8.0: 弹幕联动回复落地后，弃剑/持剑路线在玩家下一次发送时请求启动无尽剑幕。
// v2.7.0: 将拔剑选项作为结构化聊天变量持久化，并公开查询 API 与跨脚本选择事件。
// v2.6.0: 拔剑回复落地后继续等待玩家下一次发送，再联动五秒弹幕瀑布与音乐测试。
// v2.5.0: 此去无归达标后延迟至玩家下一次发送；捕获并取消原发送，再由拔剑三选一消息代替。
// v2.4.1: 增加 autoStageDanmaku 配置开关，默认关闭剧情阶段自动弹幕，保留手动测试、音乐与拔剑交互。
// v2.4.0: 向同卡常驻脚本公开可复用的音乐状态、播放与停止接口。
// v2.3.5: 滚动弹幕纵向轨道扩展至完整视口，消除顶部和底部留白。
// v2.3.4: 提亮黄色、压深绿色、增加白色弹幕，中央偏移进一步收窄并加入黑色字缘。
// v2.3.3: 再提高字体本体明度，移除彩色外发光，仅保留黑色可读性描边。
// v2.3.2: 小幅回提瀑布明度，并收窄中央弹幕版心及横向随机偏移。
// v2.3.1: 保留高饱和实色，降低弹幕明度与辉光，避免瀑布测试过度刺眼。
// v2.3.0: 瀑布中央弹幕改为随机最大间隙填充，显著提高发射速度并换用高饱和色板。
// v2.2.2: 移除瀑布节点上限，中央弹幕按实际行高从顶到底密铺，测试文本统一为指定台词。
// v2.2.1: 提高弹幕瀑布密度，中央弹幕改为紧密行距循环覆写并让新弹幕压住旧弹幕。
// v2.2.0: 弹幕增加随机七色、中央无动画避让排版与可开关的全屏弹幕瀑布测试。
// v2.1.0: 重绘“此去无归”拔剑窗口，嵌入压缩王权剑图标并加入八段进度旋转反馈。
// v2.0.1: 校正前期剧情弹幕，使其遵循送信、疗伤、蛛丝绘景、放妖与吊树夜探的时间线。
// v2.0.0: 新增“此去无归”八次拔剑交互、思考弹幕与三路线自动发送。
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
const DECISION_MODAL_ID = 'hyxhn-wangquan-decision-modal';
const AUDIO_UNLOCK_CLEANUP_KEY = '__HYXHN_WANGQUAN_AUDIO_UNLOCK_CLEANUP__';
const MEDIA_API_GLOBAL_KEY = '__HYXHN_WANGQUAN_MEDIA_API__';
const DECISION_SELECTED_EVENT = 'hyxhn_wangquan_decision_selected';
const BULLETHELL_REQUEST_EVENT = 'hyxhn_wangquan_bullethell_requested';
const CHAT_STATE_KEY = 'hyxhn_media_runtime';
const DECISION_STATE_STORE_KEY = 'decisionByChat';
const MEDIA_CONFIG_GLOBAL_KEY = '__HYXHN_WANGQUAN_MEDIA_CONFIG__';
const DECISION_STAGE = '07_决裂_此去无归';
const DECISION_REQUIRED_CLICKS = 8;
const POST_CHOICE_REQUEST_TIMEOUT_MS = 300000;
const POST_CHOICE_GAMES = Object.freeze({
  弃剑: Object.freeze({ kind: 'bullethell', label: '无尽剑幕', event: BULLETHELL_REQUEST_EVENT }),
});
const DECISION_SWORD_ICON_DATA_URL = '__HYXHN_SWORD_ICON_DATA_URL__';

const DANMAKU_COLORS = Object.freeze([
  { color: '#f2d400', glow: 'rgba(242, 212, 0, .72)' },
  { color: '#cf1717', glow: 'rgba(207, 23, 23, .72)' },
  { color: '#0759c7', glow: 'rgba(7, 89, 199, .72)' },
  { color: '#009ab8', glow: 'rgba(0, 154, 184, .72)' },
  { color: '#007a32', glow: 'rgba(0, 122, 50, .72)' },
  { color: '#ca187f', glow: 'rgba(202, 24, 127, .72)' },
  { color: '#7414bd', glow: 'rgba(116, 20, 189, .72)' },
  { color: '#f2f2f2', glow: 'rgba(242, 242, 242, .72)' },
]);

const WATERFALL_TEXT = '如果我们能活着出去的话，万水千山，你愿意陪我一起看吗?';

const DECISION_THOUGHTS = Object.freeze([
  '人和妖……真的不能和平相处吗？',
  '父亲说的，就一定是对的吗？',
  '如果服从，我还是我吗？',
  '她也会疼，也会害怕。',
  '这把剑，是为了杀妖，还是为了守护？',
  '我挥出的每一剑，都只能由别人决定吗？',
  '若连眼前的人都救不了，力量又有什么意义？',
  '这一次……我要自己选择。',
]);

const DECISION_CHOICES = Object.freeze({
  kill: {
    label: '杀掉清瞳',
    hint: '服从父命，斩断最后的自我',
    value: '杀掉清瞳',
    message: '我拔出王权剑，亲手杀死被缚的清瞳，选择服从父命。就让这一剑连同我仅存的情感、自我与自主思考一起斩断。',
  },
  abandon: {
    label: '弃剑',
    hint: '拒绝父命，以血肉面对山庄万剑',
    value: '弃剑',
    message: '我挥出王权剑，剑锋只斩断清瞳身上的捆妖索，没有伤她分毫。随后我将王权剑弃在父亲面前，俯身抱起清瞳，带着她向大殿外走去。我拒绝杀死她，哪怕走出殿门后要以血肉之躯面对整座山庄的万剑。',
  },
  rescue: {
    label: '持剑抱起清瞳',
    hint: '保留王权剑，亲手破开归路',
    value: '持剑救走清瞳',
    message: '我挥出王权剑，剑锋只斩断清瞳身上的捆妖索，没有伤她分毫。我没有弃剑，而是继续握住王权剑，俯身抱起清瞳，带着她向大殿外走去。我决定在走出殿门后，以自己的剑破开归路，带她离开。',
  },
});

const MVU_EVENTS = {
  initialized: 'mag_variable_initiailized',
  updateEnded: 'mag_variable_update_ended',
};

const STAGE_EVENTS = Object.freeze({
  '00_序章_道门兵人': {
    normal: ['王权山庄，戒律森严', '他被称作王权家最锋利的剑'],
  },
  '01_任务_蛛网疑影': {
    normal: ['一封被逼送来的信，将清瞳带到他面前', '他没有挥剑，反而替她处理了伤口'],
  },
  '02_初遇_笼中清瞳': {
    music: 'dream_return',
    normal: ['一剑斩断半幅蛛丝，回首才看见花与王权家的全景', '以后，让我成为你的眼睛吧'],
  },
  '03_黄风_怒火迷城': {
    normal: ['鹿妖临死前的清明，像一道刺进旧认知的光', '她终于织出了不愿让他看见的尸山血海'],
  },
  '04_黄风_红线家法': {
    normal: ['剑锋不再追逐性命，而是斩向操纵仇恨的红线', '树下无言一面，是两位表兄弟第一次相见'],
    center: ['他们只看见他放走妖怪，却看不见剑下断开的线'],
  },
  '05_黄风_一剑开天': {
    normal: ['一剑开天，所斩并非群妖', '黄风城下，一人一剑止住两方杀意'],
    center: ['剑若只知杀戮，又凭什么称为道'],
  },
  '06_分岔_执剑夺权': {
    normal: ['王权剑既是兵刃，也是王权家主导权的象征', '最强的兵器开始决定由谁握住剑柄'],
    center: ['赢下一剑不等于赢得所有人的服从'],
  },
  '06_分岔_携瞳远走': {
    normal: ['在秘密败露之前，他们先一步走出了山庄', '从今往后，救谁与去哪里都由自己决定'],
    center: ['这不是逃离一段关系，而是两个人共同上路'],
  },
  '06_败露_主殿杀令': {
    normal: ['她只被绳索缚在殿中，王权剑已落到他面前', '父命只剩一句：拔剑，杀了她'],
  },
  '07_决裂_此去无归': {
    normal: ['王权剑落在身前', '这一剑拔出之后，此去无归'],
  },
  '08_尾声_万水千山': {
    normal: ['这一次，选择不再由家族替他作出'],
    center: ['若能走出这里，便一起去看万水千山'],
  },
  '08_结局_无心之剑': {
    normal: ['他终于成为了王权家最完美的剑'],
    center: ['剑仍有锋芒，执剑之人却已不在'],
  },
  '09_深山_代号一二五八零': {
    normal: ['主人。代号一二五八零。两个词撕开了隐居后的平静', '最锋利的那一击，没有落在身上'],
  },
  '10_再起_王权在手': {
    normal: ['用不着，我信你', '只要我王权在手，无人可伤我们分毫'],
    center: ['王权从来不只是一把被家族握住的剑'],
  },
  '11_余波_关系修复': {
    normal: ['没有形成的剑意，由东方月初接下了眼前杀招', '救离险境不等于裂痕已经愈合'],
    center: ['信任不能被迫，只能重新建立'],
  },
  '11_分途_独立前路': {
    normal: ['从此独行天下，或回到山庄承受家法', '离开一段关系之后，路仍要由自己选择'],
  },
  '11_前路_龙湾之约': {
    normal: ['伤势会慢慢痊愈，道路也终于由自己选择', '山外下一程，通向龙湾'],
  },
});

const runtime = {
  parentDocument: null,
  overlay: null,
  audio: null,
  config: null,
  configReady: null,
  lastStage: null,
  lastDecision: null,
  decisionDemoMode: false,
  lastButtonAction: null,
  currentTrack: null,
  pendingPlayback: false,
  audioUnlockCleanup: null,
  fadeTimer: null,
  waterfallActive: false,
  waterfallTimers: new Set(),
  waterfallCenterSerial: 0,
  lastDanmakuColor: -1,
  postChoiceRequestActive: false,
  postChoiceRequestMessageId: null,
  postChoiceRequestWatchdog: null,
  timers: new Set(),
  cleanupCallbacks: [],
};
let mediaApi = null;

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
  root.setAttribute('role', 'presentation');

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
    #${ROOT_ID} #${DECISION_MODAL_ID} {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: clamp(14px, 4vw, 42px);
      pointer-events: auto;
      background:
        radial-gradient(circle at 50% 40%, rgba(190, 128, 42, .16), transparent 31%),
        radial-gradient(circle at 50% 58%, rgba(87, 18, 27, .22), transparent 55%),
        rgba(1, 2, 5, .93);
      backdrop-filter: blur(9px) saturate(.78);
      animation: hyxhn-decision-fade .45s ease both;
    }
    #${ROOT_ID} .hyxhn-decision-panel {
      position: relative;
      isolation: isolate;
      width: min(92vw, 680px);
      max-height: min(90vh, 820px);
      overflow: auto;
      padding: clamp(22px, 4.5vw, 42px);
      border: 1px solid rgba(234, 193, 111, .5);
      border-radius: 7px;
      color: #f9f1e3;
      background:
        linear-gradient(90deg, transparent 49.7%, rgba(223, 178, 87, .045) 50%, transparent 50.3%),
        radial-gradient(circle at 50% 31%, rgba(143, 91, 27, .16), transparent 40%),
        linear-gradient(155deg, rgba(23, 20, 18, .99), rgba(5, 7, 12, .995) 68%);
      box-shadow:
        0 34px 110px rgba(0, 0, 0, .86),
        0 0 0 5px rgba(3, 4, 7, .9),
        0 0 0 6px rgba(185, 132, 50, .22),
        inset 0 0 70px rgba(126, 26, 31, .1);
      text-align: center;
    }
    #${ROOT_ID} .hyxhn-decision-panel::before,
    #${ROOT_ID} .hyxhn-decision-panel::after {
      content: "";
      position: absolute;
      z-index: -1;
      pointer-events: none;
    }
    #${ROOT_ID} .hyxhn-decision-panel::before {
      inset: 11px;
      border: 1px solid rgba(219, 171, 81, .16);
      clip-path: polygon(0 0, 38% 0, 40% 2px, 60% 2px, 62% 0, 100% 0, 100% 100%, 62% 100%, 60% calc(100% - 2px), 40% calc(100% - 2px), 38% 100%, 0 100%);
    }
    #${ROOT_ID} .hyxhn-decision-panel::after {
      left: 50%;
      top: 18px;
      width: 86px;
      height: 1px;
      transform: translateX(-50%);
      background: linear-gradient(90deg, transparent, #d5a85a, transparent);
      box-shadow: 0 0 12px rgba(231, 184, 95, .5);
    }
    #${ROOT_ID} .hyxhn-decision-kicker {
      margin: 0 0 8px;
      color: #bd9152;
      font-size: 10px;
      letter-spacing: .38em;
      text-transform: uppercase;
    }
    #${ROOT_ID} .hyxhn-decision-title {
      margin: 0;
      font-family: "STKaiti", "KaiTi", serif;
      color: #f5e6c4;
      font-size: clamp(28px, 6vw, 46px);
      font-weight: 700;
      letter-spacing: .18em;
      text-shadow: 0 2px 18px rgba(207, 153, 65, .24);
    }
    #${ROOT_ID} .hyxhn-decision-subtitle {
      margin: 10px auto 16px;
      color: #bdb3a6;
      font-size: clamp(12px, 2.8vw, 15px);
      line-height: 1.7;
    }
    #${ROOT_ID} .hyxhn-decision-instruction {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto 12px;
      color: #d0aa67;
      font-size: 11px;
      letter-spacing: .16em;
    }
    #${ROOT_ID} .hyxhn-decision-instruction::before,
    #${ROOT_ID} .hyxhn-decision-instruction::after {
      content: "";
      width: 28px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(209, 161, 80, .65));
    }
    #${ROOT_ID} .hyxhn-decision-instruction::after { transform: rotate(180deg); }
    #${ROOT_ID} .hyxhn-sword-button {
      --hyxhn-sword-turn: 0deg;
      --hyxhn-sword-angle: 0deg;
      --hyxhn-sword-glow: 28px;
      --hyxhn-sword-glow-alpha: .22;
      --hyxhn-sword-saturation: .76;
      --hyxhn-sword-brightness: .82;
      position: relative;
      display: grid;
      place-items: center;
      width: clamp(142px, 34vw, 184px);
      aspect-ratio: 1;
      margin: 0 auto 18px;
      padding: 11px;
      border: 0;
      border-radius: 50%;
      color: #f4d799;
      background:
        radial-gradient(circle, rgba(231, 177, 75, .14), transparent 65%),
        #08090b;
      box-shadow:
        0 0 var(--hyxhn-sword-glow) rgba(213, 154, 57, var(--hyxhn-sword-glow-alpha)),
        0 18px 42px rgba(0, 0, 0, .56);
      cursor: pointer;
      touch-action: manipulation;
      transition: transform .12s ease, box-shadow .28s ease;
    }
    #${ROOT_ID} .hyxhn-sword-button::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background: conic-gradient(from -90deg, #f4d58d var(--hyxhn-sword-angle), rgba(92, 76, 53, .28) 0);
      -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0);
      mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 0);
      filter: drop-shadow(0 0 7px rgba(230, 177, 76, .38));
    }
    #${ROOT_ID} .hyxhn-sword-button::after {
      content: "";
      position: absolute;
      inset: -9px;
      border: 1px solid rgba(217, 170, 84, .22);
      border-radius: inherit;
      border-left-color: rgba(239, 205, 139, .68);
      border-right-color: rgba(133, 31, 34, .65);
      animation: hyxhn-sword-orbit 9s linear infinite;
    }
    #${ROOT_ID} .hyxhn-sword-image-frame {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(230, 189, 108, .52);
      border-radius: 50%;
      background: #050609;
      transform: rotate(var(--hyxhn-sword-turn));
      transition: transform .42s cubic-bezier(.22, .78, .28, 1.18), filter .28s ease;
      box-shadow: inset 0 0 18px rgba(0, 0, 0, .75);
    }
    #${ROOT_ID} .hyxhn-sword-image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      user-select: none;
      -webkit-user-drag: none;
      filter: saturate(var(--hyxhn-sword-saturation)) brightness(var(--hyxhn-sword-brightness));
    }
    #${ROOT_ID} .hyxhn-sword-button-label {
      position: absolute;
      left: 50%;
      bottom: 17%;
      z-index: 2;
      min-width: 52px;
      padding: 3px 9px;
      transform: translateX(-50%);
      border: 1px solid rgba(237, 199, 127, .54);
      border-radius: 999px;
      color: #f8e5bb;
      background: rgba(7, 7, 8, .78);
      box-shadow: 0 3px 13px rgba(0, 0, 0, .7);
      font-size: 11px;
      letter-spacing: .2em;
      text-indent: .2em;
      pointer-events: none;
    }
    #${ROOT_ID} .hyxhn-sword-button:hover { transform: translateY(-2px); }
    #${ROOT_ID} .hyxhn-sword-button:active { transform: scale(.94); }
    #${ROOT_ID} .hyxhn-sword-button.is-pulsing .hyxhn-sword-image-frame { animation: hyxhn-sword-pulse .42s ease; }
    #${ROOT_ID} .hyxhn-sword-button.is-complete::after { animation-duration: 2.5s; border-color: rgba(241, 202, 121, .72); }
    #${ROOT_ID} .hyxhn-sword-button[disabled] { cursor: default; }
    #${ROOT_ID} .hyxhn-decision-progress {
      position: relative;
      height: 9px;
      margin: 0 auto 9px;
      border: 1px solid rgba(209, 163, 82, .2);
      border-radius: 99px;
      background: rgba(255, 255, 255, .055);
      overflow: hidden;
    }
    #${ROOT_ID} .hyxhn-decision-progress > i {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #70202c, #b77834 48%, #f3d18c);
      box-shadow: 0 0 16px rgba(232, 191, 115, .58);
      transition: width .4s cubic-bezier(.22, .78, .28, 1);
    }
    #${ROOT_ID} .hyxhn-decision-marks {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 4px;
      margin: 0 4px 8px;
    }
    #${ROOT_ID} .hyxhn-decision-marks > i {
      height: 2px;
      background: rgba(208, 179, 129, .17);
      transition: background .28s ease, box-shadow .28s ease;
    }
    #${ROOT_ID} .hyxhn-decision-marks > i.is-active { background: #d7a856; box-shadow: 0 0 8px rgba(226, 177, 87, .5); }
    #${ROOT_ID} .hyxhn-decision-count { margin: 0; color: #a99e91; font-size: 12px; letter-spacing: .08em; }
    #${ROOT_ID} .hyxhn-decision-choices { display: grid; gap: 9px; margin-top: 18px; }
    #${ROOT_ID} .hyxhn-decision-choice {
      display: grid;
      grid-template-columns: minmax(92px, .8fr) 1.4fr;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 14px;
      border: 1px solid rgba(255, 255, 255, .12);
      border-radius: 4px;
      color: #f4e9dc;
      background: rgba(255, 255, 255, .045);
      text-align: left;
      cursor: pointer;
      transition: border-color .18s ease, background .18s ease, transform .12s ease;
    }
    #${ROOT_ID} .hyxhn-decision-choice:hover { border-color: rgba(231, 194, 123, .58); background: rgba(215, 171, 96, .1); }
    #${ROOT_ID} .hyxhn-decision-choice:active { transform: scale(.985); }
    #${ROOT_ID} .hyxhn-decision-choice strong { color: #f4d799; font-size: 14px; }
    #${ROOT_ID} .hyxhn-decision-choice span { color: #b7aab0; font-size: 12px; line-height: 1.5; }
    #${ROOT_ID} .hyxhn-decision-choice[data-choice="kill"] strong { color: #e88891; }
    #${ROOT_ID} .hyxhn-decision-demo { margin: 13px 0 0; color: #a99ca2; font-size: 11px; }
    #${ROOT_ID} .hyxhn-danmaku-normal {
      position: absolute;
      left: 100vw;
      max-width: 72vw;
      white-space: nowrap;
      z-index: 4;
      color: var(--hyxhn-danmaku-color, #fff);
      font-size: clamp(18px, 2vw, 30px);
      font-weight: 700;
      line-height: 1.4;
      letter-spacing: .04em;
      -webkit-text-stroke: 1px rgba(0, 0, 0, .96);
      paint-order: stroke fill;
      text-shadow:
        0 2px 3px #000,
        1px 0 1px #000,
        -1px 0 1px #000;
      animation: hyxhn-danmaku-fly var(--hyxhn-duration, 9s) linear forwards;
      will-change: transform;
    }
    #${ROOT_ID} .hyxhn-danmaku-center {
      position: absolute;
      left: 50%;
      top: 46%;
      z-index: 5;
      width: min(72vw, 760px);
      color: var(--hyxhn-danmaku-color, #fff4df);
      font-size: clamp(18px, 2.5vw, 34px);
      font-weight: 800;
      line-height: 1.25;
      text-align: center;
      letter-spacing: .08em;
      transform: translate(-50%, -50%);
      -webkit-text-stroke: 1px rgba(0, 0, 0, .96);
      paint-order: stroke fill;
      text-shadow:
        0 3px 4px #000,
        1px 0 1px #000,
        -1px 0 1px #000;
    }
    #${ROOT_ID} .hyxhn-danmaku-waterfall {
      filter: saturate(1.36) brightness(.98) contrast(1.12);
    }
    #${ROOT_ID} .hyxhn-danmaku-normal.hyxhn-danmaku-waterfall {
      font-size: clamp(12px, 1.15vw, 17px);
      line-height: 1.12;
      letter-spacing: .02em;
      -webkit-text-stroke-width: .75px;
    }
    @keyframes hyxhn-danmaku-fly {
      from { transform: translateX(0); }
      to { transform: translateX(calc(-100vw - 100%)); }
    }
    @keyframes hyxhn-decision-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes hyxhn-sword-orbit { to { transform: rotate(1turn); } }
    @keyframes hyxhn-sword-pulse {
      0%, 100% { filter: brightness(1); }
      45% { filter: brightness(1.42) drop-shadow(0 0 9px rgba(244, 201, 112, .75)); }
    }
    @media (max-width: 720px) {
      #${ROOT_ID} .hyxhn-danmaku-normal { max-width: 88vw; }
      #${ROOT_ID} .hyxhn-danmaku-center { width: 92vw; }
      #${ROOT_ID} .hyxhn-decision-choice { grid-template-columns: 1fr; gap: 3px; }
    }
    @media (prefers-reduced-motion: reduce) {
      #${ROOT_ID} .hyxhn-danmaku-normal { animation-duration: 14s; }
      #${ROOT_ID} .hyxhn-sword-button::after { animation: none; }
      #${ROOT_ID} .hyxhn-sword-image-frame { transition-duration: .01ms; }
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

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function applyDanmakuColor(node, requestedColor) {
  let palette;
  if (requestedColor) {
    palette = { color: requestedColor, glow: requestedColor };
  } else {
    const candidates = DANMAKU_COLORS.map((value, index) => ({ ...value, index }))
      .filter((value) => value.index !== runtime.lastDanmakuColor);
    palette = randomFrom(candidates);
    runtime.lastDanmakuColor = palette.index;
  }
  node.style.setProperty('--hyxhn-danmaku-color', palette.color);
  node.style.setProperty('--hyxhn-danmaku-glow', palette.glow);
}

function showNormalDanmaku(text, options = {}) {
  if (!runtime.overlay || !text) return;
  const node = runtime.parentDocument.createElement('div');
  node.className = `hyxhn-danmaku-normal${options.waterfall ? ' hyxhn-danmaku-waterfall' : ''}`;
  node.textContent = String(text);
  applyDanmakuColor(node, options.color);
  node.style.top = `${options.top ?? Math.random() * 98}%`;
  node.style.setProperty('--hyxhn-duration', `${options.duration ?? 8 + Math.random() * 3}s`);
  runtime.overlay.appendChild(node);
  node.addEventListener('animationend', () => node.remove(), { once: true });
}

function overlapScore(candidate, occupied, padding = 8) {
  return occupied.reduce((score, rect) => {
    const width = Math.max(0, Math.min(candidate.right, rect.right) - Math.max(candidate.left, rect.left) + padding);
    const height = Math.max(0, Math.min(candidate.bottom, rect.bottom) - Math.max(candidate.top, rect.top) + padding);
    return score + width * height;
  }, 0);
}

function placeCenterDanmaku(node) {
  const candidates = [17, 28, 39, 50, 61, 72, 83];
  const occupied = [...runtime.overlay.querySelectorAll('.hyxhn-danmaku-center')]
    .filter((item) => item !== node && item.isConnected)
    .map((item) => item.getBoundingClientRect());
  let best = { top: candidates[0], score: Number.POSITIVE_INFINITY };

  for (const top of candidates) {
    node.style.top = `${top}%`;
    const score = overlapScore(node.getBoundingClientRect(), occupied);
    if (score === 0) return top;
    if (score < best.score) best = { top, score };
  }
  return best.top;
}

function placeWaterfallCenterDanmaku(node) {
  const serial = runtime.waterfallCenterSerial;
  runtime.waterfallCenterSerial += 1;
  const positions = [...runtime.overlay.querySelectorAll('.hyxhn-danmaku-center.hyxhn-danmaku-waterfall')]
    .filter((item) => item !== node && item.isConnected)
    .map((item) => Number.parseFloat(item.style.top))
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  let top = Math.random() * 99;

  if (positions.length > 0) {
    const boundaries = [0, ...positions, 100];
    const gaps = [];
    for (let index = 1; index < boundaries.length; index += 1) {
      gaps.push({ start: boundaries[index - 1], end: boundaries[index], size: boundaries[index] - boundaries[index - 1] });
    }
    gaps.sort((left, right) => right.size - left.size);
    const candidatePool = gaps.slice(0, Math.min(8, gaps.length));
    const gap = randomFrom(candidatePool);
    top = gap.start + gap.size * (.34 + Math.random() * .32);
  }

  top = _.clamp(top, .45, 99.55);
  node.style.top = `${top}%`;
  node.style.left = `${49 + Math.random() * 2}%`;
  node.style.fontSize = `${17 + Math.random() * 5}px`;
  node.style.zIndex = String(20 + serial % 1000);
  return top;
}

function showCenterDanmaku(text, options = {}) {
  if (!runtime.overlay || !text) return;
  const node = runtime.parentDocument.createElement('div');
  node.className = `hyxhn-danmaku-center${options.waterfall ? ' hyxhn-danmaku-waterfall' : ''}`;
  node.textContent = String(text);
  applyDanmakuColor(node, options.color);
  node.style.visibility = 'hidden';
  runtime.overlay.appendChild(node);
  const top = options.top ?? (options.waterfallStack
    ? placeWaterfallCenterDanmaku(node)
    : placeCenterDanmaku(node));
  node.style.top = `${top}%`;
  node.style.visibility = '';
  schedule(() => node.remove(), options.duration ?? 4200);
}

function scheduleWaterfall(callback, delay) {
  const timer = window.setTimeout(() => {
    runtime.waterfallTimers.delete(timer);
    callback();
  }, delay);
  runtime.waterfallTimers.add(timer);
  return timer;
}

function stopDanmakuWaterfall({ announce = true } = {}) {
  const wasActive = runtime.waterfallActive;
  runtime.waterfallActive = false;
  runtime.waterfallTimers.forEach((timer) => window.clearTimeout(timer));
  runtime.waterfallTimers.clear();
  runtime.overlay?.querySelectorAll('.hyxhn-danmaku-waterfall').forEach((node) => node.remove());
  if (announce && wasActive) showCenterDanmaku('弹幕瀑布已关闭', { duration: 1800 });
}

function startDanmakuWaterfall() {
  if (runtime.waterfallActive) {
    showCenterDanmaku('弹幕瀑布已经在运行', { duration: 1600 });
    return;
  }
  runtime.waterfallActive = true;
  runtime.waterfallCenterSerial = 0;

  const normalLoop = () => {
    if (!runtime.waterfallActive) return;
    const burst = 40;
    for (let index = 0; index < burst; index += 1) {
      showNormalDanmaku(WATERFALL_TEXT, {
        top: Math.random() * 99,
        duration: 6.4 + Math.random() * 2.4,
        waterfall: true,
      });
    }
    scheduleWaterfall(normalLoop, 72 + Math.random() * 24);
  };

  const centerLoop = () => {
    if (!runtime.waterfallActive) return;
    const burst = 4 + Math.floor(Math.random() * 3);
    for (let index = 0; index < burst; index += 1) {
      showCenterDanmaku(WATERFALL_TEXT, {
        duration: 5500 + Math.random() * 1500,
        waterfall: true,
        waterfallStack: true,
      });
    }
    scheduleWaterfall(centerLoop, 30 + Math.random() * 15);
  };

  normalLoop();
  centerLoop();
}

function getCurrentChatStorageKey() {
  try {
    const context = SillyTavern.getContext();
    const chatId = context.getCurrentChatId?.() ?? context.chatId ?? 'unknown-chat';
    const characterId = context.characterId ?? 'current-character';
    return `${characterId}:${String(chatId)}`;
  } catch {
    return 'current-character:unknown-chat';
  }
}

function getStoredDecisionRuntime() {
  const legacy = getChatRuntime().decision || {};
  try {
    const storage = getVariables({ type: 'script', script_id: SCRIPT_ID }) || {};
    return storage[DECISION_STATE_STORE_KEY]?.[getCurrentChatStorageKey()] || legacy;
  } catch {
    return legacy;
  }
}

function hasStoredDecisionRuntime() {
  try {
    const storage = getVariables({ type: 'script', script_id: SCRIPT_ID }) || {};
    return Object.prototype.hasOwnProperty.call(
      storage[DECISION_STATE_STORE_KEY] || {},
      getCurrentChatStorageKey(),
    );
  } catch {
    return false;
  }
}

function getDecisionRuntime() {
  const value = getStoredDecisionRuntime();
  const legacyChoice = Object.entries(DECISION_CHOICES)
    .find(([, choice]) => choice.value === value.sentChoice);
  const selection = value.selection?.value
    ? {
        key: value.selection.key || legacyChoice?.[0] || null,
        value: value.selection.value,
        label: value.selection.label || value.selection.value,
        selectedAt: Number(value.selection.selectedAt) || null,
        choiceMessageId: Number.isInteger(Number(value.selection.choiceMessageId))
          ? Number(value.selection.choiceMessageId)
          : null,
      }
    : legacyChoice
      ? {
          key: legacyChoice[0],
          value: legacyChoice[1].value,
          label: legacyChoice[1].label,
          selectedAt: null,
          choiceMessageId: Number.isInteger(Number(value.choiceMessageId)) ? Number(value.choiceMessageId) : null,
        }
      : null;
  return {
    clicks: _.clamp(Math.round(Number(value.clicks) || 0), 0, DECISION_REQUIRED_CLICKS),
    sentChoice: selection?.value || value.sentChoice || null,
    selection,
    awaitingReply: value.awaitingReply === true,
    choiceMessageId: Number.isInteger(Number(value.choiceMessageId)) ? Number(value.choiceMessageId) : null,
    replyReceived: value.replyReceived === true,
    replyMessageId: Number.isInteger(Number(value.replyMessageId)) ? Number(value.replyMessageId) : null,
    postChoiceEffectPlayed: value.postChoiceEffectPlayed === true,
    followupMessageId: Number.isInteger(Number(value.followupMessageId)) ? Number(value.followupMessageId) : null,
    awaitingPostEffectReply: value.awaitingPostEffectReply === true,
    postEffectReplyReceived: value.postEffectReplyReceived === true,
    postEffectReplyMessageId: Number.isInteger(Number(value.postEffectReplyMessageId))
      ? Number(value.postEffectReplyMessageId)
      : null,
    bullethellTriggered: value.bullethellTriggered === true,
  };
}

function getPostChoiceGame(choice) {
  return POST_CHOICE_GAMES[choice] || null;
}

function isPostChoiceGameEligible(choice) {
  return Boolean(getPostChoiceGame(choice));
}

function updateDecisionRuntime(patch) {
  const chatKey = getCurrentChatStorageKey();
  updateVariablesWith((variables) => {
    const next = _.cloneDeep(variables || {});
    next[DECISION_STATE_STORE_KEY] = next[DECISION_STATE_STORE_KEY] || {};
    next[DECISION_STATE_STORE_KEY][chatKey] = {
      ...(next[DECISION_STATE_STORE_KEY][chatKey] || getChatRuntime().decision || {}),
      ...patch,
    };
    return next;
  }, { type: 'script', script_id: SCRIPT_ID });

  // 兼容旧脚本和调试面板；额外模型解析可能覆盖该镜像，权威副本仍在脚本变量中。
  updateVariablesWith((variables) => {
    const next = _.cloneDeep(variables || {});
    const current = next[CHAT_STATE_KEY] || { triggered: {} };
    current.triggered = current.triggered || {};
    current.decision = { ...(current.decision || {}), ...patch };
    next[CHAT_STATE_KEY] = current;
    return next;
  }, { type: 'chat' });
}

function recoverDecisionRuntimeFromChatHistory() {
  if (hasStoredDecisionRuntime()) return false;
  const legacy = getChatRuntime().decision || {};
  if (legacy.sentChoice || legacy.selection?.value) {
    updateDecisionRuntime(legacy);
    return true;
  }

  let messages;
  try {
    messages = getChatMessages('0-{{lastMessageId}}') || [];
  } catch (error) {
    console.info('[王权篇抉择] 无法扫描旧聊天，跳过联动状态恢复。', error);
    return false;
  }

  const choiceEntry = [...messages].reverse().find((message) => (
    message?.role === 'user'
    && Object.values(DECISION_CHOICES).some((choice) => choice.message === String(message.message || '').trim())
  ));
  if (!choiceEntry) return false;

  const choicePair = Object.entries(DECISION_CHOICES)
    .find(([, choice]) => choice.message === String(choiceEntry.message || '').trim());
  if (!choicePair) return false;
  const [choiceKey, choice] = choicePair;
  const choiceMessageId = Number(choiceEntry.message_id);
  const reply = messages.find((message) => (
    message?.role === 'assistant'
    && Number(message.message_id) > choiceMessageId
    && String(message.message || '').trim()
  ));
  const replyMessageId = reply ? Number(reply.message_id) : null;

  updateDecisionRuntime({
    clicks: DECISION_REQUIRED_CLICKS,
    sentChoice: choice.value,
    selection: {
      key: choiceKey,
      value: choice.value,
      label: choice.label,
      selectedAt: null,
      choiceMessageId,
    },
    awaitingReply: !Number.isInteger(replyMessageId),
    choiceMessageId,
    replyReceived: Number.isInteger(replyMessageId),
    replyMessageId,
    postChoiceEffectPlayed: false,
    followupMessageId: null,
    awaitingPostEffectReply: false,
    postEffectReplyReceived: false,
    postEffectReplyMessageId: null,
    bullethellTriggered: false,
  });
  console.info('[王权篇抉择] 已从固定选择消息恢复旧聊天联动状态，等待后续玩家发送。');
  return true;
}

function closeDecisionModal() {
  runtime.parentDocument?.getElementById(DECISION_MODAL_ID)?.remove();
  runtime.decisionDemoMode = false;
}

async function sendDecisionChoice(choiceKey) {
  const choice = DECISION_CHOICES[choiceKey];
  if (!choice) return;

  if (runtime.decisionDemoMode) {
    closeDecisionModal();
    showCenterDanmaku(`演示选择：${choice.label}`);
    return;
  }

  const decision = getDecisionRuntime();
  if (decision.sentChoice) return;
  const choiceMessageId = getLastMessageId() + 1;
  const selection = {
    key: choiceKey,
    value: choice.value,
    label: choice.label,
    selectedAt: Date.now(),
    choiceMessageId,
  };
  updateDecisionRuntime({
    clicks: DECISION_REQUIRED_CLICKS,
    sentChoice: choice.value,
    selection,
    awaitingReply: true,
    choiceMessageId,
    replyReceived: false,
    postChoiceEffectPlayed: false,
    replyMessageId: null,
    awaitingPostEffectReply: false,
    postEffectReplyReceived: false,
    postEffectReplyMessageId: null,
    bullethellTriggered: false,
  });
  closeDecisionModal();
  showCenterDanmaku(`你选择了：${choice.label}`);

  try {
    await createChatMessages([{ role: 'user', message: choice.message }], { refresh: 'all' });
    await triggerSlash('/trigger');
    try {
      await eventEmit(DECISION_SELECTED_EVENT, _.cloneDeep(selection));
    } catch (eventError) {
      console.warn('[王权篇抉择] 选择已记录，但跨脚本事件广播失败。', eventError);
    }
  } catch (error) {
    updateDecisionRuntime({ sentChoice: null, selection: null, awaitingReply: false, choiceMessageId: null, replyReceived: false });
    console.error('[王权篇抉择] 自动发送选择失败。', error);
    toastr?.error?.('选择未能自动发送，请重试。');
    openDecisionModal();
  }
}

function openDecisionModal({ demo = false } = {}) {
  if (!runtime.overlay) return;
  const existing = runtime.parentDocument.getElementById(DECISION_MODAL_ID);
  if (existing) return;

  const persisted = getDecisionRuntime();
  if (!demo && persisted.sentChoice) return;
  runtime.decisionDemoMode = demo;
  let clicks = demo ? 0 : persisted.clicks;

  const modal = runtime.parentDocument.createElement('section');
  modal.id = DECISION_MODAL_ID;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'hyxhn-decision-title');

  const panel = runtime.parentDocument.createElement('div');
  panel.className = 'hyxhn-decision-panel';
  panel.innerHTML = `
    <p class="hyxhn-decision-kicker">王权篇 · 命运抉择</p>
    <h2 id="hyxhn-decision-title" class="hyxhn-decision-title">此去无归</h2>
    <p class="hyxhn-decision-subtitle">父命、王权剑与倒在地上的清瞳。<br>剑在手中，去留却该由谁决定？</p>
    <p class="hyxhn-decision-instruction">连续点击 · 亲手拔剑</p>
    <button class="hyxhn-sword-button" type="button" aria-label="拔出王权剑">
      <span class="hyxhn-sword-image-frame" aria-hidden="true">
        <img class="hyxhn-sword-image" src="${DECISION_SWORD_ICON_DATA_URL}" alt="">
      </span>
      <span class="hyxhn-sword-button-label">执剑</span>
    </button>
    <div class="hyxhn-decision-progress" role="progressbar" aria-label="拔剑进度" aria-valuemin="0" aria-valuemax="${DECISION_REQUIRED_CLICKS}" aria-valuenow="0"><i></i></div>
    <div class="hyxhn-decision-marks" aria-hidden="true">${'<i></i>'.repeat(DECISION_REQUIRED_CLICKS)}</div>
    <p class="hyxhn-decision-count"></p>
    <div class="hyxhn-decision-choices" hidden></div>
  `;

  if (demo) {
    const note = runtime.parentDocument.createElement('p');
    note.className = 'hyxhn-decision-demo';
    note.textContent = '测试模式：选择不会发送消息或改变剧情。';
    panel.appendChild(note);
  }

  const swordButton = panel.querySelector('.hyxhn-sword-button');
  const progressTrack = panel.querySelector('.hyxhn-decision-progress');
  const progress = progressTrack.querySelector('i');
  const progressMarks = [...panel.querySelectorAll('.hyxhn-decision-marks > i')];
  const count = panel.querySelector('.hyxhn-decision-count');
  const choices = panel.querySelector('.hyxhn-decision-choices');

  const revealChoices = () => {
    if (choices.childElementCount === 0) {
      for (const [key, choice] of Object.entries(DECISION_CHOICES)) {
        const button = runtime.parentDocument.createElement('button');
        button.type = 'button';
        button.className = 'hyxhn-decision-choice';
        button.dataset.choice = key;
        const title = runtime.parentDocument.createElement('strong');
        title.textContent = choice.label;
        const hint = runtime.parentDocument.createElement('span');
        hint.textContent = choice.hint;
        button.append(title, hint);
        button.addEventListener('click', () => void sendDecisionChoice(key));
        choices.appendChild(button);
      }
    }
    choices.hidden = false;
    swordButton.disabled = true;
    swordButton.classList.add('is-complete');
    swordButton.querySelector('.hyxhn-sword-button-label').textContent = '出鞘';
  };

  const renderProgress = () => {
    const percent = clicks / DECISION_REQUIRED_CLICKS * 100;
    progress.style.width = `${percent}%`;
    progressTrack.setAttribute('aria-valuenow', String(clicks));
    const ratio = clicks / DECISION_REQUIRED_CLICKS;
    swordButton.style.setProperty('--hyxhn-sword-turn', `${clicks * 45}deg`);
    swordButton.style.setProperty('--hyxhn-sword-angle', `${clicks * 45}deg`);
    swordButton.style.setProperty('--hyxhn-sword-glow', `${28 + ratio * 38}px`);
    swordButton.style.setProperty('--hyxhn-sword-glow-alpha', String(.22 + ratio * .28));
    swordButton.style.setProperty('--hyxhn-sword-saturation', String(.76 + ratio * .42));
    swordButton.style.setProperty('--hyxhn-sword-brightness', String(.82 + ratio * .3));
    swordButton.setAttribute('aria-label', clicks >= DECISION_REQUIRED_CLICKS
      ? '王权剑已出鞘'
      : `拔出王权剑，当前 ${clicks} / ${DECISION_REQUIRED_CLICKS}`);
    progressMarks.forEach((mark, index) => mark.classList.toggle('is-active', index < clicks));
    count.textContent = clicks >= DECISION_REQUIRED_CLICKS
      ? '王权剑已出鞘。现在，由你决定。'
      : clicks === 0
        ? '剑意沉寂 · 尚未拔动'
        : `剑意渐醒 · ${clicks} / ${DECISION_REQUIRED_CLICKS}`;
    if (clicks >= DECISION_REQUIRED_CLICKS) revealChoices();
  };

  swordButton.addEventListener('click', () => {
    if (clicks >= DECISION_REQUIRED_CLICKS) return;
    clicks += 1;
    if (!demo) updateDecisionRuntime({ clicks });
    showNormalDanmaku(DECISION_THOUGHTS[clicks - 1], { top: 13 + clicks * 7, duration: 8.6 });
    swordButton.classList.remove('is-pulsing');
    void swordButton.offsetWidth;
    swordButton.classList.add('is-pulsing');
    renderProgress();
  });

  modal.appendChild(panel);
  runtime.overlay.appendChild(modal);
  renderProgress();
  swordButton.focus();
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
  if (/^data:audio\/[a-z0-9.+-]+;base64,/i.test(relativeOrAbsolute)) return relativeOrAbsolute;
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
  audio.addEventListener('ended', handlePostChoiceAudioEnded);
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

async function startTrack(trackKey, { restart = false, loopOverride = null } = {}) {
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
    audio.loop = typeof loopOverride === 'boolean' ? loopOverride : track.loop !== false;
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
    audio.loop = typeof loopOverride === 'boolean' ? loopOverride : track.loop !== false;
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

function stopMusic({ immediate = false } = {}) {
  runtime.pendingPlayback = false;
  runtime.audioUnlockCleanup?.();
  if (!runtime.audio) return;
  if (immediate) {
    clearFade();
    runtime.audio.pause();
    runtime.audio.currentTime = 0;
    runtime.currentTrack = null;
    return;
  }
  fadeVolume(0, 600, () => {
    runtime.audio.pause();
    runtime.audio.currentTime = 0;
    runtime.currentTrack = null;
  });
}

function exposeMediaApi() {
  mediaApi = Object.freeze({
    version: '1.1.0',
    events: Object.freeze({
      decisionSelected: DECISION_SELECTED_EVENT,
      bullethellRequested: BULLETHELL_REQUEST_EVENT,
    }),
    getState() {
      return {
        currentTrack: runtime.currentTrack,
        playing: Boolean(runtime.audio && !runtime.audio.paused && runtime.currentTrack),
        paused: Boolean(runtime.audio?.paused),
        pendingPlayback: runtime.pendingPlayback,
      };
    },
    playTrack(trackKey, options = {}) {
      return startTrack(trackKey, options);
    },
    getDecisionSelection() {
      const selection = getDecisionRuntime().selection;
      return selection ? _.cloneDeep(selection) : null;
    },
    stopMusic: () => stopMusic(),
  });
  window[MEDIA_API_GLOBAL_KEY] = mediaApi;
  try { runtime.parentDocument.defaultView[MEDIA_API_GLOBAL_KEY] = mediaApi; } catch (_) {}
  try {
    if (typeof initializeGlobal === 'function') initializeGlobal(MEDIA_API_GLOBAL_KEY, mediaApi);
  } catch (error) {
    console.info('[王权篇媒体] 全局音乐接口注册失败，保留父窗口直连。', error);
  }
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

function extractDecision(variables) {
  return _.get(variables, 'stat_data.剧情.最终抉择')
    ?? _.get(variables, '剧情.最终抉择')
    ?? '尚未选择';
}

function shouldOpenDecision(stage, decision) {
  return stage === DECISION_STAGE && decision === '尚未选择' && !getDecisionRuntime().sentChoice;
}

function clearInterceptedUserInput() {
  const textarea = runtime.parentDocument?.getElementById('send_textarea');
  if (!textarea) return;
  textarea.value = '';
  const InputEvent = runtime.parentDocument.defaultView?.Event || Event;
  textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

function interceptPendingDecisionSend(event) {
  if (!shouldOpenDecision(runtime.lastStage, runtime.lastDecision)) return false;
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  clearInterceptedUserInput();
  openDecisionModal();
  console.info('[王权篇抉择] 已拦截玩家原发送，改由拔剑选择接管。');
  return true;
}

function registerDecisionSendInterception() {
  const clickHandler = (event) => {
    if (!event.target?.closest?.('#send_but')) return;
    interceptPendingDecisionSend(event);
  };
  const keydownHandler = (event) => {
    if (event.key !== 'Enter' || event.isComposing || event.shiftKey || event.ctrlKey || event.altKey) return;
    if (!event.target?.closest?.('#send_textarea')) return;
    let sendsOnEnter = true;
    try {
      sendsOnEnter = SillyTavern.getContext().shouldSendOnEnter?.() ?? true;
    } catch (error) {
      console.info('[王权篇抉择] 无法读取 Enter 发送设置，按发送处理。', error);
    }
    if (sendsOnEnter) interceptPendingDecisionSend(event);
  };

  runtime.parentDocument.addEventListener('click', clickHandler, true);
  runtime.parentDocument.addEventListener('keydown', keydownHandler, true);
  runtime.cleanupCallbacks.push(() => runtime.parentDocument.removeEventListener('click', clickHandler, true));
  runtime.cleanupCallbacks.push(() => runtime.parentDocument.removeEventListener('keydown', keydownHandler, true));
}

function playPostChoiceFollowupEffect(messageId) {
  stopDanmakuWaterfall({ announce: false });
  startDanmakuWaterfall();
  void startTrack('dream_return', { restart: true, loopOverride: false });
  runtime.postChoiceRequestActive = true;
  runtime.postChoiceRequestMessageId = Number(messageId);
  if (runtime.postChoiceRequestWatchdog !== null) {
    window.clearTimeout(runtime.postChoiceRequestWatchdog);
    runtime.timers.delete(runtime.postChoiceRequestWatchdog);
  }
  runtime.postChoiceRequestWatchdog = schedule(() => {
    runtime.postChoiceRequestWatchdog = null;
    finishPostChoiceRequest('请求超过 300 秒仍未结束，已安全超时');
  }, POST_CHOICE_REQUEST_TIMEOUT_MS);
  console.info(`[王权篇抉择] 已确认第 ${messageId} 楼玩家后续发送，弹幕瀑布与 BGM 将持续到对应回复落地。`);
}

function finishPostChoiceRequest(reason, replyId = null, { immediateMusic = false } = {}) {
  if (!runtime.postChoiceRequestActive) return false;
  const requestMessageId = runtime.postChoiceRequestMessageId;
  runtime.postChoiceRequestActive = false;
  runtime.postChoiceRequestMessageId = null;
  if (runtime.postChoiceRequestWatchdog !== null) {
    window.clearTimeout(runtime.postChoiceRequestWatchdog);
    runtime.timers.delete(runtime.postChoiceRequestWatchdog);
    runtime.postChoiceRequestWatchdog = null;
  }
  stopDanmakuWaterfall({ announce: false });
  stopMusic({ immediate: immediateMusic });
  const replyText = Number.isInteger(Number(replyId)) ? `，回复楼层 ${Number(replyId)}` : '';
  const musicStopText = immediateMusic ? 'BGM 已完成并清理' : 'BGM 开始淡出';
  console.info(`[王权篇抉择] 第 ${requestMessageId} 楼对应生成请求结束：${reason}${replyText}；弹幕瀑布停止，${musicStopText}。`);
  return true;
}

function stopPostChoiceFollowupEffect(replyId) {
  finishPostChoiceRequest('收到非空正常回复', replyId);
}

function handlePostChoiceGenerationEnded(messageId) {
  finishPostChoiceRequest('生成生命周期结束（含空返回、HTTP 400/502 与请求异常）', messageId);
}

function handlePostChoiceGenerationStopped() {
  finishPostChoiceRequest('生成被用户或宿主中止');
}

function handlePostChoiceAudioEnded() {
  finishPostChoiceRequest('BGM 完整播放结束，触发硬性收尾', null, { immediateMusic: true });
}

function handlePostChoiceReply(messageId, type) {
  const decision = getDecisionRuntime();
  const replyId = Number(messageId);
  if (type !== 'normal' || !Number.isInteger(replyId)) return;

  let message;
  try {
    message = getChatMessages(replyId)?.[0];
  } catch (error) {
    console.info('[王权篇抉择] 暂时无法读取候选回复楼层。', error);
    return;
  }
  if (message?.role !== 'assistant' || !String(message.message || '').trim()) return;

  if (decision.awaitingReply && !decision.postChoiceEffectPlayed) {
    if (decision.choiceMessageId === null || replyId <= decision.choiceMessageId) return;
    updateDecisionRuntime({
      awaitingReply: false,
      replyReceived: true,
      replyMessageId: replyId,
    });
    console.info(`[王权篇抉择] 已确认第 ${replyId} 楼拔剑回复，等待玩家下一次发送后启动联动。`);
    return;
  }

  if (!decision.awaitingPostEffectReply || !decision.postChoiceEffectPlayed) return;
  if (decision.followupMessageId === null || replyId <= decision.followupMessageId) return;

  stopPostChoiceFollowupEffect(replyId);
  const gameEligible = isPostChoiceGameEligible(decision.sentChoice);
  updateDecisionRuntime({
    awaitingPostEffectReply: false,
    postEffectReplyReceived: gameEligible,
    postEffectReplyMessageId: replyId,
  });
  const game = getPostChoiceGame(decision.sentChoice);
  if (gameEligible) {
    console.info(`[王权篇抉择] 已确认第 ${replyId} 楼弹幕联动回复，等待玩家下一次发送后启动${game.label}。`);
  }
}

function handlePostChoiceFollowupMessage(messageId) {
  const decision = getDecisionRuntime();
  const followupId = Number(messageId);
  if (!Number.isInteger(followupId)) return;

  let message;
  try {
    message = getChatMessages(followupId)?.[0];
  } catch (error) {
    console.info('[王权篇抉择] 暂时无法读取玩家后续发送楼层。', error);
    return;
  }
  if (message?.role !== 'user' || !String(message.message || '').trim()) return;

  if (decision.postEffectReplyReceived && !decision.bullethellTriggered) {
    const game = getPostChoiceGame(decision.sentChoice);
    if (!game) return;
    if (decision.postEffectReplyMessageId === null || followupId <= decision.postEffectReplyMessageId) return;
    updateDecisionRuntime({
      postEffectReplyReceived: false,
      bullethellTriggered: true,
      bullethellTriggerMessageId: followupId,
    });
    void Promise.resolve(eventEmit(game.event, {
      source: 'post_choice_chain',
      choice: decision.sentChoice,
      messageId: followupId,
    })).catch((error) => {
      console.error(`[王权篇抉择] ${game.label}请求事件发送失败。`, error);
      updateDecisionRuntime({ postEffectReplyReceived: true, bullethellTriggered: false, bullethellTriggerMessageId: null });
    });
    console.info(`[王权篇抉择] 第 ${followupId} 楼玩家发送已触发 ${decision.sentChoice} 路线的${game.label}。`);
    return;
  }

  if (!decision.replyReceived || decision.postChoiceEffectPlayed) return;
  if (decision.replyMessageId === null || followupId <= decision.replyMessageId) return;

  updateDecisionRuntime({
    replyReceived: false,
    postChoiceEffectPlayed: true,
    followupMessageId: followupId,
    awaitingPostEffectReply: true,
    postEffectReplyReceived: false,
    postEffectReplyMessageId: null,
    bullethellTriggered: false,
  });
  playPostChoiceFollowupEffect(followupId);
}

async function playStageEvent(stage, { force = false } = {}) {
  const event = STAGE_EVENTS[stage];
  if (!event) return;

  const chatRuntime = getChatRuntime();
  if (!force && chatRuntime.triggered?.[stage]) return;

  if (runtime.config?.autoStageDanmaku === true) {
    event.normal?.forEach((text, index) => {
      schedule(() => showNormalDanmaku(text), index * 850);
    });
    event.center?.forEach((text, index) => {
      schedule(() => showCenterDanmaku(text), index * 4400);
    });
  }
  if (event.music) await startTrack(event.music, { restart: Boolean(event.restartMusic) });

  if (!force) markTriggered(stage);
}

function handleVariables(variables, { allowInitial = false } = {}) {
  const stage = extractStage(variables);
  const decision = extractDecision(variables);
  if (!stage) return;

  if (!shouldOpenDecision(stage, decision) && !runtime.decisionDemoMode) closeDecisionModal();

  const stageChanged = stage !== runtime.lastStage;
  runtime.lastStage = stage;
  runtime.lastDecision = decision;
  if (!stageChanged) return;

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

function resetDecisionInteraction() {
  closeDecisionModal();
  finishPostChoiceRequest('拔剑交互被手动重置');
  updateDecisionRuntime({
    clicks: 0,
    sentChoice: null,
    selection: null,
    awaitingReply: false,
    choiceMessageId: null,
    replyReceived: false,
    postChoiceEffectPlayed: false,
    replyMessageId: null,
    awaitingPostEffectReply: false,
    postEffectReplyReceived: false,
    postEffectReplyMessageId: null,
    bullethellTriggered: false,
    bullethellTriggerMessageId: null,
  });
  showCenterDanmaku('拔剑交互进度已重置');
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
    case '开启弹幕瀑布':
      startDanmakuWaterfall();
      break;
    case '关闭弹幕瀑布':
      stopDanmakuWaterfall();
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
    case '测试拔剑窗口':
      closeDecisionModal();
      openDecisionModal({ demo: true });
      break;
    case '重置拔剑进度':
      resetDecisionInteraction();
      break;
  }
}

function registerButtons() {
  const buttonNames = ['测试右移弹幕', '测试中央弹幕', '开启弹幕瀑布', '关闭弹幕瀑布', '测试音乐', '停止音乐', '测试拔剑窗口', '重置拔剑进度', '重置媒体触发'];

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
  registerDecisionSendInterception();
  runtime.configReady = readMediaConfig().then((config) => {
    runtime.config = config;
    return config;
  });
  exposeMediaApi();
  await runtime.configReady;
  recoverDecisionRuntimeFromChatHistory();

  const mvu = await waitGlobalInitialized('Mvu');
  const mvuEvents = mvu?.events || window.Mvu?.events || MVU_EVENTS;
  eventOn(mvuEvents.VARIABLE_INITIALIZED || MVU_EVENTS.initialized, (variables) => handleVariables(variables, { allowInitial: true }));
  eventOn(mvuEvents.VARIABLE_UPDATE_ENDED || MVU_EVENTS.updateEnded, (variables) => handleVariables(variables));
  eventOn(tavern_events.MESSAGE_RECEIVED, handlePostChoiceReply);
  eventOn(tavern_events.MESSAGE_SENT, handlePostChoiceFollowupMessage);
  eventOn(tavern_events.GENERATION_ENDED, handlePostChoiceGenerationEnded);
  eventOn(tavern_events.GENERATION_STOPPED, handlePostChoiceGenerationStopped);
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
  runtime.postChoiceRequestActive = false;
  runtime.postChoiceRequestMessageId = null;
  runtime.postChoiceRequestWatchdog = null;
  stopDanmakuWaterfall({ announce: false });
  closeDecisionModal();
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
  try { if (window[MEDIA_API_GLOBAL_KEY] === mediaApi) delete window[MEDIA_API_GLOBAL_KEY]; } catch (_) {}
  try {
    const parentWindow = runtime.parentDocument?.defaultView;
    if (parentWindow?.[MEDIA_API_GLOBAL_KEY] === mediaApi) delete parentWindow[MEDIA_API_GLOBAL_KEY];
  } catch (_) {}
  mediaApi = null;
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
