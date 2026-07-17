// 狐妖小红娘·王权篇媒体资源配置 v1.4.0
// v1.4.0: 恢复《梦回还》完整曲长，继续使用 128 kbps 有损压缩控制体积。
// v1.3.0: 改为内嵌保留前 2/3、128 kbps 的有损压缩 BGM，降低卡体积。
// v1.2.0: 构建时把《梦回还》编码为 Base64 data URL，离线发布到顶层页面。
const MEDIA_CONFIG = __HYXHN_MEDIA_CONFIG__;
const MEDIA_CONFIG_GLOBAL_KEY = '__HYXHN_WANGQUAN_MEDIA_CONFIG__';

function publishMediaConfig() {
  try {
    window.parent[MEDIA_CONFIG_GLOBAL_KEY] = MEDIA_CONFIG;
  } catch (error) {
    console.error('[王权篇媒体配置] 无法向酒馆顶层页面发布配置。', error);
  }
}

$(publishMediaConfig);

export {};
