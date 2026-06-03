import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  MoreHorizontal,
  Mic,
  Smile,
  Plus,
  Sparkles,
  Brain,
  Play,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Send,
  Copy,
  Reply,
  Check,
  BellOff,
  AlarmClock,
} from 'lucide-react';
import clsx from 'clsx';
import { contacts, getContact, catchupCards } from '../data/contacts';
import { analyzeInput } from '../data/suggestionEngine';
import type {
  Contact,
  Message,
  SuggestionResult,
  LatentMeaning,
  CatchupCard,
  DailyBriefCard,
} from '../types';
import { StatusBar } from '../components/StatusBar';

export function ChatRoomPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const contact = id ? getContact(id) : undefined;

  if (!contact) {
    return (
      <div className="flex h-full flex-col bg-[#111] text-[#ECECEC]">
        <StatusBar />
        <div className="px-4 py-3 text-[15px] font-medium">选择一个聊天</div>
        <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-3">
          {contacts.map((c) => (
            <button
              key={c.id}
              onClick={() => nav(`/chat/${c.id}`)}
              className="rounded-xl border border-[#1F1F1F] bg-[#161616] p-3 text-left"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${c.avatarBg}`}
                >
                  {c.avatar}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium">{c.name}</div>
                  <div className="text-[10.5px] text-[#9A9A9A]">{c.relationTag}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return <ChatRoom key={contact.id} contact={contact} />;
}

function ChatRoom({ contact }: { contact: Contact }) {
  const nav = useNavigate();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(contact.messages);
  const [contextOpen, setContextOpen] = useState(true);
  const [contextExpanded, setContextExpanded] = useState(false);
  const [latentForId, setLatentForId] = useState<string | null>(null);
  const [voiceForId, setVoiceForId] = useState<string | null>(null);
  const [showRawId, setShowRawId] = useState<string | null>(null);
  /** 当前打开右键/长按菜单的消息 id + 锚点位置 */
  const [menuFor, setMenuFor] = useState<{ id: string; x: number; y: number } | null>(null);
  /** 用户主动「不再提醒」掉的 catchup id */
  const [mutedCatchups, setMutedCatchups] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);

  // 来自其他会话（如元宝补漏）的预填
  useEffect(() => {
    const key = 'yb-prefill-' + contact.id;
    const pre = sessionStorage.getItem(key);
    if (pre) {
      setInput(pre);
      sessionStorage.removeItem(key);
    }
  }, [contact.id]);

  // 滚到底
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const suggestion: SuggestionResult | null = useMemo(
    () => analyzeInput(input, contact.relationType),
    [input, contact.relationType]
  );

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `me-${Date.now()}`,
        sender: '我',
        content: text,
        type: 'text',
        isMine: true,
        timestamp: '刚刚',
      },
    ]);
    setInput('');
  };

  const fillSuggestion = (s: string) => setInput(s);

  const latentMsg = latentForId ? messages.find((m) => m.id === latentForId) : null;
  /** 弹层使用的潜台词数据：优先用预置 latentMeaning，否则现场兜底生成 */
  const latentData: LatentMeaning | null = useMemo(() => {
    if (!latentMsg) return null;
    if (latentMsg.latentMeaning) return latentMsg.latentMeaning;
    return buildFallbackLatent(latentMsg, contact);
  }, [latentMsg, contact]);

  const voiceMsg = voiceForId ? messages.find((m) => m.id === voiceForId) : null;
  const isAI = contact.chatType === 'ai';

  // 长按计时器（移动端）
  const lpTimer = useRef<number | null>(null);
  const startLongPress = (m: Message, e: React.PointerEvent) => {
    if (m.type === 'system' || m.ybBubble) return;
    const x = e.clientX;
    const y = e.clientY;
    lpTimer.current = window.setTimeout(() => {
      setMenuFor({ id: m.id, x, y });
    }, 380);
  };
  const cancelLongPress = () => {
    if (lpTimer.current) {
      window.clearTimeout(lpTimer.current);
      lpTimer.current = null;
    }
  };

  /** 桌面右键 */
  const openMenu = (m: Message, e: React.MouseEvent) => {
    if (m.type === 'system' || m.ybBubble) return;
    e.preventDefault();
    setMenuFor({ id: m.id, x: e.clientX, y: e.clientY });
  };

  const closeMenu = () => setMenuFor(null);

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      /* ignore */
    }
    closeMenu();
  };

  const onReply = (text: string) => {
    setInput((prev) => (prev ? prev : `回复"${text.slice(0, 12)}${text.length > 12 ? '…' : ''}"：`));
    closeMenu();
  };

  return (
    <div className="relative flex h-full flex-col bg-[#1A1A1A]">
      <StatusBar />

      {/* 导航条 */}
      <div className="px-2 py-2 flex items-center bg-[#1A1A1A] border-b border-[#262626]">
        <button
          onClick={() => nav(-1)}
          className="flex h-9 w-9 items-center justify-center text-[#ECECEC]"
          aria-label="返回"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="flex-1 text-center min-w-0 px-2">
          <div className="text-[15.5px] font-medium text-[#ECECEC] truncate">
            {contact.name}
            {contact.chatType === 'group' && (
              <span className="text-[#9A9A9A] ml-1 text-[14px] font-normal">
                ({contact.members?.length})
              </span>
            )}
          </div>
        </div>
        <button className="flex h-9 w-9 items-center justify-center text-[#ECECEC]">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* 关系上下文提醒（普通会话） */}
      {!isAI && contact.contextReminder && contextOpen && (
        <div className="px-3 pt-2.5">
          <YbInlineCard tone="default" title={contact.chatType === 'group' ? '元宝 · 群内回看' : '元宝 · 关系上下文'}>
            <div className="text-[12.5px] leading-relaxed text-[#D8D8D8]">
              {contact.contextReminder.short}
            </div>
            {contextExpanded && (
              <div className="mt-2 space-y-1.5 rounded-xl bg-black/30 p-2.5 border border-emerald-500/10">
                {contact.contextReminder.details.map((d) => (
                  <div key={d.label} className="flex gap-2 text-[11.5px]">
                    <span className="shrink-0 text-[#8A8A8A]">{d.label}：</span>
                    <span className="text-[#D8D8D8]">{d.content}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 flex items-center justify-between">
              <button
                onClick={() => setContextExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-400"
              >
                {contextExpanded ? (
                  <>
                    收起 <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    展开详情 <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fillSuggestion(contact.contextReminder!.openingSuggestion)}
                  className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-medium text-white"
                >
                  帮我接上话
                </button>
                <button
                  onClick={() => setContextOpen(false)}
                  className="text-[#9A9A9A]"
                  aria-label="关闭"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </YbInlineCard>
        </div>
      )}

      {/* 消息列表 */}
      <div ref={listRef} className="flex-1 overflow-y-auto px-3 pb-3 pt-3 thin-scroll">
        <div className="space-y-3">
          {messages
            .filter((m) => {
              // 过滤掉用户已"不再提醒"的 catchup 卡片 / 重提条
              if (m.ybBubble?.kind === 'catchup') {
                return !mutedCatchups.has(m.ybBubble.data.id);
              }
              if (m.ybBubble?.kind === 'catchup-nudge') {
                return !mutedCatchups.has(m.ybBubble.data.catchupId);
              }
              return true;
            })
            .map((m) => (
              <BubbleRow
                key={m.id}
                msg={m}
                contact={contact}
                onVoice={() => m.voiceIntent && setVoiceForId(m.id)}
                onLongPressStart={(e) => startLongPress(m, e)}
                onLongPressEnd={cancelLongPress}
                onContextMenu={(e) => openMenu(m, e)}
                onCatchupGo={(c) => {
                  sessionStorage.setItem('yb-prefill-' + c.targetContactId, c.suggestedReply);
                  nav(`/chat/${c.targetContactId}`);
                }}
                onCatchupFill={(c) => fillSuggestion(c.suggestedReply)}
                onCatchupMute={(catchupId) =>
                  setMutedCatchups((prev) => {
                    const next = new Set(prev);
                    next.add(catchupId);
                    return next;
                  })
                }
              />
            ))}
        </div>
      </div>

      {/* 隐形提词器（基于输入的浮层） */}
      {!isAI && suggestion && (
        <div className="px-3 pb-1">
          <YbInlineCard
            tone={suggestion.riskLevel === 'high' ? 'warn' : suggestion.riskLevel === 'mid' ? 'warm' : 'default'}
            title="元宝 · 隐形提词器"
          >
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium',
                  suggestion.riskLevel === 'high'
                    ? 'bg-rose-500/20 text-rose-300'
                    : suggestion.riskLevel === 'mid'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                )}
              >
                {suggestion.riskLevel === 'high'
                  ? '可能升级冲突'
                  : suggestion.riskLevel === 'mid'
                  ? '语气提醒'
                  : '小提示'}
              </span>
              <span className="text-[11px] text-[#9A9A9A]">{contact.relationTag}</span>
            </div>
            <div className="mt-1.5 text-[12.5px] leading-relaxed text-[#E0E0E0]">
              {suggestion.insight}
            </div>
            <div className="mt-2 space-y-1.5">
              {suggestion.replyDirections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => fillSuggestion(s)}
                  className="block w-full rounded-xl bg-black/30 border border-emerald-500/10 px-2.5 py-1.5 text-left text-[12px] leading-snug text-[#D8D8D8] hover:border-emerald-500/30"
                >
                  <span className="mr-1 font-medium text-emerald-400">
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-1.5 text-[10px] text-[#7A7A7A]">
              点击建议会填入输入框，但不会自动发送。
            </div>
          </YbInlineCard>
        </div>
      )}

      {/* 输入条 */}
      <div className="flex items-center gap-2 bg-[#1F1F1F] border-t border-[#262626] px-2 py-2">
        <button className="flex h-9 w-9 items-center justify-center text-[#ECECEC]">
          <Mic className="h-5 w-5" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          placeholder={
            isAI
              ? '问问元宝…'
              : contact.chatType === 'group'
              ? '@ 群成员或输入内容…'
              : ''
          }
          className="flex-1 rounded-md bg-[#2A2A2A] px-3 py-2 text-[14px] text-[#ECECEC] outline-none placeholder:text-[#6E6E6E]"
        />
        <button className="flex h-9 w-9 items-center justify-center text-[#ECECEC]">
          <Smile className="h-5 w-5" />
        </button>
        {input.trim() ? (
          <button
            onClick={onSend}
            className="flex h-9 items-center gap-1 rounded-md bg-emerald-500 px-3 text-[13px] font-medium text-white"
          >
            <Send className="h-3.5 w-3.5" />
            发送
          </button>
        ) : (
          <button className="flex h-9 w-9 items-center justify-center text-[#ECECEC]">
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 潜台词弹层 - 极简版 */}
      {latentMsg && latentData && (
        <LatentSheet
          msg={latentMsg}
          data={latentData}
          onClose={() => setLatentForId(null)}
          onPick={(s) => {
            fillSuggestion(s);
            setLatentForId(null);
          }}
        />
      )}

      {/* 语音意图弹层 */}
      {voiceMsg?.voiceIntent && (
        <BottomSheet
          onClose={() => {
            setVoiceForId(null);
            setShowRawId(null);
          }}
          title="元宝 · 语音转成人话"
        >
          <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#222] p-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Play className="h-3.5 w-3.5" />
            </div>
            <div className="text-[12.5px] text-[#D8D8D8]">
              {voiceMsg.sender} · 语音 {voiceMsg.voiceSeconds}″
            </div>
          </div>

          <SectionDark label="核心意思">{voiceMsg.voiceIntent.coreMeaning}</SectionDark>
          <SectionDark label="对方情绪">{voiceMsg.voiceIntent.emotion}</SectionDark>

          {voiceMsg.voiceIntent.keyPoints && (
            <SectionDark label="关键点">
              <ul className="space-y-1">
                {voiceMsg.voiceIntent.keyPoints.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </SectionDark>
          )}

          <SectionDark label="是否需要你做什么">
            <ul className="space-y-1.5">
              {voiceMsg.voiceIntent.needAction.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 inline-block rounded bg-emerald-500/20 text-emerald-300 px-1.5 text-[10px]">
                    待办
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </SectionDark>

          {voiceMsg.voiceIntent.relatedToMe && (
            <SectionDark label="和你有关">{voiceMsg.voiceIntent.relatedToMe}</SectionDark>
          )}

          <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <div className="text-[11.5px] font-medium text-emerald-300">建议回复</div>
            <div className="mt-1 text-[13px] leading-relaxed text-[#ECECEC]">
              {voiceMsg.voiceIntent.suggestedReply}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => {
                  fillSuggestion(voiceMsg.voiceIntent!.suggestedReply);
                  setVoiceForId(null);
                }}
                className="rounded-full bg-emerald-500 px-3 py-1 text-[11.5px] font-medium text-white"
              >
                填入输入框
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowRawId((v) => (v === voiceMsg.id ? null : voiceMsg.id))}
            className="text-[11px] text-[#9A9A9A] underline"
          >
            {showRawId === voiceMsg.id ? '收起原始转写' : '查看原始转写'}
          </button>
          {showRawId === voiceMsg.id && (
            <div className="mt-2 rounded-xl bg-[#222] p-2.5 text-[11.5px] leading-relaxed text-[#C8C8C8]">
              {voiceMsg.voiceIntent.rawTranscript}
            </div>
          )}
        </BottomSheet>
      )}

      {/* 右键 / 长按 菜单 */}
      {menuFor && (() => {
        const m = messages.find((x) => x.id === menuFor.id);
        if (!m) return null;
        return (
          <MessageContextMenu
            x={menuFor.x}
            y={menuFor.y}
            onClose={closeMenu}
            onLatent={() => {
              closeMenu();
              setLatentForId(m.id);
            }}
            onCopy={() => onCopy(m.content)}
            onReply={() => onReply(m.content)}
            isMine={m.isMine}
          />
        );
      })()}
    </div>
  );
}

/* ================== 单条消息（含元宝 AI 富气泡） ================== */
function BubbleRow({
  msg,
  contact,
  onVoice,
  onLongPressStart,
  onLongPressEnd,
  onContextMenu,
  onCatchupGo,
  onCatchupFill,
  onCatchupMute,
}: {
  msg: Message;
  contact: Contact;
  onVoice: () => void;
  onLongPressStart: (e: React.PointerEvent) => void;
  onLongPressEnd: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onCatchupGo: (c: CatchupCard) => void;
  onCatchupFill: (c: CatchupCard) => void;
  onCatchupMute: (catchupId: string) => void;
}) {
  // 系统/时间分隔
  if (msg.type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] text-[#6E6E6E] bg-[#222]/40 px-2 py-0.5 rounded">
          {msg.systemText}
        </span>
      </div>
    );
  }

  const mine = msg.isMine;
  const isGroup = contact.chatType === 'group';
  const sender = contact.members?.find((x) => x.name === msg.sender);
  const avatar = mine ? '🙂' : sender?.avatar ?? contact.avatar;
  const avatarBg = mine ? 'bg-emerald-500/20' : sender?.bg ?? contact.avatarBg;

  return (
    <div className={clsx('flex gap-2', mine ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={clsx(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] text-[20px]',
          avatarBg
        )}
      >
        {avatar}
      </div>
      <div className={clsx('max-w-[78%] flex flex-col', mine ? 'items-end' : 'items-start')}>
        {isGroup && !mine && (
          <div className="mb-0.5 text-[10.5px] text-[#7A7A7A] px-1">{msg.sender}</div>
        )}

        {/* 元宝 AI 富气泡 */}
        {msg.ybBubble?.kind === 'brief' && <BriefBubble data={msg.ybBubble.data} />}
        {msg.ybBubble?.kind === 'catchup' &&
          (() => {
            const cu = msg.ybBubble.data;
            return (
              <CatchupBubble
                data={cu}
                onGo={() => onCatchupGo(cu)}
                onFill={() => onCatchupFill(cu)}
                onMute={() => onCatchupMute(cu.id)}
              />
            );
          })()}
        {msg.ybBubble?.kind === 'catchup-nudge' &&
          (() => {
            const nudge = msg.ybBubble.data;
            const cu = catchupCards.find((c) => c.id === nudge.catchupId);
            if (!cu) return null;
            return (
              <CatchupNudgeBubble
                data={cu}
                round={nudge.round}
                onGo={() => onCatchupGo(cu)}
                onMute={() => onCatchupMute(cu.id)}
              />
            );
          })()}
        {msg.ybBubble?.kind === 'tip' && (
          <TipBubble title={msg.ybBubble.title} body={msg.ybBubble.body} />
        )}

        {/* 普通文字气泡 */}
        {msg.type === 'text' && !msg.ybBubble && (
          <div
            onPointerDown={onLongPressStart}
            onPointerUp={onLongPressEnd}
            onPointerLeave={onLongPressEnd}
            onPointerCancel={onLongPressEnd}
            onContextMenu={onContextMenu}
            className={clsx(
              'rounded-[8px] px-3 py-2 text-[15px] leading-relaxed select-none cursor-default',
              mine
                ? 'bg-[#3D9D54] text-white'
                : 'bg-[#2C2C2C] text-[#ECECEC]'
            )}
          >
            {msg.content}
          </div>
        )}

        {/* 语音 */}
        {msg.type === 'voice' && (
          <div className="flex items-center gap-2">
            <div
              onPointerDown={onLongPressStart}
              onPointerUp={onLongPressEnd}
              onPointerLeave={onLongPressEnd}
              onPointerCancel={onLongPressEnd}
              onContextMenu={onContextMenu}
              className={clsx(
                'flex w-[150px] items-center gap-2 rounded-[8px] px-3 py-2.5 select-none cursor-default',
                mine ? 'bg-[#3D9D54] text-white' : 'bg-[#2C2C2C] text-[#ECECEC]'
              )}
            >
              <Play className="h-3.5 w-3.5 shrink-0" />
              <div className="flex-1">
                <div className="flex h-2 items-center gap-0.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <span
                      key={i}
                      className="block w-0.5 rounded-full bg-current opacity-60"
                      style={{ height: 4 + ((i * 7) % 9) }}
                    />
                  ))}
                </div>
                <div className="mt-0.5 text-[10.5px] opacity-80">{msg.voiceSeconds}″</div>
              </div>
            </div>
            {msg.voiceIntent && !mine && (
              <button
                onClick={onVoice}
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 text-[10.5px] font-medium text-emerald-300"
              >
                <Sparkles className="h-3 w-3" />
                元宝听懂
              </button>
            )}
          </div>
        )}

        <div
          className={clsx(
            'mt-1 text-[10px] text-[#6E6E6E] px-1',
            mine ? 'text-right' : 'text-left'
          )}
        >
          {msg.timestamp}
        </div>
      </div>
    </div>
  );
}

/* ================== 元宝 AI 三种富气泡（黑底） ================== */
function YbBubbleFrame({
  children,
  badge,
  title,
  subtitle,
  tone = 'default',
}: {
  children: React.ReactNode;
  badge?: string;
  title: string;
  subtitle?: string;
  tone?: 'default' | 'warn';
}) {
  const frame =
    tone === 'warn'
      ? 'border-rose-500/40 from-[#2A1417] to-[#1A0E10]'
      : 'border-emerald-500/25 from-[#152620] to-[#0F1A18]';
  const dot = tone === 'warn' ? 'bg-rose-500' : 'bg-emerald-500';
  const titleColor = tone === 'warn' ? 'text-rose-300' : 'text-emerald-300';
  const badgeColor =
    tone === 'warn'
      ? 'bg-rose-500/25 text-rose-200'
      : 'bg-emerald-500/20 text-emerald-200';
  return (
    <div className={`rounded-[14px] border bg-gradient-to-br p-3 w-[300px] max-w-full ${frame}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${dot}`}>
          <Sparkles className="h-3 w-3" />
        </div>
        <div className={`text-[12px] font-medium ${titleColor}`}>{title}</div>
        {badge && (
          <span className={`ml-auto text-[10px] rounded-full px-1.5 py-[1px] ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="text-[11px] text-[#9A9A9A] mb-1.5">{subtitle}</div>
      )}
      {children}
    </div>
  );
}

function BriefBubble({ data }: { data: DailyBriefCard }) {
  return (
    <YbBubbleFrame title="今日早间汇总" badge={`${data.pendingCount} 条待回`}>
      <div className="text-[12.5px] text-[#D8D8D8] mb-2">
        <span className="text-[#9A9A9A] mr-1">{data.date}</span>
        {data.greeting}
      </div>
      <div className="space-y-1.5">
        {data.highlights.map((s, i) => {
          const stale = s.startsWith('⚠️');
          const text = stale ? s.replace(/^⚠️\s*/, '') : s;
          return (
            <div
              key={i}
              className={`flex gap-2 text-[12px] leading-relaxed ${
                stale ? 'text-rose-200' : 'text-[#E0E0E0]'
              }`}
            >
              <span
                className={`shrink-0 ${stale ? 'text-rose-400' : 'text-emerald-400'}`}
              >
                {stale ? '⚠️' : `${i + 1}.`}
              </span>
              <span className="flex-1">{text}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[10px] text-[#6E6E6E]">
        ⚠️ = 已超过 24 小时未回 · 之后每 3h 我会单独再轻提你一下
      </div>
    </YbBubbleFrame>
  );
}

function CatchupBubble({
  data,
  onGo,
  onFill,
  onMute,
}: {
  data: CatchupCard;
  onGo: () => void;
  onFill: () => void;
  onMute: () => void;
}) {
  const isStale = data.hoursPending >= 24;
  const urgencyColor =
    data.urgency === 'high'
      ? 'text-rose-300 bg-rose-500/15 border-rose-500/30'
      : data.urgency === 'mid'
      ? 'text-amber-300 bg-amber-500/15 border-amber-500/30'
      : 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
  return (
    <YbBubbleFrame
      tone={isStale ? 'warn' : 'default'}
      title={`漏回提醒 · ${data.relationLabel}`}
      badge={
        isStale
          ? `已搁置 ${data.hoursPending}h`
          : data.urgency === 'high'
          ? '建议尽快'
          : data.urgency === 'mid'
          ? '今天回'
          : '不急'
      }
    >
      <div
        className={`rounded-xl p-2.5 ${
          isStale
            ? 'bg-rose-500/[0.06] border border-rose-500/30'
            : 'bg-black/30 border border-white/5'
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`flex h-7 w-7 items-center justify-center rounded-md text-base ${data.senderBg}`}>
            {data.senderAvatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] text-[#ECECEC] truncate">{data.sender}</div>
            <div
              className={`text-[10px] flex items-center gap-1 ${
                isStale ? 'text-rose-300 font-medium' : 'text-[#7A7A7A]'
              }`}
            >
              {isStale && <AlarmClock className="h-2.5 w-2.5" />}
              {data.receivedAgo}
              {isStale && <span>· 超过 24h</span>}
            </div>
          </div>
          <span className={`text-[10px] rounded-full border px-1.5 py-[1px] ${urgencyColor}`}>
            {data.urgency === 'high' ? '高' : data.urgency === 'mid' ? '中' : '低'}
          </span>
        </div>
        <div
          className={`text-[12.5px] leading-relaxed ${
            isStale ? 'text-rose-100' : 'text-[#D8D8D8]'
          }`}
        >
          「{data.originalMessage}」
        </div>
      </div>

      <div className="mt-2 text-[11.5px] text-[#9A9A9A] leading-relaxed">
        <span className={isStale ? 'text-rose-300' : 'text-emerald-300'}>为什么提你：</span>
        {data.reason}
      </div>

      <div
        className={`mt-2 rounded-xl p-2.5 ${
          isStale
            ? 'bg-rose-500/10 border border-rose-500/30'
            : 'bg-emerald-500/10 border border-emerald-500/25'
        }`}
      >
        <div
          className={`text-[10.5px] mb-0.5 ${
            isStale ? 'text-rose-300' : 'text-emerald-300'
          }`}
        >
          建议回复
        </div>
        <div className="text-[12.5px] text-[#ECECEC] leading-relaxed">
          {data.suggestedReply}
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={onGo}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full text-white text-[12px] font-medium py-1.5 ${
            isStale ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        >
          帮我打开并填好
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onFill}
          className="rounded-full bg-white/5 border border-white/10 text-[#D8D8D8] text-[11.5px] py-1.5 px-3"
        >
          只看不回
        </button>
      </div>

      <button
        onClick={onMute}
        className="mt-2 w-full inline-flex items-center justify-center gap-1 text-[10.5px] text-[#7A7A7A] hover:text-[#B8B8B8] py-1"
      >
        <BellOff className="h-3 w-3" />
        不再提醒这条
      </button>
    </YbBubbleFrame>
  );
}

/** 3 小时单条重提：极简的细窄条，不重复完整卡片 */
function CatchupNudgeBubble({
  data,
  round,
  onGo,
  onMute,
}: {
  data: CatchupCard;
  round: number;
  onGo: () => void;
  onMute: () => void;
}) {
  const isStale = data.hoursPending >= 24;
  return (
    <div
      className={`w-[300px] max-w-full rounded-[12px] border px-3 py-2 ${
        isStale
          ? 'border-rose-500/35 bg-rose-500/[0.07]'
          : 'border-emerald-500/25 bg-emerald-500/[0.05]'
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${
            isStale ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        >
          <AlarmClock className="h-2.5 w-2.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11.5px] text-[#D8D8D8] leading-snug">
            <span className={isStale ? 'text-rose-300 font-medium' : 'text-emerald-300 font-medium'}>
              第 {round} 次重提（每 3h）
            </span>
            <span className="mx-1 text-[#5A5A5A]">·</span>
            <span className="text-[#9A9A9A]">{data.sender}</span>
            <span className="mx-1 text-[#5A5A5A]">·</span>
            <span className={isStale ? 'text-rose-300' : 'text-[#9A9A9A]'}>
              已搁置 {data.hoursPending}h
            </span>
          </div>
          <div className="mt-0.5 text-[11px] text-[#9A9A9A] truncate">
            「{data.originalMessage}」
          </div>
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <button
          onClick={onGo}
          className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full text-white text-[11px] font-medium py-1 ${
            isStale ? 'bg-rose-500' : 'bg-emerald-500'
          }`}
        >
          这就回 <ArrowRight className="h-3 w-3" />
        </button>
        <button
          onClick={onMute}
          className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 text-[#9A9A9A] text-[10.5px] py-1 px-2.5 hover:text-[#D8D8D8]"
        >
          <BellOff className="h-2.5 w-2.5" />
          不再提醒
        </button>
      </div>
    </div>
  );
}

function TipBubble({ title, body }: { title: string; body: string }) {
  return (
    <YbBubbleFrame title={title}>
      <div className="text-[12.5px] text-[#D8D8D8] leading-relaxed">{body}</div>
    </YbBubbleFrame>
  );
}

/* ================== 内联深色卡片（提词器、上下文条） ================== */
function YbInlineCard({
  children,
  title,
  tone = 'default',
}: {
  children: React.ReactNode;
  title: string;
  tone?: 'default' | 'warm' | 'warn';
}) {
  const border =
    tone === 'warn'
      ? 'border-rose-500/30 from-[#2A1A1B] to-[#1F1314]'
      : tone === 'warm'
      ? 'border-amber-500/30 from-[#2A2218] to-[#1F1A14]'
      : 'border-emerald-500/25 from-[#152620] to-[#0F1A18]';
  const dot =
    tone === 'warn' ? 'bg-rose-400' : tone === 'warm' ? 'bg-amber-400' : 'bg-emerald-500';
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-3 yb-fade-up ${border}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className={`flex h-5 w-5 items-center justify-center rounded-full text-white ${dot}`}>
          <Sparkles className="h-3 w-3" />
        </div>
        <div className="text-[12px] font-medium text-[#ECECEC]">{title}</div>
        <span className="text-[10px] text-[#7A7A7A]">· 只对你可见</span>
      </div>
      {children}
    </div>
  );
}

function SectionDark({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="mb-1 text-[11px] font-medium text-[#9A9A9A]">{label}</div>
      <div className="text-[12.5px] leading-relaxed text-[#E0E0E0]">{children}</div>
    </div>
  );
}

function BottomSheet({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/60">
      <div className="flex-1" onClick={onClose} />
      <div className="yb-slide-up rounded-t-3xl bg-[#1A1A1A] border-t border-emerald-500/20 px-4 pb-5 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="text-[13px] font-medium text-[#ECECEC]">{title}</div>
            <span className="text-[10px] text-[#7A7A7A]">· 只对你可见</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/5"
          >
            <X className="h-4 w-4 text-[#9A9A9A]" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pb-1 thin-scroll">{children}</div>
      </div>
    </div>
  );
}

/* ================== 右键 / 长按 菜单 ================== */
function MessageContextMenu({
  x,
  y,
  isMine,
  onClose,
  onLatent,
  onCopy,
  onReply,
}: {
  x: number;
  y: number;
  isMine: boolean;
  onClose: () => void;
  onLatent: () => void;
  onCopy: () => void;
  onReply: () => void;
}) {
  // 把菜单约束在视口内：菜单宽 ~190、高 ~150
  const W = 200;
  const H = 168;
  const left = Math.min(Math.max(8, x), window.innerWidth - W - 8);
  const top = Math.min(Math.max(60, y), window.innerHeight - H - 8);

  return (
    <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }}>
      <div
        className="absolute yb-fade-up rounded-xl bg-[#262626] border border-white/10 shadow-2xl py-1 w-[200px]"
        style={{ left, top }}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuRow icon={<Brain className="h-4 w-4" />} accent onClick={onLatent}>
          元宝读懂潜台词
        </MenuRow>
        <div className="my-1 h-px bg-white/5" />
        <MenuRow icon={<Reply className="h-4 w-4" />} onClick={onReply} disabled={isMine}>
          引用回复
        </MenuRow>
        <MenuRow icon={<Copy className="h-4 w-4" />} onClick={onCopy}>
          复制
        </MenuRow>
      </div>
    </div>
  );
}

function MenuRow({
  icon,
  children,
  accent,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  accent?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-left',
        accent ? 'text-emerald-300 hover:bg-emerald-500/10' : 'text-[#ECECEC] hover:bg-white/5',
        disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
      )}
    >
      <span className={accent ? 'text-emerald-400' : 'text-[#9A9A9A]'}>{icon}</span>
      {children}
    </button>
  );
}

/* ================== 极简潜台词 Sheet ================== */
function LatentSheet({
  msg,
  data,
  onClose,
  onPick,
}: {
  msg: Message;
  data: LatentMeaning;
  onClose: () => void;
  onPick: (s: string) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/60">
      <div className="flex-1" onClick={onClose} />
      <div className="yb-slide-up rounded-t-3xl bg-[#1A1A1A] border-t border-emerald-500/20 px-4 pb-5 pt-4">
        {/* drag handle */}
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-white/15" />

        {/* 顶部品牌行 */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Brain className="h-3 w-3" />
            </div>
            <div className="text-[13px] font-medium text-[#ECECEC]">读懂潜台词</div>
            <span className="text-[10px] text-[#7A7A7A]">· 只对你可见</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/5"
          >
            <X className="h-4 w-4 text-[#9A9A9A]" />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto thin-scroll pb-1">
          {/* 引用气泡 */}
          <div className="mb-4 rounded-xl bg-[#222] px-3 py-2.5 border-l-2 border-emerald-500/60">
            <div className="text-[10.5px] text-[#7A7A7A] mb-0.5">{msg.sender}</div>
            {msg.type === 'voice' ? (
              <div className="flex items-center gap-2 text-[13px] text-[#D8D8D8]">
                <Play className="h-3.5 w-3.5 text-emerald-400" />
                <span>语音 {msg.voiceSeconds ?? '—'}″</span>
                {msg.voiceIntent && (
                  <span className="text-[11px] text-[#7A7A7A] truncate">
                    · {msg.voiceIntent.coreMeaning}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[13px] leading-relaxed text-[#D8D8D8]">{msg.content}</div>
            )}
          </div>

          {/* 一句话总结（取第一条意图） */}
          <div className="mb-4">
            <div className="text-[11px] text-emerald-400/90 mb-1">他可能想说的是</div>
            <div className="text-[15px] leading-relaxed text-[#ECECEC] font-medium">
              {data.intentions[0]}
            </div>
          </div>

          {/* 其他可能性 */}
          {data.intentions.length > 1 && (
            <div className="mb-4 rounded-xl bg-[#1F1F1F] px-3 py-2.5">
              <div className="text-[11px] text-[#9A9A9A] mb-1.5">也可能</div>
              <ul className="space-y-1.5">
                {data.intentions.slice(1).map((s, i) => (
                  <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-[#C8C8C8]">
                    <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-[#6E6E6E]" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 风险一行 */}
          <div className="mb-4 flex gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2 text-[12px] leading-relaxed text-amber-200/90">
            <span className="shrink-0">⚠️</span>
            <span>{data.riskNote}</span>
          </div>

          {/* 回复建议 */}
          <div className="mb-1.5 flex items-center justify-between">
            <div className="text-[12px] font-medium text-[#ECECEC]">这样回比较稳</div>
            <span className="text-[10px] text-[#7A7A7A]">点一下填进输入框</span>
          </div>
          <div className="space-y-1.5">
            {data.saferReplies.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setPicked(i);
                  setTimeout(() => onPick(s), 140);
                }}
                className={clsx(
                  'w-full flex items-start gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] leading-relaxed transition-colors',
                  picked === i
                    ? 'bg-emerald-500/30 border border-emerald-400 text-white'
                    : 'bg-[#1F1F1F] border border-white/5 text-[#E0E0E0] hover:bg-emerald-500/10 hover:border-emerald-500/30'
                )}
              >
                <span className="mt-0.5 shrink-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                  {picked === i ? <Check className="h-2.5 w-2.5" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{s}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 text-center text-[10.5px] text-[#6E6E6E]">
            元宝只给可能性，最终怎么回，你定。
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================== 兜底潜台词（没预置数据时） ================== */
function buildFallbackLatent(msg: Message, contact: Contact): LatentMeaning {
  // 语音消息：基于 voiceIntent 现有内容兜底
  if (msg.type === 'voice') {
    const vi = msg.voiceIntent;
    if (vi) {
      return {
        intentions: [
          vi.coreMeaning,
          vi.emotion ? `语气感觉：${vi.emotion}` : '也可能只是顺口说一句，没特别情绪。',
        ],
        riskNote: '语音信息容易丢上下文，回前先确认对方是不是真的有事要你处理。',
        saferReplies: [vi.suggestedReply, '我先听一下，等下文字回你～'],
      };
    }
    return {
      intentions: [
        '这是一段语音，元宝还没听到具体内容，先按情境给你建议。',
        '如果方便，可以让对方补一句文字，省得来回试错。',
      ],
      riskNote: '没听清就回容易答非所问，语气也容易跑偏。',
      saferReplies: [
        '稍等我先听一下～',
        '不好意思现在外面不方便听语音，能打几个字吗？',
      ],
    };
  }

  const text = msg.content;
  if (msg.isMine) {
    return {
      intentions: [
        '这是你刚才说的话，元宝帮你回看一下当时的语气。',
        '如果对方没回或反应冷淡，可能是这句太硬或信息量太大。',
      ],
      riskNote: '回看自己的话时，关注"是不是替对方做决定"或"语气是不是带情绪"。',
      saferReplies: [
        '刚刚那句可能说得急了，我换种方式说一下：',
        '我再想了下，其实更想表达的是…',
      ],
    };
  }
  const tag = contact.relationTag || '对方';
  return {
    intentions: [
      `${tag}说"${text.length > 14 ? text.slice(0, 14) + '…' : text}"，表面是陈述，但更像在试探你的反应。`,
      '也可能只是随口一说，并没有藏深意，别想太多。',
    ],
    riskNote: '没有上下文时，避免直接下判断或反问"什么意思"，容易让对方紧绷。',
    saferReplies: [
      '嗯嗯我看到了，你是想说…对吗？',
      '能多讲两句吗，我想确认下你的意思。',
      '收到～等下我们当面/电话聊一下？',
    ],
  };
}

