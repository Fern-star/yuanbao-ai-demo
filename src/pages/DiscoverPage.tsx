import { Link } from 'react-router-dom';
import {
  Camera,
  Compass,
  Radio,
  ScanLine,
  Wallet,
  Search,
  ShoppingBag,
  Gamepad2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

type Item = {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  to?: string;
  badge?: string;
  subtitle?: string;
};

export function DiscoverPage() {
  const groups: Item[][] = [
    [
      {
        icon: <Camera className="h-5 w-5 text-white" />,
        iconBg: 'bg-orange-500',
        label: '朋友圈',
        to: '/moments',
        subtitle: '林小满 · 今天的咖啡店光线刚刚好',
      },
    ],
    [
      {
        icon: <Sparkles className="h-5 w-5 text-white" />,
        iconBg: 'bg-emerald-500',
        label: '元宝 · 关于这一天',
        subtitle: '4 条值得回 · 5 位朋友更新动态',
        badge: 'AI',
      },
    ],
    [
      {
        icon: <Radio className="h-5 w-5 text-white" />,
        iconBg: 'bg-rose-500',
        label: '视频号',
      },
      {
        icon: <Compass className="h-5 w-5 text-white" />,
        iconBg: 'bg-blue-500',
        label: '直播',
      },
    ],
    [
      {
        icon: <ScanLine className="h-5 w-5 text-white" />,
        iconBg: 'bg-slate-500',
        label: '扫一扫',
      },
      {
        icon: <Search className="h-5 w-5 text-white" />,
        iconBg: 'bg-yellow-500',
        label: '搜一搜',
      },
    ],
    [
      {
        icon: <ShoppingBag className="h-5 w-5 text-white" />,
        iconBg: 'bg-pink-500',
        label: '购物',
      },
      {
        icon: <Gamepad2 className="h-5 w-5 text-white" />,
        iconBg: 'bg-violet-500',
        label: '游戏',
      },
      {
        icon: <Wallet className="h-5 w-5 text-white" />,
        iconBg: 'bg-amber-600',
        label: '小程序',
      },
    ],
  ];

  return (
    <div className="flex h-full flex-col bg-[#111] text-[#ECECEC]">
      <StatusBar />

      <div className="px-4 pb-3 pt-1">
        <div className="text-[18px] font-semibold">发现</div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll">
        {groups.map((g, gi) => (
          <div key={gi} className="bg-[#161616] mt-3">
            {g.map((item, i) => (
              <Row key={i} item={item} divider={i < g.length - 1} />
            ))}
          </div>
        ))}
        <div className="text-center text-[11px] text-[#4A4A4A] py-8">— END —</div>
      </div>
    </div>
  );
}

function Row({ item, divider }: { item: Item; divider: boolean }) {
  const inner = (
    <div className="flex items-center gap-3 px-3.5 py-3 relative">
      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${item.iconBg}`}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] flex items-center gap-1.5">
          {item.label}
          {item.badge && (
            <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[9.5px] px-1.5 py-[1px] font-medium">
              {item.badge}
            </span>
          )}
        </div>
        {item.subtitle && (
          <div className="mt-0.5 text-[11.5px] text-[#7A7A7A] truncate">{item.subtitle}</div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-[#5A5A5A]" />
      {divider && (
        <span className="absolute left-[58px] right-0 bottom-0 h-px bg-[#1F1F1F]" />
      )}
    </div>
  );
  if (item.to) {
    return <Link to={item.to}>{inner}</Link>;
  }
  return inner;
}
