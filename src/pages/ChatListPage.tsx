import { Link } from 'react-router-dom';
import { Search, Plus, Sparkles } from 'lucide-react';
import { contacts } from '../data/contacts';
import { StatusBar } from '../components/StatusBar';

export function ChatListPage() {
  const totalUnread = contacts.reduce((s, c) => s + (c.unread ?? 0), 0);

  return (
    <div className="flex h-full flex-col bg-[#111] text-[#ECECEC]">
      <StatusBar />

      {/* 导航条 */}
      <div className="px-4 pb-2 pt-1 flex items-center justify-between">
        <div className="text-[18px] font-semibold tracking-tight">
          微信{totalUnread > 0 && (
            <span className="ml-1 text-[14px] font-normal text-[#9A9A9A]">
              ({totalUnread})
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Search className="h-5 w-5 text-[#ECECEC]" strokeWidth={2} />
          <Plus className="h-5 w-5 text-[#ECECEC]" strokeWidth={2} />
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-1.5 rounded-md bg-[#1F1F1F] px-2.5 py-1.5 text-[13px] text-[#6E6E6E]">
          <Search className="h-3.5 w-3.5" />
          搜索
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto thin-scroll">
        {contacts.map((c, idx) => (
          <Link
            to={`/chat/${c.id}`}
            key={c.id}
            className="flex items-stretch gap-3 px-3.5 py-2.5 active:bg-[#1A1A1A] relative"
          >
            {/* 头像 */}
            <div className="relative shrink-0">
              <div
                className={`flex h-[46px] w-[46px] items-center justify-center rounded-[8px] text-[22px] ${c.avatarBg} ${
                  c.isAI ? 'ring-1 ring-emerald-500/40' : ''
                }`}
              >
                {c.avatar}
              </div>
              {/* 未读小红点（贴右上） */}
              {c.unread ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FA5151] text-white text-[10.5px] font-semibold flex items-center justify-center ring-2 ring-[#111]">
                  {c.unread > 99 ? '99+' : c.unread}
                </span>
              ) : null}
              {c.isAI && (
                <span className="absolute -bottom-1 -right-1 h-[16px] w-[16px] rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center ring-2 ring-[#111]">
                  <Sparkles className="h-2.5 w-2.5" />
                </span>
              )}
            </div>

            {/* 文本 */}
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="truncate text-[16px] font-medium text-[#ECECEC]">
                    {c.name}
                  </div>
                  {c.isAI && (
                    <span className="shrink-0 rounded-[3px] bg-emerald-600/20 text-emerald-400 text-[9.5px] px-1 py-[1px] font-medium">
                      AI
                    </span>
                  )}
                </div>
                <div className="shrink-0 text-[11px] text-[#6E6E6E]">{c.lastTime}</div>
              </div>
              <div className="mt-0.5 flex items-center justify-between gap-2">
                <div className="truncate text-[12.5px] text-[#9A9A9A]">
                  {c.unread && !c.isAI ? (
                    <span className="text-[#FA5151] mr-0.5">[{c.unread}条]</span>
                  ) : null}
                  {c.lastPreview}
                </div>
                {c.muted && (
                  <span className="shrink-0 text-[10px] text-[#6E6E6E]">🔕</span>
                )}
              </div>
            </div>

            {/* 置顶高亮 */}
            {c.pinned && (
              <span className="absolute left-0 top-0 h-full w-[2px] bg-emerald-500/60" />
            )}

            {/* 分割线（除最后一个） */}
            {idx < contacts.length - 1 && (
              <span className="absolute left-[68px] right-0 bottom-0 h-px bg-[#1F1F1F]" />
            )}
          </Link>
        ))}

        <div className="text-center text-[11px] text-[#4A4A4A] py-4">
          以上是全部消息
        </div>
      </div>
    </div>
  );
}
