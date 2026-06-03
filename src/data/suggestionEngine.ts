import type { RelationType, SuggestionResult } from '../types';

/**
 * 基于关系 + 用户输入关键词的轻规则引擎
 * 模拟“元宝智能感”，不调用真实大模型
 */

interface Rule {
  match: (text: string) => boolean;
  forRelations?: RelationType[];   // 不指定则全场景
  result: Omit<SuggestionResult, 'triggerKey'>;
  triggerKey: string;
}

const has = (...keys: string[]) => (text: string) =>
  keys.some((k) => text.includes(k));

const RULES: Rule[] = [
  // 防御语气：对老板
  {
    triggerKey: 'defensive-to-boss',
    forRelations: ['boss'],
    match: has('哪里有问题', '什么意思', '不懂', '怎么了', '怎么不行'),
    result: {
      riskLevel: 'mid',
      insight: '这句可能显得有点防御。可以先确认收到，再主动对齐修改方向。',
      replyDirections: [
        '收到，我再补充一下用户场景和落地成本，今晚前给您更新版。',
        '好的，我想确认下您更希望我重点优化哪部分？',
        '收到，我先重新梳理问题点，晚点给您一版修改方向。',
      ],
    },
  },
  // 朋友倾诉，敷衍
  {
    triggerKey: 'dismiss-friend',
    forRelations: ['close-friend'],
    match: has('那你就休息', '想开点', '没事的', '别想太多', '看开点'),
    result: {
      riskLevel: 'mid',
      insight: '对方更像是在倾诉，这句话可能显得有点敷衍。建议先共情。',
      replyDirections: [
        '怎么啦，是今天又被什么事搞崩了吗？',
        '抱抱，听起来你真的累到了。',
        '要不要先骂两句，我听着。',
      ],
    },
  },
  // 群里直接否定
  {
    triggerKey: 'public-deny',
    forRelations: ['work-group'],
    match: has('不太行', '不行', '有问题', '不靠谱', '太草率'),
    result: {
      riskLevel: 'high',
      insight: '在群里直接否定可能让对方尴尬。建议先认可方向，再补充风险。',
      replyDirections: [
        '我觉得这个方向有价值，但有个风险可能需要提前看一下。',
        '这个方案能解决一部分问题，不过上线前可能还要补一下异常场景。',
        '可以先小范围试一下，避免直接全量带来风险。',
      ],
    },
  },
  // 暧昧 - 直接结束
  {
    triggerKey: 'crush-shutdown',
    forRelations: ['crush'],
    match: has('那就这样', '随便吧', '都行吧', '算了', '无所谓'),
    result: {
      riskLevel: 'mid',
      insight: '对方可能在试探或轻微不满，不建议直接结束话题。',
      replyDirections: [
        '我可以决定，但我也想知道你更想要哪个。',
        '那我先选一个，你要是不喜欢我们再换。',
        '别随便呀，我想选你也开心的。',
      ],
    },
  },
  // 吵架冷却（亲密关系/暧昧）
  {
    triggerKey: 'cool-down',
    forRelations: ['crush', 'close-friend', 'mom'],
    match: has('你每次都', '受够了', '随便你', '懒得', '我不管了'),
    result: {
      riskLevel: 'high',
      insight: '这句话可能会升级冲突。要不要换成表达感受但不攻击对方的版本？',
      replyDirections: [
        '我现在有点委屈，因为这件事之前也发生过。我想好好说一下。',
        '我不是想吵架，但这件事确实让我有点难受。',
        '我想先冷静一下，晚点我们再好好说。',
      ],
    },
  },
  // 单字回复 → 老板/暧昧温度提醒
  {
    triggerKey: 'too-cold-short',
    forRelations: ['boss', 'crush', 'mom', 'close-friend'],
    match: (t) => /^(好|嗯|行|哦|可以)$/.test(t.trim()),
    result: {
      riskLevel: 'low',
      insight: '单字回复在这个关系里可能显得有点冷，可以加一点态度或下一步动作。',
      replyDirections: [
        '收到，我看一下马上回你。',
        '好的，我先这边推进一下，有结果第一时间同步。',
        '好呀，我也挺期待的。',
      ],
    },
  },
  // 亲密关系 - "算了 / 无所谓"
  {
    triggerKey: 'passive-avoid',
    forRelations: ['crush', 'close-friend'],
    match: has('算了', '无所谓'),
    result: {
      riskLevel: 'mid',
      insight: '"算了"在亲密关系里很容易被理解成赌气。建议直接说出感受，不让情绪绕路。',
      replyDirections: [
        '我没有想算了，只是这件事让我有点失落。',
        '我想认真说一下我的感受，不是要吵。',
        '我先冷静一下，等下我们好好聊。',
      ],
    },
  },
  // 妈妈 - 简短
  {
    triggerKey: 'mom-warm-up',
    forRelations: ['mom'],
    match: has('知道了', '收到', '行'),
    result: {
      riskLevel: 'low',
      insight: '对妈妈这样的回复有点像应付。加一句关心或具体安排会更暖。',
      replyDirections: [
        '知道啦，我周末看看安排，回去陪你吃饭。',
        '好，我等下确认一下时间，回头告诉你。',
        '收到，最近你身体怎么样？',
      ],
    },
  },
];

export function analyzeInput(
  text: string,
  relation: RelationType
): SuggestionResult | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  for (const rule of RULES) {
    if (rule.forRelations && !rule.forRelations.includes(relation)) continue;
    if (rule.match(trimmed)) {
      return { triggerKey: rule.triggerKey, ...rule.result };
    }
  }
  return null;
}
