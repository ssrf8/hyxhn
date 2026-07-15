// 狐妖小红娘·王权篇媒体资源配置 v1.1.0
// 构建时只替换下面的占位符；以后切换 R2 仅需修改 config/media-assets.json。
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
