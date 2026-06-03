import { Search, Users, UserPlus, Tag, ChevronRight } from 'lucide-react';
import { contacts } from '../data/contacts';
import { StatusBar } from '../components/StatusBar';

const FUNCS = [
  { icon: <UserPlus className="h-5 w-5 text-white" />, bg: 'bg-emerald-500', label: '新的朋友' },
  { icon: <Users className="h-5 w-5 text-white" />, bg: 'bg-blue-500', label: '群聊' },
  { icon: <Tag className="h-5 w-5 text-white" />, bg: 'bg-orange-500', label: '标签' },
];

export function ContactsPage() {
  // 取私聊联系人，简单按拼音首字母分组（mock）
  const friends = contacts
    .filter((c) => c.chatType !== 'group' && !c.isAI && !c.isOfficial)
    .sort((a, b) => a.name.localeCompare(b.name, 'zh'));

  return (
    <div className="flex h-full flex-col bg-[#111] text-[#ECECEC]">
      <StatusBar />

      <div className="px-4 pb-2 pt-1 flex items-center justify-between">
        <div className="text-[18px] font-semibold">通讯录</div>
        <div className="flex items-center gap-4">
          <Search className="h-5 w-5" />
          <UserPlus className="h-5 w-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll">
        {/* 功能入口 */}
        <div className="bg-[#161616]">
          {FUNCS.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3.5 py-3 relative"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-md ${f.bg}`}>
                {f.icon}
              </div>
              <div className="flex-1 text-[15px]">{f.label}</div>
              <ChevronRight className="h-4 w-4 text-[#6E6E6E]" />
              {i < FUNCS.length - 1 && (
                <span className="absolute left-[60px] right-0 bottom-0 h-px bg-[#1F1F1F]" />
              )}
            </div>
          ))}
        </div>

        {/* 元宝节点（特殊入口） */}
        <div className="mt-3 px-3.5 text-[12px] text-[#7A7A7A]">AI 助手</div>
        <div className="bg-[#161616] mt-1">
          {contacts
            .filter((c) => c.isAI)
            .map((c) => (
              <a
                key={c.id}
                href={`#/chat/${c.id}`}
                className="flex items-center gap-3 px-3.5 py-3"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-md text-xl ${c.avatarBg}`}>
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-[15px]">{c.name}</div>
                  <div className="text-[11px] text-[#7A7A7A]">{c.relationDescription}</div>
                </div>
                <span className="text-[10px] rounded-full bg-emerald-500/20 text-emerald-300 px-1.5 py-[1px]">
                  AI
                </span>
              </a>
            ))}
        </div>

        {/* 联系人列表 */}
        <div className="mt-3 px-3.5 text-[12px] text-[#7A7A7A]">朋友（{friends.length}）</div>
        <div className="bg-[#161616] mt-1">
          {friends.map((c, i) => (
            <a
              key={c.id}
              href={`#/chat/${c.id}`}
              className="flex items-center gap-3 px-3.5 py-2.5 relative"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-md text-xl ${c.avatarBg}`}>
                {c.avatar}
              </div>
              <div className="flex-1 text-[15px]">{c.name}</div>
              {i < friends.length - 1 && (
                <span className="absolute left-[60px] right-0 bottom-0 h-px bg-[#1F1F1F]" />
              )}
            </a>
          ))}
        </div>

        <div className="text-center text-[11px] text-[#4A4A4A] py-6">
          {friends.length} 位联系人
        </div>
      </div>
    </div>
  );
}
