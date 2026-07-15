// 狐妖小红娘·王权篇 MVU 加载器 v1.1.1
// v1.1.1: 为 Luker 等宿主补齐 Vue/Pinia ESM 构建期全局标志。
globalThis.__VUE_OPTIONS_API__ ??= true;
globalThis.__VUE_PROD_DEVTOOLS__ ??= false;
globalThis.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ ??= false;

try {
  await import('https://cdn.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js');
} catch (primaryError) {
  console.warn('[王权篇 MVU] 主镜像加载失败，尝试备用镜像。', primaryError);
  await import('https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js');
}

export {};
