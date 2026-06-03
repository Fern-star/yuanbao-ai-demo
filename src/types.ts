export type RelationType =
  | 'close-friend'
  | 'boss'
  | 'mom'
  | 'crush'
  | 'work-group'
  | 'friend-group'
  | 'family-group'
  | 'yuanbao'      // 元宝 AI 自己
  | 'official';    // 公众号

export type ChatType = 'private' | 'group' | 'ai';

export interface ContextReminder {
  short: string;
  details: { label: string; content: string }[];
  openingSuggestion: string;
}

export interface LatentMeaning {
  intentions: string[];
  riskNote: string;
  saferReplies: string[];
}

export interface VoiceIntent {
  rawTranscript: string;
  coreMeaning: string;
  emotion: string;
  needAction: string[];
  keyPoints?: string[];
  relatedToMe?: string;
  suggestedReply: string;
}

/** 元宝在自己会话里推送的"漏回"卡片 */
export interface CatchupCard {
  id: string;
  sender: string;
  senderAvatar: string;
  senderBg: string;
  relationLabel: string;
  originalMessage: string;
  receivedAgo: string;
  reason: string;
  suggestedReply: string;
  urgency: 'low' | 'mid' | 'high';
  /** 跳转到的 contact id */
  targetContactId: string;
  /** 距离现在已经积压多少小时（用于 24h 高亮） */
  hoursPending: number;
}

/** 3 小时单条重提（轻量条，不重复完整卡片） */
export interface CatchupNudge {
  /** 关联的 catchup 卡片 id */
  catchupId: string;
  /** 第几次重提（1=第一次 3h 后） */
  round: number;
}

/** 元宝在自己会话里给的每日早报 */
export interface DailyBriefCard {
  id: string;
  date: string;          // 显示用日期
  greeting: string;      // 一句开场白
  pendingCount: number;
  highlights: string[];  // 1-3 条要点
}

export type YbBubble =
  | { kind: 'text'; text: string }
  | { kind: 'brief'; data: DailyBriefCard }
  | { kind: 'catchup'; data: CatchupCard }
  | { kind: 'catchup-nudge'; data: CatchupNudge }
  | { kind: 'tip'; title: string; body: string }; // 通用知识/小提示

export interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  type: 'text' | 'voice' | 'image' | 'system';
  timestamp: string;
  isMine: boolean;
  voiceSeconds?: number;
  voiceIntent?: VoiceIntent;
  latentMeaning?: LatentMeaning;
  /** 系统/时间分隔气泡 */
  systemText?: string;
  /** 元宝会话专用 - 富气泡 */
  ybBubble?: YbBubble;
  /** 图片消息 - 简化展示 */
  imageEmoji?: string;
  imageBg?: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;        // tailwind bg class（深色主题下用作头像底）
  relationType: RelationType;
  relationTag: string;
  relationDescription: string;
  tonePreference: string;
  chatType: ChatType;
  contextReminder?: ContextReminder;
  messages: Message[];
  members?: { name: string; avatar: string; bg: string }[];
  lastPreview: string;
  lastTime: string;
  unread?: number;
  pinned?: boolean;
  muted?: boolean;
  /** 是否是 AI（元宝） */
  isAI?: boolean;
  /** 服务号/订阅号 */
  isOfficial?: boolean;
}

export interface SuggestionResult {
  triggerKey: string;
  riskLevel: 'low' | 'mid' | 'high';
  insight: string;
  replyDirections: string[];
}

/** 朋友圈一条动态 */
export interface MomentPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBg: string;
  text?: string;
  /** 简化为 emoji 占位图 */
  images?: { emoji: string; bg: string }[];
  timeAgo: string;
  location?: string;
  likes?: string[];
  comments?: { name: string; text: string }[];
}

/** 朋友圈发表页素材 */
export interface MomentMaterial {
  id: string;
  title: string;
  thumb: string;
  bg: string;            // gradient class
  privacyRisk?: string;
}

export type Mood = '开心' | '松弛' | '有点累' | '想记录' | '想低调炫耀' | '有点emo';
export type Style = '简洁' | '松弛' | '可爱' | '幽默' | '高级克制' | '发疯文学';
