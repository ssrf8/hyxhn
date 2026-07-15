// 狐妖小红娘·王权篇部件验证器 v1.1.0
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
assert(filenames.length === 6, `应有 6 个构建产物，实际为 ${filenames.length}`);

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
assert(entries.length === 7, `世界书应有 7 条，实际为 ${entries.length}`);
for (const [key, entry] of entries) {
  assert(key === String(entry.uid), `世界书键 ${key} 与 uid ${entry.uid} 不一致`);
  assert(entry.excludeRecursion === true && entry.preventRecursion === true, `${entry.comment} 未双禁递归`);
}
const initVar = entries.map(([, entry]) => entry).find((entry) => entry.comment.startsWith('[InitVar]'));
assert(initVar?.enabled === false && initVar?.disable === true, '[InitVar] 没有保持禁用');
const personaController = entries.map(([, entry]) => entry).find((entry) => entry.comment.includes('阶段好感人设控制器'));
assert(personaController?.content.startsWith('@@private'), '清瞳人设控制器必须使用 @@private 独立作用域');
assert(personaController.content.includes('affinity < 20') && personaController.content.includes('affinity >= 80'), '清瞳人设控制器缺少好感度分段');
assert(personaController.content.includes('低好感后期修正'), '清瞳人设控制器缺少低好感后期修正');
assert(initVar.content.includes('好感度: 5'), 'InitVar 缺少初始好感度');
assert(initVar.content.includes('心声:'), 'InitVar 缺少清瞳心声');

for (const filename of filenames.slice(1)) {
  const script = parsed.get(filename);
  assert(requiredScriptFields.every((field) => Object.hasOwn(script, field)), `${filename} 缺少脚本导入字段`);
  assert(script.type === 'script', `${filename} type 必须为 script`);
  assert(typeof script.content === 'string' && script.content.length > 0, `${filename} content 为空`);
}

const configScript = parsed.get('04-王权篇媒体资源配置.json');
const controllerScript = parsed.get('05-王权篇顶层弹幕与音乐.json');
const statusbarScript = parsed.get('06-王权篇状态栏控制器.json');
const mediaConfig = configScript.data.mediaConfig;
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
assert(mediaConfig.assetBaseUrl === 'http://127.0.0.1:8123/', '本地测试 base URL 异常');
assert(mediaConfig.tracks?.dream_return?.src, '缺少 dream_return 曲目配置');
assert(statusbarScript.content.includes("'[data-hyxhn-statusbar-mount]'"), '状态栏控制器缺少挂载点选择器');
assert(statusbarScript.content.includes('attachShadow'), '状态栏控制器未使用 Shadow DOM');
assert(!statusbarScript.content.includes('__HYXHN_STATUSBAR_HTML__'), '状态栏 HTML 构建占位符未替换');
await access(path.join(projectRoot, mediaConfig.tracks.dream_return.src));

const schemaScript = parsed.get('03-王权篇变量结构.json');
const stages = [...schemaScript.content.matchAll(/'([0-5]{2}_[^']+)'/g)].map((match) => match[1]);
assert(stages.length === 6 && new Set(stages).size === 6, 'Schema 剧情阶段枚举异常');
assert(schemaScript.content.includes('好感度') && schemaScript.content.includes('_.clamp'), 'Schema 缺少好感度 0..100 约束');
for (const stage of stages) {
  assert(controllerScript.content.includes(`'${stage}'`), `控制器缺少阶段事件：${stage}`);
  assert(initVar.content.includes(stages[0]), 'InitVar 初始阶段与 Schema 不一致');
}

console.log('验证通过：');
console.log('- 6 个 JSON 均可解析，脚本字段完整');
console.log('- 世界书 7 条 uid 对齐，[InitVar] 禁用，条目双禁递归');
console.log('- 六个 MVU 阶段、好感度约束与双条件人设控制器一致');
console.log('- 媒体配置独立，控制器未写死本机绝对路径');
console.log('- 弹幕层与测试按钮先于媒体配置等待初始化，并具备顶层点击兜底');
console.log('- 状态栏以 scoped 挂载点 + Shadow DOM 渲染，静态模板已内嵌');
console.log('- 本地测试音乐文件存在');
