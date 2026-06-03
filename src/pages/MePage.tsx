import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Wallet,
  Heart,
  Image as ImageIcon,
  Sticker,
  Settings,
  Sparkles,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

type Row = {
  icon: React.ReactNode;
  bg: string;
  label: string;
  trailing?: React.ReactNode;
  to?: string;
};

export function MePage() {
  const groups: Row[][] = [
    [
      {
        icon: <Sparkles className="h-4 w-4 text-white" />,
        bg: 'bg-emerald-500',
        label: '元宝 · 我的社交日报',
        to: '/chat/yuanbao',
        trailing: (
          <span className="rounded-full bg-rose-500 text-white text-[10px] px-1.5 py-[1px]">4</span>
        ),
      },
      {
        icon: <ShieldCheck className="h-4 w-4 text-white" />,
        bg: 'bg-blue-500',
        label: '元宝 · 隐私守门设置',
        trailing: <span className="text-[11px] text-[#7A7A7A]">朋友圈/聊天</span>,
      },
      {
        icon: <Bell className="h-4 w-4 text-white" />,
        bg: 'bg-amber-500',
        label: '元宝 · 推送时段',
        trailing: <span className="text-[11px] text-[#7A7A7A]">每天 8:15</span>,
      },
    ],
    [
      {
        icon: <Wallet className="h-4 w-4 text-white" />,
        bg: 'bg-emerald-600',
        label: '服务',
      },
      {
        icon: <Heart className="h-4 w-4 text-white" />,
        bg: 'bg-rose-500',
        label: '收藏',
      },
      {
        icon: <ImageIcon className="h-4 w-4 text-white" />,
        bg: 'bg-blue-500',
        label: '朋友圈',
        to: '/moments',
      },
      {
        icon: <Sticker className="h-4 w-4 text-white" />,
        bg: 'bg-yellow-500',
        label: '表情',
      },
    ],
    [
      {
        icon: <Settings className="h-4 w-4 text-white" />,
        bg: 'bg-slate-500',
        label: '设置',
      },
    ],
  ];

  return (
    <div className="flex h-full flex-col bg-[#111] text-[#ECECEC]">
      <StatusBar />

      <div className="flex-1 overflow-y-auto thin-scroll">
        {/* 个人卡 */}
        <div className="bg-[#161616] px-4 py-5 flex items-center gap-3">
          <div className="flex h-[60px] w-[60px] items-center justify-center rounded-md bg-emerald-500/20 text-3xl">
            🙂
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[18px] font-semibold">我</div>
            <div className="text-[12px] text-[#7A7A7A] mt-0.5">微信号：me_yuanbao</div>
            <div className="text-[12px] text-[#7A7A7A] mt-0.5">+ 状态</div>
          </div>
          <ChevronRight className="h-4 w-4 text-[#5A5A5A]" />
        </div>

        {/* 元宝小卡 - 关于元宝 */}
        <div className="mx-3 my-3 rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#152620] to-[#0F1A18] p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="text-[13px] font-medium text-emerald-300">关于元宝</div>
            <span className="ml-auto text-[10px] text-[#7A7A7A]">v0.1 内测</span>
          </div>
          <div className="text-[12.5px] text-[#D8D8D8] leading-relaxed">
            元宝是只属于你的"社交安全带"——
            每天主动告诉你哪些消息漏回了、长按帮你读懂潜台词、
            发朋友圈时悄悄替你检查隐私。所有提示只对你可见。
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Stat label="今天提醒" value="4" />
            <Stat label="本周帮回" value="12" />
            <Stat label="拦截尴尬" value="3" />
          </div>
        </div>

        {groups.map((g, gi) => (
          <div key={gi} className="bg-[#161616] mt-3">
            {g.map((r, i) => (
              <RowItem key={i} row={r} divider={i < g.length - 1} />
            ))}
          </div>
        ))}

        <div className="text-center text-[11px] text-[#4A4A4A] py-8">
          元宝 · 让微信更懂你
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-xl bg-black/30 border border-emerald-500/15 py-1.5 text-center">
      <div className="text-[15px] font-semibold text-emerald-300">{value}</div>
      <div className="text-[10px] text-[#9A9A9A]">{label}</div>
    </div>
  );
}

function RowItem({ row, divider }: { row: Row; divider: boolean }) {
  const inner = (
    <div className="flex items-center gap-3 px-3.5 py-2.5 relative">
      <div className={`flex h-7 w-7 items-center justify-center rounded-[6px] ${row.bg}`}>
        {row.icon}
      </div>
      <div className="flex-1 text-[14.5px]">{row.label}</div>
      {row.trailing}
      <ChevronRight className="h-4 w-4 text-[#5A5A5A] ml-1" />
      {divider && (
        <span className="absolute left-[54px] right-0 bottom-0 h-px bg-[#1F1F1F]" />
      )}
    </div>
  );
  if (row.to) {
    return <Link to={row.to}>{inner}</Link>;
  }
  return inner;
}
