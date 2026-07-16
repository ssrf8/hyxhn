// ═══ 狐妖小红娘·王权篇 Schema v1.3.0 ═══
// v1.3.0: 将黄风城觉醒、红线家法、一剑开天、叛门、12580 真相与龙湾前路拆为独立阶段。
// v1.2.0: 出逃山庄更名为此去无归；新增最终抉择与无心之剑独立结局阶段。
// v1.1.0: 收敛为剧情、时间、地点、清瞳状态、好感度与心声六项状态。
let registerMvuSchema;
try {
  ({ registerMvuSchema } = await import('https://cdn.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js'));
} catch (primaryError) {
  console.warn('[王权篇 Schema] 主镜像加载失败，尝试备用镜像。', primaryError);
  ({ registerMvuSchema } = await import('https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js'));
}

const STAGES = [
  '00_序章_道门兵人',
  '01_任务_蛛网疑影',
  '02_初遇_笼中清瞳',
  '03_黄风_怒火迷城',
  '04_黄风_红线家法',
  '05_黄风_一剑开天',
  '06_败露_主殿杀令',
  '07_决裂_此去无归',
  '08_尾声_万水千山',
  '08_结局_无心之剑',
  '09_深山_代号一二五八零',
  '10_再起_王权在手',
  '11_前路_龙湾之约',
];

const DECISIONS = ['尚未选择', '杀掉清瞳', '弃剑', '持剑救走清瞳'];

const str = (fallback = '') => z.preprocess(
  value => (value === undefined || value === null || value === '' ? fallback : String(value)),
  z.string(),
).prefault(fallback).catch(fallback);

export const Schema = z.object({
  剧情: z.object({
    当前阶段: z.preprocess(
      value => ({
        '03_相知_画中山河': '06_败露_主殿杀令',
        '04_决裂_出逃山庄': '07_决裂_此去无归',
        '04_决裂_此去无归': '07_决裂_此去无归',
        '05_尾声_万水千山': '08_尾声_万水千山',
        '05_结局_无心之剑': '08_结局_无心之剑',
      }[value] || value),
      z.enum(STAGES),
    ).prefault(STAGES[0]).catch(STAGES[0]),
    最终抉择: z.enum(DECISIONS).prefault(DECISIONS[0]).catch(DECISIONS[0]),
    时间: str('暮色将临'),
    地点: str('王权山庄·演武场'),
  }).prefault({}).catch({}),
  清瞳: z.object({
    状态: str('未正式现身，正在暗处侦察王权山庄'),
    好感度: z.coerce.number()
      .transform(value => _.clamp(Math.round(value), 0, 100))
      .prefault(5)
      .catch(5),
    心声: str('王权家的兵器……最好不要惊动他。'),
  }).prefault({}).catch({}),
});

$(() => {
  registerMvuSchema(Schema);
});

export {};
