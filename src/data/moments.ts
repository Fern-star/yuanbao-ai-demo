import type { MomentMaterial, MomentPost, Mood, Style } from '../types';

/* ============== 朋友圈信息流 ============== */
export const momentFeed: MomentPost[] = [
  {
    id: 'p1',
    authorName: '林小满',
    authorAvatar: '🌿',
    authorBg: 'bg-emerald-500/20',
    text: '今天的咖啡店光线刚刚好，决定先不工作半小时。',
    images: [
      { emoji: '☕️', bg: 'from-amber-300 to-orange-200' },
      { emoji: '📖', bg: 'from-rose-200 to-pink-200' },
      { emoji: '🌿', bg: 'from-emerald-200 to-teal-200' },
    ],
    timeAgo: '15 分钟前',
    location: '北京 · 三里屯',
    likes: ['雯雯', '老白', '阿楠'],
    comments: [
      { name: '雯雯', text: '是我喜欢的店！' },
      { name: '阿楠', text: '太适合发呆了' },
    ],
  },
  {
    id: 'p2',
    authorName: '老白',
    authorAvatar: '🐻',
    authorBg: 'bg-yellow-500/20',
    text: '一个阶段的小闭环，继续往前。',
    images: [
      { emoji: '🎤', bg: 'from-purple-300 to-pink-200' },
      { emoji: '🎉', bg: 'from-rose-300 to-orange-200' },
    ],
    timeAgo: '1 小时前',
    likes: ['林小满', '雯雯', '丹丹', '我'],
    comments: [
      { name: '林小满', text: '辛苦啦！' },
    ],
  },
  {
    id: 'p3',
    authorName: 'Echo',
    authorAvatar: '🪞',
    authorBg: 'bg-violet-500/20',
    text: '海风批准我今天不想上班。',
    images: [
      { emoji: '🌊', bg: 'from-sky-300 to-cyan-200' },
    ],
    timeAgo: '今天 08:21',
    location: '青岛 · 银沙滩',
    likes: ['林小满'],
    comments: [],
  },
  {
    id: 'p4',
    authorName: '丹丹',
    authorAvatar: '🐼',
    authorBg: 'bg-slate-500/30',
    text: '凌晨三点的窗外，比我会写诗。',
    images: [
      { emoji: '🌙', bg: 'from-indigo-700 to-slate-700' },
    ],
    timeAgo: '昨天 03:14',
    likes: ['雯雯'],
    comments: [
      { name: '雯雯', text: '怎么啦还没睡' },
    ],
  },
  {
    id: 'p5',
    authorName: '阿楠',
    authorAvatar: '🐰',
    authorBg: 'bg-pink-500/20',
    text: '周六见～带着拍立得！',
    images: [
      { emoji: '📷', bg: 'from-rose-200 to-pink-200' },
      { emoji: '🍲', bg: 'from-orange-300 to-amber-200' },
    ],
    timeAgo: '昨天 22:30',
    likes: ['老白', '丹丹', '我'],
    comments: [],
  },
];

/* ============== 发表朋友圈：素材库 ============== */
export const materials: MomentMaterial[] = [
  { id: 'beach',      title: '海边旅行',     thumb: '🌊', bg: 'from-sky-400 via-cyan-300 to-amber-200' },
  { id: 'cityNight',  title: '城市夜景',     thumb: '🌃', bg: 'from-slate-700 via-slate-600 to-indigo-500', privacyRisk: '画面右下角疑似有车牌信息，建议打码。' },
  { id: 'workEvent',  title: '工作活动现场', thumb: '🎤', bg: 'from-purple-400 via-pink-300 to-orange-200' },
  { id: 'birthday',   title: '生日聚会',     thumb: '🎂', bg: 'from-rose-300 via-pink-200 to-yellow-200' },
  { id: 'cafeSelfie', title: '咖啡店自拍',   thumb: '☕️', bg: 'from-amber-400 via-orange-300 to-rose-200', privacyRisk: '第二张图疑似露出酒店房卡，建议裁剪。' },
  { id: 'lateNight',  title: '深夜窗外',     thumb: '🌙', bg: 'from-indigo-900 via-slate-800 to-slate-600' },
];

export const moods: Mood[] = ['开心', '松弛', '有点累', '想记录', '想低调炫耀', '有点emo'];
export const styles: Style[] = ['简洁', '松弛', '可爱', '幽默', '高级克制', '发疯文学'];

type CaptionMap = Partial<Record<Mood, Partial<Record<Style, string[]>>>>;

const CAPTIONS: Record<string, CaptionMap> = {
  beach: {
    松弛: {
      简洁: ['充电中。', '今天的风很会安慰人。', '短暂逃离地球。'],
      可爱: ['海风批准我今天不想上班～', '小狗路过海边也会开心。', '今天是被阳光收买的一天。'],
      高级克制: ['有些地方，本身就是一种回答。', '海记得每一个走神的人。', '把自己晒一下。'],
    },
    开心: {
      可爱: ['海风批准我今天不想上班。', '今天是被阳光收买的一天。', '小狗路过海边也会开心。'],
      简洁: ['今天很好。', '风很温柔。', '海是答案。'],
      发疯文学: ['海啊海，你怎么这么好啊我真的会哭！！！', '今天的太阳是给我一个人发的吗？？', '我宣布我从今天开始是海的人了。'],
    },
    '想记录': {
      简洁: ['Day 02 · 海。', '把今天存档。', '风的形状。'],
    },
  },
  cityNight: {
    '有点累': {
      高级克制: ['今天先到这里。', '便利店的灯，意外温柔。', '城市还醒着，我可以先睡。'],
      简洁: ['晚安。', '今天到此为止。', '回家路上。'],
    },
    松弛: {
      简洁: ['夜里的城市，是我的。', '走一走，再回家。', '晚风很轻。'],
    },
  },
  workEvent: {
    '想低调炫耀': {
      高级克制: ['一个阶段的小闭环，继续往前。', '谢谢一起熬过来的大家。', '有些进度，值得被记录一下。'],
      简洁: ['Done. 下一站。', '一个 milestone。', '继续。'],
      幽默: ['不是我厉害，是队友太能扛。', '阶段性下班一下。', '今天的我，比 PPT 还稳。'],
    },
    开心: {
      松弛: ['好开心，又过了一关。', '能跟这群人一起做事，挺幸运。', '今天的舞台属于我们。'],
    },
  },
  birthday: {
    开心: {
      可爱: ['今天 +1 岁，可爱 +999。', '吹完蜡烛许的愿，是你们都好。', '生日的我，被宠成小孩。'],
      松弛: ['再长大一岁，慢慢来。', '感谢被记得。', '今年想稳一点开心。'],
      发疯文学: ['啊啊啊我生日啊！！全世界都要对我好！！', '今晚我最大！！蛋糕都要让我先动！！'],
    },
  },
  cafeSelfie: {
    松弛: {
      简洁: ['一杯，半天。', '今天慢一点。', '阳光先到了。'],
      可爱: ['咖啡因 + 阳光，等于今天的我。', '被阳光抱了一下。', '一杯咖啡的小逃跑。'],
    },
    '想记录': {
      高级克制: ['一些日常，值得被慢下来。', '今天的光，记得。'],
    },
  },
  lateNight: {
    '有点emo': {
      高级克制: ['今天先到这里。', '有些夜晚适合安静一点。', '慢慢来，也算在往前。'],
      简洁: ['睡吧。', '今天结束。', '明天再说。'],
      发疯文学: ['凌晨三点的窗外，比我会写诗。', '失眠是一种缓慢的烟花。', '我决定把今天交还给夜。'],
    },
    松弛: {
      简洁: ['夜很安静。', '今天到此为止。', '晚安世界。'],
    },
  },
};

const FALLBACKS: Partial<Record<Style, string[]>> = {
  简洁: ['今天，记一下。', '慢一点。', '存档。'],
  松弛: ['没什么大事，今天挺好。', '走走停停的一天。', '一切都还可以。'],
  可爱: ['今天的我有被自己萌到。', '小事情也值得被记住。', '心情是软的。'],
  幽默: ['今日已营业，谢谢光临。', '我自己看自己都有点想点赞。', '人间有点意思。'],
  高级克制: ['有些时刻，记下来就好。', '今天属于自己。', '慢慢来。'],
  发疯文学: ['今天的我，纯纯发疯！！！', '宇宙今天对我有点温柔我不接受！！', '存活！！还在跳！！'],
};

export function getCaptions(materialId: string, mood: Mood, style: Style): string[] {
  const m = CAPTIONS[materialId];
  const direct = m?.[mood]?.[style];
  if (direct && direct.length) return direct;
  if (m) {
    for (const moodKey of Object.keys(m) as Mood[]) {
      const styleMap = m[moodKey];
      if (styleMap?.[style]) return styleMap[style]!;
    }
    for (const moodKey of Object.keys(m) as Mood[]) {
      const styleMap = m[moodKey];
      if (styleMap) {
        const first = Object.values(styleMap)[0];
        if (first) return first;
      }
    }
  }
  return FALLBACKS[style] ?? ['先这样，记一下。'];
}

export const privacyTips: Record<string, string> = {
  cityNight: '画面右下角疑似有车牌信息，建议打码。',
  cafeSelfie: '第二张图疑似露出酒店房卡，建议裁剪。',
  lateNight: '这段文字情绪浓度较高，可能引发过多追问，要不要设为仅自己可见？',
};
