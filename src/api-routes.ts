/**
 * API路由映射文件
 * 定义所有可用的API端点和平台配置
 */

// 已实现的平台
export const IMPLEMENTED_PLATFORMS = [
  '360doc',     // 360doc
  '360search',  // 360搜索
  'acfun',      // AcFun
  'baidu',      // 百度
  'bilibili',   // 哔哩哔哩
  'cctv',       // cctv
  'csdn',       // CSDN
  'dongqiudi',  // 懂球帝
  'douban',     // 豆瓣
  'douyin',     // 抖音
  'github',     // GitHub
  'guojiadili', // 国家地理
  'historytoday', // 历史上的今天
  'hupu',       // 虎扑
  'ithome',     // IT之家
  'lishipin',   // 梨视频
  'nanfangzhoumo', // 南方周末
  'pengpai',    // 澎湃新闻
  'qqnews',     // 腾讯新闻
  'quark',      // 夸克
  'renmin',     // 人民网
  'sougou',     // 搜狗
  'souhu',      // 搜狐
  'toutiao',    // 今日头条
  'weibo',      // 微博
  'zhihu',      // 知乎
];

// 待实现的平台
export const PENDING_PLATFORMS = [
  // 其他待实现平台
  'tieba',         // 百度贴吧
  'kuaishou',      // 快手
  'iqiyi',         // 爱奇艺
  'tengxunkt',     // 腾讯视频
  'youku',         // 优酷
  'ifeng',         // 凤凰新闻
  'huanqiu',       // 环球网
  'guancha',       // 观察者网
  'tianya',        // 天涯论坛
  'mgtv',          // 芒果TV
  'smzdm',         // 什么值得买
  'kuaidi',        // 快递100
  'jd',            // 京东
  'tmall',         // 天猫
  'taobao',        // 淘宝
  'suning',        // 苏宁易购
  'pdd',           // 拼多多
  'meituan',       // 美团
  'ele',           // 饿了么
  'xueqiu',        // 雪球
  'eastmoney',     // 东方财富
  'hexun',         // 和讯网
  'cnblogs',       // 博客园
  'oschina',       // 开源中国
];

// 所有支持的平台（已实现 + 待实现）
export const ALL_PLATFORMS = [...IMPLEMENTED_PLATFORMS, ...PENDING_PLATFORMS];

// API路由配置
export const API_ROUTES = {
  // 基础路由
  BASE: {
    ROOT: '/',                    // 根路径 - 返回API信息
    LIST: '/list',               // 获取所有支持的平台列表
    ALL: '/all',                 // 获取所有平台的热搜数据聚合
    PLATFORM: '/:platform',      // 获取特定平台的热搜数据
  },
  
  // MCP路由
  MCP: {
    TOOLS: '/mcp/tools',         // 获取可用的MCP工具
    EXECUTE: '/mcp/tool/execute', // 执行MCP工具
  },
  
  // WebSocket路由
  WEBSOCKET: {
    ROOT: '/ws',                 // 通用WebSocket连接
    PLATFORM: '/ws/:platform',   // 特定平台WebSocket连接
  },
};

// 平台配置信息接口
export interface PlatformConfig {
  name: string;          // 平台标识符
  displayName: string;   // 显示名称
  icon: string;          // 图标URL
  url: string;           // API或页面URL
}

// 已实现平台的配置信息
export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  '360doc': {
    name: '360doc',
    displayName: '360doc',
    icon: 'https://www.360doc.cn/favicon.ico',
    url: 'http://www.360doc.com/',
  },
  '360search': {
    name: '360search',
    displayName: '360搜索',
    icon: 'https://ss.360tres.com/static/121a1737750aa53d.ico',
    url: 'https://ranks.hao.360.com/mbsug-api/hotnewsquery?type=news&realhot_limit=50',
  },
  acfun: {
    name: 'acfun',
    displayName: 'AcFun',
    icon: 'https://cdn.aixifan.com/ico/favicon.ico',
    url: 'https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=&subChannelId=&rankLimit=30&rankPeriod=DAY',
  },
  baidu: {
    name: 'baidu',
    displayName: '百度',
    icon: 'https://www.baidu.com/favicon.ico',
    url: 'https://top.baidu.com/board?tab=realtime',
  },
  bilibili: {
    name: 'bilibili',
    displayName: '哔哩哔哩',
    icon: 'https://static.hdslb.com/mobile/img/512.png',
    url: 'https://api.bilibili.com/x/web-interface/ranking/region?rid=0',
  },
  cctv: {
    name: 'cctv',
    displayName: 'cctv',
    icon: 'https://news.cctv.com/favicon.ico',
    url: 'https://news.cctv.com/2019/07/gaiban/cmsdatainterface/page/world_1.jsonp',
  },
  csdn: {
    name: 'csdn',
    displayName: 'CSDN',
    icon: 'https://g.csdnimg.cn/static/logo/favicon32.ico',
    url: '', // 待实现
  },
  dongqiudi: {
    name: 'dongqiudi',
    displayName: 'dongqiudi',
    icon: 'https://www.dongqiudi.com/images/dqd-logo.png',
    url: 'https://dongqiudi.com/api/v3/archive/pc/index/getIndex',
  },
  douban: {
    name: 'douban',
    displayName: '豆瓣',
    icon: 'https://img3.doubanio.com/favicon.ico',
    url: '', // 待实现
  },
  douyin: {
    name: 'douyin',
    displayName: '抖音',
    icon: 'https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico',
    url: '', // 待实现
  },
  github: {
    name: 'github',
    displayName: 'GitHub',
    icon: 'https://github.githubassets.com/favicons/favicon.png',
    url: '', // 待实现
  },
  guojiadili: {
    name: 'guojiadili',
    displayName: '国家地理',
    icon: 'http://www.dili360.com/favicon.ico',
    url: '', // 待实现
  },
  historytoday: {
    name: 'historytoday',
    displayName: 'historytoday',
    icon: 'https://baike.baidu.com/favicon.ico',
    url: '', // 动态生成URL
  },
  hupu: {
    name: 'hupu',
    displayName: '虎扑',
    icon: 'https://www.hupu.com/favicon.ico',
    url: '', // 待实现
  },
  ithome: {
    name: 'ithome',
    displayName: 'ithome',
    icon: 'https://www.ithome.com/favicon.ico',
    url: 'https://m.ithome.com/rankm/',
  },
  lishipin: {
    name: 'lishipin',
    displayName: '梨视频',
    icon: 'https://page.pearvideo.com/webres/img/logo.png',
    url: '', // 待实现
  },
  nanfangzhoumo: {
    name: 'nanfangzhoumo',
    displayName: '南方周末',
    icon: 'https://www.infzm.com/favicon.ico',
    url: 'https://www.infzm.com/hot_contents?format=json',
  },
  nanfang: {
    name: 'nanfang',
    displayName: '南方周末',
    icon: 'https://icdn.infzm.com/wap/img/infzm-meta-icon.46b02e1.png',
    url: '', // 待实现
  },
  pengpai: {
    name: 'pengpai',
    displayName: '澎湃新闻',
    icon: 'https://www.thepaper.cn/favicon.ico',
    url: 'https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar',
  },
  qqnews: {
    name: 'qqnews',
    displayName: '腾讯新闻',
    icon: 'https://mat1.gtimg.com/qqcdn/qqindex2021/favicon.ico',
    url: 'https://r.inews.qq.com/gw/event/hot_ranking_list?page_size=51',
  },
  quark: {
    name: 'quark',
    displayName: '夸克',
    icon: 'https://gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png',
    url: 'https://biz.quark.cn/api/trending/ranking/getNewsRanking?modules=hotNews&uc_param_str=dnfrpfbivessbtbmnilauputogpintnwmtsvcppcprsnnnchmicckpgixsnx',
  },
  renmin: {
    name: 'renmin',
    displayName: '人民网',
    icon: 'http://www.people.com.cn/favicon.ico',
    url: 'http://www.people.com.cn/GB/59476/index.html',
  },
  shaoshupai: {
    name: 'shaoshupai',
    displayName: '少数派',
    icon: 'https://cdn-static.sspai.com/favicon/sspai.ico',
    url: 'https://sspai.com/',
  },
  sougou: {
    name: 'sougou',
    displayName: '搜狗',
    icon: 'https://www.sogou.com/favicon.ico',
    url: 'https://www.sogou.com/',
  },
  sougou_search: {
    name: 'sougou_search',
    displayName: '搜狗搜索',
    icon: 'https://www.sogou.com/favicon.ico',
    url: '', // 待实现
  },
  souhu: {
    name: 'souhu',
    displayName: '搜狐',
    icon: 'https://3g.k.sohu.com/favicon.ico',
    url: 'https://www.sohu.com/',
  },
  souhu_news: {
    name: 'souhu_news',
    displayName: '搜狐新闻',
    icon: 'https://m.sohu.com/favicon.ico',
    url: '', // 待实现
  },
  toutiao: {
    name: 'toutiao',
    displayName: '今日头条',
    icon: 'https://sf3-cdn-tos.douyinstatic.com/obj/eden-cn/uhbfnupkbps/toutiao_favicon.ico',
    url: 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc',
  },
  v2ex: {
    name: 'v2ex',
    displayName: 'V2EX',
    icon: 'https://www.v2ex.com/static/favicon.ico',
    url: '', // 待实现
  },
  wangyinews: {
    name: 'wangyinews',
    displayName: '网易新闻',
    icon: 'https://news.163.com/favicon.ico',
    url: '', // 待实现
  },
  weibo: {
    name: 'weibo',
    displayName: '微博',
    icon: 'https://weibo.com/favicon.ico',
    url: 'https://s.weibo.com/top/summary',
  },
  xinjingbao: {
    name: 'xinjingbao',
    displayName: '新京报',
    icon: 'https://www.bjnews.com.cn/favicon.ico',
    url: '', // 待实现
  },
  zhihu: {
    name: 'zhihu',
    displayName: '知乎',
    icon: 'https://static.zhihu.com/static/favicon.ico',
    url: 'https://www.zhihu.com/api/v4/search/recommend_query/v2',
  },
};

// 获取平台配置
export function getPlatformConfig(platform: string): PlatformConfig | undefined {
  return PLATFORM_CONFIGS[platform];
}

// 检查平台是否已实现
export function isPlatformImplemented(platform: string): boolean {
  return IMPLEMENTED_PLATFORMS.includes(platform);
}

// 检查平台是否存在（已实现或待实现）
export function isPlatformSupported(platform: string): boolean {
  return ALL_PLATFORMS.includes(platform);
}

// 获取所有已实现平台的配置
export function getImplementedPlatforms(): PlatformConfig[] {
  return IMPLEMENTED_PLATFORMS.map(platform => PLATFORM_CONFIGS[platform])
    .filter(config => config !== undefined);
}

// 获取所有平台的配置
export function getAllPlatforms(): PlatformConfig[] {
  return ALL_PLATFORMS.map(platform => PLATFORM_CONFIGS[platform])
    .filter(config => config !== undefined);
}

// API响应状态码
export enum API_STATUS {
  SUCCESS = 200,
  ERROR = 500,
  NOT_FOUND = 404,
}

// API错误信息
export const API_ERROR_MESSAGES = {
  [API_STATUS.NOT_FOUND]: 'Platform not supported',
  [API_STATUS.ERROR]: 'Error fetching data',
};

export default {
  API_ROUTES,
  IMPLEMENTED_PLATFORMS,
  PENDING_PLATFORMS,
  ALL_PLATFORMS,
  PLATFORM_CONFIGS,
  getPlatformConfig,
  isPlatformImplemented,
  isPlatformSupported,
  getImplementedPlatforms,
  getAllPlatforms,
};