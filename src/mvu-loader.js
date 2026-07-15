// 狐妖小红娘·王权篇 MVU 加载器 v1.1.0
try {
  await import('https://cdn.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js');
} catch (primaryError) {
  console.warn('[王权篇 MVU] 主镜像加载失败，尝试备用镜像。', primaryError);
  await import('https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js');
}

export {};
