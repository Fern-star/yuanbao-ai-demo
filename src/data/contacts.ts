import type { Contact, Message, CatchupCard, DailyBriefCard } from '../types';

const mk = (
  id: string,
  sender: string,
  content: string,
  isMine: boolean,
  timestamp: string,
  extra: Partial<Message> = {}
): Message => ({
  id,
  sender,
  content,
  type: 'text',
  isMine,
  timestamp,
  ...extra,
});

const sysSep = (id: string, text: string): Message => ({
  id,
  sender: '',
  content: '',
  type: 'system',
  isMine: false,
  timestamp: '',
  systemText: text,
});

/* ================== 元宝 AI 会话推送内容 ================== */
export const todayBrief: DailyBriefCard = {
  id: 'brief-0603',
  date: '6 月 3 日 · 早 8:00 统一汇总',
  greeting: '昨晚到现在共 4 条没回的消息，我一次性整理在这里，回过的就不再打扰你。',
  pendingCount: 4,
  highlights: [
    '⚠️ 妈妈昨晚问"到家了吗"——已搁置 14 小时',
    '⚠️ 老同学约你周末吃饭——已搁置 18 小时',
    '雯雯发了生日祝福（今天她生日）',
    '合作方在等你确认时间',
  ],
};

export const catchupCards: CatchupCard[] = [
  {
    id: 'cu-mom',
    sender: '妈妈',
    senderAvatar: '🌸',
    senderBg: 'bg-pink-500/20',
    relationLabel: '家人 · 关心',
    originalMessage: '到家了吗？',
    receivedAgo: '昨晚 22:40',
    reason: '过去 14 小时未回，简单一句会让她安心。',
    suggestedReply: '到啦，刚刚有点忙没看手机，你早点休息。',
    urgency: 'mid',
    targetContactId: 'mom',
    hoursPending: 14,
  },
  {
    id: 'cu-classmate',
    sender: '老同学 · 大圣',
    senderAvatar: '🐵',
    senderBg: 'bg-yellow-500/20',
    relationLabel: '老同学 · 明确邀约',
    originalMessage: '周末要不要出来吃饭？',
    receivedAgo: '昨天 19:12',
    reason: '是一个明确邀约，已等 18 小时。',
    suggestedReply: '我还不确定周末安排，明天跟你确认可以吗？',
    urgency: 'mid',
    targetContactId: 'classmate',
    hoursPending: 18,
  },
  {
    id: 'cu-old-friend',
    sender: '初中同学 · 阿菲',
    senderAvatar: '🎐',
    senderBg: 'bg-purple-500/20',
    relationLabel: '老朋友 · 闲聊',
    originalMessage: '最近在忙啥呀，好久没联系了。',
    receivedAgo: '前天 11:20',
    reason: '已经 51 小时没回了，再不回容易尴尬。',
    suggestedReply: '哈哈最近被工作绑架了，等周末补你一杯，约？',
    urgency: 'high',
    targetContactId: 'classmate',
    hoursPending: 51,
  },
  {
    id: 'cu-birthday',
    sender: '雯雯',
    senderAvatar: '🎈',
    senderBg: 'bg-rose-500/20',
    relationLabel: '朋友 · 生日祝福',
    originalMessage: '生日快乐！！永远开心！',
    receivedAgo: '今天 09:02',
    reason: '今天是她生日，当天回复会更有心。',
    suggestedReply: '谢谢宝！！看到你的祝福好开心，今天是你给我的好运～',
    urgency: 'high',
    targetContactId: 'wenwen',
    hoursPending: 6,
  },
  {
    id: 'cu-partner',
    sender: '张哥 · 合作方',
    senderAvatar: '💼',
    senderBg: 'bg-blue-500/20',
    relationLabel: '合作方 · 时间确认',
    originalMessage: '这个时间可以吗？',
    receivedAgo: '今天 10:35',
    reason: '会影响后续排期，建议今天确认。',
    suggestedReply: '这个时间可以，我这边先同步安排。',
    urgency: 'high',
    targetContactId: 'partner',
    hoursPending: 4,
  },
];

/* ================== 联系人列表 ================== */
export const contacts: Contact[] = [
  // 0. 元宝 AI（置顶 · 默认进入即可看到补漏推送）
  {
    id: 'yuanbao',
    name: '元宝',
    avatar: '🐯',
    avatarBg: 'bg-emerald-600',
    relationType: 'yuanbao',
    relationTag: 'AI',
    relationDescription: '只对你可见的社交安全带',
    tonePreference: '克制、不强势',
    chatType: 'ai',
    isAI: true,
    pinned: true,
    lastPreview: '【3h 重提】合作方在等你确认时间。',
    lastTime: '14:30',
    unread: 4,
    messages: [
      sysSep('ys0', '今天 08:00 · 早间汇总'),
      {
        id: 'y-brief',
        sender: '元宝',
        content: '',
        type: 'text',
        isMine: false,
        timestamp: '08:00',
        ybBubble: { kind: 'brief', data: todayBrief },
      },
      ...catchupCards.map<Message>((c, i) => ({
        id: 'y-cu-' + c.id,
        sender: '元宝',
        content: '',
        type: 'text',
        isMine: false,
        timestamp: ['08:01', '08:01', '08:02', '08:02', '08:03'][i] || '08:03',
        ybBubble: { kind: 'catchup', data: c },
      })),
      // —— 之后的"每 3 小时"单条重提（仅对仍未回复的）——
      sysSep('ys-nudge-1', '今天 11:30 · 已 3h 未处理，单条重提'),
      {
        id: 'y-nudge-mom-1',
        sender: '元宝',
        content: '',
        type: 'text',
        isMine: false,
        timestamp: '11:30',
        ybBubble: { kind: 'catchup-nudge', data: { catchupId: 'cu-mom', round: 1 } },
      },
      sysSep('ys-nudge-2', '今天 14:30 · 已 3h 未处理，单条重提'),
      {
        id: 'y-nudge-partner-1',
        sender: '元宝',
        content: '',
        type: 'text',
        isMine: false,
        timestamp: '14:30',
        ybBubble: { kind: 'catchup-nudge', data: { catchupId: 'cu-partner', round: 1 } },
      },
      {
        id: 'y-tip-1',
        sender: '元宝',
        content: '',
        type: 'text',
        isMine: false,
        timestamp: '14:30',
        ybBubble: {
          kind: 'tip',
          title: '关于"漏回提醒"的节奏',
          body: '我每天早 8 点统一汇总一次（不挑时间打扰你）；之后对仍没回的消息每 3 小时再轻提一下。任何一条你点"不再提醒"，我就不会再为它提你了。',
        },
      },
    ],
  },

  // 1. 林小满 - 好朋友
  {
    id: 'linxiaoman',
    name: '林小满',
    avatar: '🌿',
    avatarBg: 'bg-emerald-500/20',
    relationType: 'close-friend',
    relationTag: '好朋友',
    relationDescription: '亲密 · 轻松 · 可以开玩笑',
    tonePreference: '轻松、共情优先',
    chatType: 'private',
    pinned: true,
    lastPreview: '最近真的烦死了，什么都不想干。',
    lastTime: '14:02',
    unread: 2,
    contextReminder: {
      short: '你们上次聊到她准备搬家，可以从这个话题自然接上。',
      details: [
        { label: '上次聊天', content: '她说周末要去看房' },
        { label: '未完成', content: '你答应把搬家纸箱链接发给她' },
        { label: '建议开场', content: '你上次说要看房，后来怎么样啦？' },
      ],
      openingSuggestion: '你上次说要看房，后来怎么样啦？',
    },
    messages: [
      sysSep('lxm-s0', '昨天'),
      mk('lxm1', '林小满', '你那个搬家纸箱的链接还在吗？', false, '昨天 21:40'),
      mk('lxm2', '我', '在的在的，我等下发你', true, '昨天 21:42'),
      sysSep('lxm-s1', '今天 14:02'),
      mk('lxm3', '林小满', '最近真的烦死了，什么都不想干。', false, '14:02', {
        latentMeaning: {
          intentions: [
            '可能是在倾诉今天累了，更想被听到。',
            '也可能希望你陪她聊聊，但不一定要解决方案。',
          ],
          riskNote: '不建议直接给建议或说"你休息呗"，可能显得敷衍。',
          saferReplies: [
            '怎么啦，是今天又被什么事搞崩了吗？',
            '抱抱，听起来你真的累到了。',
            '要不要先骂两句，我听着。',
          ],
        },
      }),
    ],
  },

  // 2. 周总 - 老板
  {
    id: 'boss-zhou',
    name: '周总',
    avatar: '👔',
    avatarBg: 'bg-slate-500/30',
    relationType: 'boss',
    relationTag: '老板',
    relationDescription: '上下级 · 正式 · 推进明确',
    tonePreference: '简洁、确认方向、不防御',
    chatType: 'private',
    lastPreview: '这个方案你再看看。',
    lastTime: '13:40',
    unread: 1,
    contextReminder: {
      short: '上次让你补充方案的用户场景和落地成本，尚未确认最终版。',
      details: [
        { label: '关注点', content: '用户价值、落地成本、上线风险' },
        { label: '未交付', content: '修改后的方案 V2' },
        { label: '建议回复', content: '我补了一版用户场景，想和您确认下方向。' },
      ],
      openingSuggestion: '周总，方案我补了一版用户场景，想先和您对一下方向。',
    },
    messages: [
      sysSep('bz-s0', '昨天'),
      mk('bz1', '周总', '昨天那个方案，思路可以，但还是浅了点。', false, '昨天 17:30'),
      mk('bz2', '我', '好的周总，我再优化下', true, '昨天 17:32'),
      sysSep('bz-s1', '今天 13:40'),
      mk('bz3', '周总', '这个方案你再看看。', false, '13:40', {
        latentMeaning: {
          intentions: [
            '可能对当前方案还不满意，但没指出具体点。',
            '也可能希望你补充更多思考，而不是立即重做。',
          ],
          riskNote: '"你再看看" 信息量低，直接问"哪里有问题"容易显得防御。',
          saferReplies: [
            '收到，我再补充一下用户场景和落地成本，今晚前给您更新版。',
            '好的，我想确认下您更希望我重点优化哪部分？',
            '收到，我先重新梳理问题点，晚点给您一版修改方向。',
          ],
        },
      }),
    ],
  },

  // 3. 妈妈
  {
    id: 'mom',
    name: '妈妈',
    avatar: '🌸',
    avatarBg: 'bg-pink-500/20',
    relationType: 'mom',
    relationTag: '家人',
    relationDescription: '亲密 · 关心 · 需要情绪回应',
    tonePreference: '温和、有回应、报平安',
    chatType: 'private',
    lastPreview: '[语音 58"]',
    lastTime: '12:30',
    unread: 1,
    contextReminder: {
      short: '妈妈刚发了语音，主要是问周末回不回家、提醒添衣、并提到爸爸下周复查。',
      details: [
        { label: '核心事项', content: '周末是否回家 · 爸爸下周复查' },
        { label: '情绪', content: '关心为主，没有责备' },
        { label: '建议回复', content: '我周末可以回去，爸爸复查时间你发我，我看看能不能陪。' },
      ],
      openingSuggestion: '我周末可以回去，爸爸复查时间你发我一下。',
    },
    messages: [
      sysSep('m-s0', '昨天'),
      mk('m1', '妈妈', '到家了吗？', false, '昨天 22:40'),
      mk('m2', '我', '到啦', true, '昨天 23:02'),
      sysSep('m-s1', '今天 12:30'),
      mk('m3', '妈妈', '语音消息', false, '12:30', {
        type: 'voice',
        voiceSeconds: 58,
        voiceIntent: {
          rawTranscript:
            '你周末回不回来呀，最近降温了，你别穿太少。你爸下周还要去复查，我看你有没有时间陪一下。家里都挺好的，你别担心，就是想问问你。',
          coreMeaning: '她想问你周末回不回家。',
          emotion: '关心为主，没有责备。',
          needAction: ['确认周末是否回家', '看看是否能陪爸爸复查'],
          keyPoints: ['天气降温，提醒添衣', '爸爸下周需要复查', '没有施压，只是询问'],
          suggestedReply: '我周末可以回去，爸爸复查时间你发我一下，我看看能不能陪。',
        },
      }),
    ],
  },

  // 4. Echo - 暧昧
  {
    id: 'echo',
    name: 'Echo',
    avatar: '🪞',
    avatarBg: 'bg-violet-500/20',
    relationType: 'crush',
    relationTag: '暧昧',
    relationDescription: '敏感 · 试探 · 语气需要柔和',
    tonePreference: '温度高一点、不要太结论化',
    chatType: 'private',
    lastPreview: '随便，你决定吧。',
    lastTime: '11:15',
    unread: 1,
    contextReminder: {
      short: '上次你们讨论周末去哪，TA 没明确表态。今天 TA 说"随便你定"。',
      details: [
        { label: '上次话题', content: '周末是否一起去看展' },
        { label: '潜在情绪', content: 'TA 可能在试探你有没有上心' },
        { label: '建议方向', content: '不要直接拍板，多确认一下 TA 的偏好' },
      ],
      openingSuggestion: '我可以决定，但我也想知道你更想要哪个。',
    },
    messages: [
      sysSep('e-s0', '昨天'),
      mk('e1', 'Echo', '周末你想去哪呀', false, '昨天 21:00'),
      mk('e2', '我', '都行你定吧', true, '昨天 21:02'),
      sysSep('e-s1', '今天 11:15'),
      mk('e3', 'Echo', '随便，你决定吧。', false, '11:15', {
        latentMeaning: {
          intentions: [
            '可能是真的让你决定。',
            '也可能在表达一点轻微不满，希望你更上心一点。',
          ],
          riskNote: '不建议直接假设 TA 生气，也不建议一句"那就这样吧"结束话题。',
          saferReplies: [
            '我可以决定，但我也想知道你更想要哪个。',
            '那我先选一个，你要是不喜欢我们再换。',
            '别随便呀，我想选你也开心的。',
          ],
        },
      }),
    ],
  },

  // 5. 工作群
  {
    id: 'work-group',
    name: '【项目 Aurora】核心组',
    avatar: '🛠',
    avatarBg: 'bg-blue-500/20',
    relationType: 'work-group',
    relationTag: '工作群',
    relationDescription: '多人协作 · 礼貌 · 避免公开否定',
    tonePreference: '先认可方向，再补充风险',
    chatType: 'group',
    lastPreview: '李工：我觉得这个方案可以直接上。',
    lastTime: '10:48',
    members: [
      { name: '周总', avatar: '👔', bg: 'bg-slate-500/30' },
      { name: '李工', avatar: '🧑‍💻', bg: 'bg-blue-500/20' },
      { name: '小柯', avatar: '🧃', bg: 'bg-yellow-500/20' },
      { name: '我', avatar: '🙂', bg: 'bg-emerald-500/20' },
    ],
    contextReminder: {
      short: '群里在讨论方案是否直接上线。和你有关：周总让你补一下用户场景。',
      details: [
        { label: '群内倾向', content: '小范围灰度，未最终拍板' },
        { label: '与你有关', content: '周总让你补充用户场景与落地成本' },
        { label: '未确认', content: '上线时间、灰度范围' },
      ],
      openingSuggestion: '我同步一下用户场景的补充，方便大家一起评估范围。',
    },
    messages: [
      sysSep('wg-s0', '今天'),
      mk('wg1', '周总', '今天必须把方向定了。', false, '10:30'),
      mk('wg2', '李工', '我觉得这个方案可以直接上。', false, '10:48', {
        latentMeaning: {
          intentions: [
            '李工想推进进度，不希望再拖。',
            '也可能他没看到上线风险点。',
          ],
          riskNote: '在群里直接说"不太行"会让对方尴尬，且可能引起对立。',
          saferReplies: [
            '我觉得这个方向有价值，但有个风险可能需要提前看一下。',
            '这个方案能解决一部分问题，不过上线前可能还要补一下异常场景。',
            '可以先小范围试一下，避免直接全量带来风险。',
          ],
        },
      }),
      mk('wg3', '小柯', '+1 我也觉得可以试试', false, '10:49'),
    ],
  },

  // 6. 朋友聚会群
  {
    id: 'friend-group',
    name: '🍲 周六火锅局',
    avatar: '🍲',
    avatarBg: 'bg-orange-500/20',
    relationType: 'friend-group',
    relationTag: '朋友群',
    relationDescription: '轻松 · 避免冷场',
    tonePreference: '随意一些，节奏轻',
    chatType: 'group',
    lastPreview: '阿楠：[语音 22"]',
    lastTime: '09:21',
    members: [
      { name: '阿楠', avatar: '🐰', bg: 'bg-pink-500/20' },
      { name: '老白', avatar: '🐻', bg: 'bg-yellow-500/20' },
      { name: '丹丹', avatar: '🐼', bg: 'bg-slate-500/30' },
      { name: '我', avatar: '🙂', bg: 'bg-emerald-500/20' },
    ],
    contextReminder: {
      short: '最终暂定：周六晚上 7 点火锅。有人问你能不能带拍立得。',
      details: [
        { label: '时间', content: '周六 19:00' },
        { label: '地点', content: '火锅，店还没最终定（倾向三里屯）' },
        { label: '与你有关', content: '阿楠问你能不能带拍立得' },
        { label: '未确认', content: '是否订包间、最终人数' },
      ],
      openingSuggestion: '我可以带拍立得，人数确定后我看要不要多带相纸。',
    },
    messages: [
      sysSep('fg-s0', '今天'),
      mk('fg1', '丹丹', '周六晚上 7 点火锅集合！', false, '09:15'),
      mk('fg2', '老白', '三里屯那家？', false, '09:17'),
      mk('fg3', '阿楠', '语音消息', false, '09:21', {
        type: 'voice',
        voiceSeconds: 22,
        voiceIntent: {
          rawTranscript:
            '哎那就周六七点三里屯火锅啊，我看那家排队挺多的，要不要订个包间。还有谁能带拍立得啊，上次拍的太好玩了。',
          coreMeaning: '周六晚上 7 点聚餐，地点倾向三里屯火锅。',
          emotion: '兴奋、随意',
          needAction: ['确认是否带拍立得', '看是否要订包间'],
          keyPoints: ['周六 19:00', '三里屯火锅', '建议订包间'],
          relatedToMe: '阿楠问你能不能带拍立得',
          suggestedReply: '我可以带拍立得，人数确定后我再看要不要多带相纸。',
        },
      }),
    ],
  },

  // 7. 家族群
  {
    id: 'family-group',
    name: '一家人 · 家族群',
    avatar: '🏡',
    avatarBg: 'bg-amber-500/20',
    relationType: 'family-group',
    relationTag: '家族群',
    relationDescription: '跨代沟通 · 避免冲突',
    tonePreference: '温和、回应到长辈情绪',
    chatType: 'group',
    contextReminder: {
      short: '和你有关的两件事：妈妈问周末回不回家；爸爸下周复查时间还没确认。',
      details: [
        { label: '妈妈', content: '问你周末是否回家吃饭' },
        { label: '爸爸复查', content: '下周三上午，但还没确定谁陪同' },
        { label: '建议回复', content: '我周末可以回去，爸爸复查我也可以看下时间。' },
      ],
      openingSuggestion: '我周末可以回去，爸爸复查时间我也看看安排。',
    },
    lastPreview: '舅舅：娃啥时候回来呀',
    lastTime: '昨天',
    members: [
      { name: '妈妈', avatar: '🌸', bg: 'bg-pink-500/20' },
      { name: '爸爸', avatar: '🍵', bg: 'bg-amber-500/20' },
      { name: '舅舅', avatar: '🧧', bg: 'bg-red-500/20' },
      { name: '小姨', avatar: '🌷', bg: 'bg-rose-500/20' },
      { name: '我', avatar: '🙂', bg: 'bg-emerald-500/20' },
    ],
    messages: [
      sysSep('fa-s0', '昨天 20:00'),
      mk('fa1', '妈妈', '周末回不回来呀，给你做你爱吃的。', false, '昨天 20:10'),
      mk('fa2', '舅舅', '娃啥时候回来呀，好久没见了。', false, '昨天 20:30'),
      mk('fa3', '爸爸', '下周三上午我去医院复查，谁有空陪一下。', false, '昨天 21:00'),
    ],
  },

  // 8. 老同学（仅列表展示，可点）
  {
    id: 'classmate',
    name: '大圣',
    avatar: '🐵',
    avatarBg: 'bg-yellow-500/20',
    relationType: 'close-friend',
    relationTag: '老同学',
    relationDescription: '老同学 · 不常联系',
    tonePreference: '简单回应即可',
    chatType: 'private',
    lastPreview: '周末要不要出来吃饭？',
    lastTime: '昨天',
    contextReminder: {
      short: '昨晚 19:12 他发来一个吃饭邀约，你还没回复。',
      details: [
        { label: '邀约', content: '周末出来吃饭' },
        { label: '建议回复', content: '我周末安排还没定，明天给你确认' },
      ],
      openingSuggestion: '我还不确定周末安排，明天跟你确认可以吗？',
    },
    messages: [
      sysSep('cl-s0', '昨天 19:12'),
      mk('cl1', '大圣', '周末要不要出来吃饭？好久没聚了。', false, '昨天 19:12'),
    ],
  },

  // 9. 雯雯（生日祝福）
  {
    id: 'wenwen',
    name: '雯雯',
    avatar: '🎈',
    avatarBg: 'bg-rose-500/20',
    relationType: 'close-friend',
    relationTag: '朋友',
    relationDescription: '朋友 · 今天她生日',
    tonePreference: '热情、给到情绪',
    chatType: 'private',
    lastPreview: '生日快乐！！永远开心！',
    lastTime: '09:02',
    contextReminder: {
      short: '今天是雯雯的生日，她也给你发了祝福。',
      details: [
        { label: '今日特别', content: '是雯雯的生日' },
        { label: '建议回复', content: '回应她的祝福 + 生日快乐' },
      ],
      openingSuggestion: '谢谢宝！！看到你的祝福好开心，今天是你给我的好运～',
    },
    messages: [
      sysSep('ww-s0', '今天 09:02'),
      mk('ww1', '雯雯', '生日快乐！！永远开心！', false, '09:02'),
    ],
  },

  // 10. 张哥（合作方）
  {
    id: 'partner',
    name: '张哥',
    avatar: '💼',
    avatarBg: 'bg-blue-500/20',
    relationType: 'boss',
    relationTag: '合作方',
    relationDescription: '合作方 · 时间确认',
    tonePreference: '简洁、明确',
    chatType: 'private',
    lastPreview: '这个时间可以吗？',
    lastTime: '10:35',
    contextReminder: {
      short: '张哥在等你确认时间，会影响后续排期。',
      details: [
        { label: '关注点', content: '具体的可用时间' },
        { label: '建议回复', content: '直接给出可行时间 / 替换方案' },
      ],
      openingSuggestion: '这个时间可以，我这边先同步安排。',
    },
    messages: [
      sysSep('p-s0', '今天 10:35'),
      mk('p1', '张哥', '下周二下午 3 点过来开下会，这个时间可以吗？', false, '10:35'),
    ],
  },

  // 11. 公众号（占位，列表观感）
  {
    id: 'official-news',
    name: '公众号',
    avatar: '📚',
    avatarBg: 'bg-blue-600/30',
    relationType: 'official',
    relationTag: '订阅号',
    relationDescription: '订阅消息',
    tonePreference: '',
    chatType: 'private',
    isOfficial: true,
    lastPreview: '新智元：突发，字节 AI 大将顾全全离职！',
    lastTime: '14:32',
    unread: 1,
    messages: [
      mk('on1', '新智元', '新智元：突发，字节 AI 大将顾全全离职！', false, '14:32'),
    ],
  },
];

export const getContact = (id: string) => contacts.find((c) => c.id === id);
