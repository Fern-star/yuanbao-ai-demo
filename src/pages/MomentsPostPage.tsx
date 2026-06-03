import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Lock, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { materials, getCaptions, privacyTips } from '../data/moments';
import type { Mood, Style } from '../types';
import { StatusBar } from '../components/StatusBar';

/**
 * 发表朋友圈
 * - 上半部分（编辑区 + 元宝洞察）固定不动
 * - 下半部分「文案建议」独立滚动
 * - 心情、风格 由元宝基于近期聊天自动分析（只读展示）
 */
export function MomentsPostPage() {
  const nav = useNavigate();

  // 演示：默认素材是"咖啡店自拍"，用户已经选好了照片
  const [materialId] = useState('cafeSelfie');
  const [text, setText] = useState('');
  const [seed, setSeed] = useState(0);
  const [done, setDone] = useState(false);

  // 元宝基于最近聊天/朋友圈/作息分析出来的状态（只读）
  const inferredMood: Mood = '松弛';
  const inferredStyle: Style = '简洁';
  const inferredReason =
    '最近 3 天聊天关键词偏向"慢一点""今天挺好"，朋友圈历史也多用短句。';

  const material = materials.find((m) => m.id === materialId)!;
  const captions = useMemo(() => {
    const all = getCaptions(materialId, inferredMood, inferredStyle);
    const start = seed % Math.max(all.length, 1);
    const rotated = [...all.slice(start), ...all.slice(0, start)];
    return rotated.slice(0, 4);
  }, [materialId, inferredMood, inferredStyle, seed]);
  const privacyTip = privacyTips[materialId];

  const onPost = () => {
    if (!text.trim()) return;
    setDone(true);
    setTimeout(() => nav('/moments'), 700);
  };

  return (
    <div className="flex h-full flex-col bg-[#111] text-[#ECECEC] overflow-hidden">
      <StatusBar />

      {/* 顶部 */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-[#1F1F1F] shrink-0">
        <button
          onClick={() => nav(-1)}
          className="flex h-9 px-2 items-center text-[#ECECEC] text-[14px]"
        >
          <ChevronLeft className="h-5 w-5 mr-0.5" />
          取消
        </button>
        <div className="text-[15px] font-medium">发表朋友圈</div>
        <button
          onClick={onPost}
          disabled={!text.trim()}
          className={clsx(
            'h-7 rounded-md px-3 text-[13px] font-medium',
            text.trim()
              ? 'bg-emerald-500 text-white'
              : 'bg-[#2A2A2A] text-[#6E6E6E]'
          )}
        >
          发表
        </button>
      </div>

      {/* 固定区：编辑器 + 元宝洞察 */}
      <div className="shrink-0 px-4 pt-3 pb-3 border-b border-[#1A1A1A]">
        <div className="rounded-2xl bg-[#1A1A1A] p-3 border border-[#1F1F1F]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="这一刻的想法…"
            className="block min-h-[64px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-[#ECECEC] outline-none placeholder:text-[#6E6E6E]"
          />
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            <div
              className={`aspect-square rounded-sm bg-gradient-to-br ${material.bg} flex items-center justify-center text-3xl`}
            >
              {material.thumb}
            </div>
            <div className="aspect-square rounded-sm bg-[#222] flex items-center justify-center text-[#4A4A4A] text-2xl">
              +
            </div>
          </div>
          <div className="mt-2.5 flex flex-col gap-px text-[13px] text-[#9A9A9A] divide-y divide-[#1F1F1F]">
            <div className="flex items-center justify-between py-1.5">
              <span>所在位置</span>
              <span className="text-[#6E6E6E]">不显示位置 ›</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span>谁可以看</span>
              <span className="inline-flex items-center gap-1 text-[#6E6E6E]">
                <Lock className="h-3 w-3" />
                公开 ›
              </span>
            </div>
          </div>
        </div>

        {/* 元宝自动洞察：心情 / 风格（只读） */}
        <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-2.5 py-1.5">
          <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Sparkles className="h-2.5 w-2.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11.5px]">
              <span className="text-emerald-300">元宝判断你今天</span>
              <ReadonlyChip>{inferredMood}</ReadonlyChip>
              <span className="text-[#7A7A7A]">·</span>
              <ReadonlyChip>{inferredStyle}</ReadonlyChip>
            </div>
            <div className="mt-0.5 truncate text-[10.5px] text-[#7A7A7A]" title={inferredReason}>
              {inferredReason}
            </div>
          </div>
        </div>
      </div>

      {/* 可滚动区：仅文案建议（含底部隐私提醒） */}
      <div className="flex-1 overflow-y-auto thin-scroll px-4 pb-6 pt-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#9A9A9A]">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
            元宝 · 文案建议
          </div>
          <button
            onClick={() => setSeed((s) => s + 1)}
            className="inline-flex items-center gap-1 rounded-full border border-[#2A2A2A] bg-[#1F1F1F] px-2 py-0.5 text-[10.5px] text-[#9A9A9A]"
          >
            <RefreshCw className="h-3 w-3" />
            换一批
          </button>
        </div>

        <div className="space-y-2">
          {captions.map((c, i) => (
            <button
              key={`${seed}-${i}`}
              onClick={() => setText(c)}
              className="block w-full rounded-2xl border border-[#1F1F1F] bg-[#161616] p-3 text-left hover:border-emerald-500/40"
            >
              <div className="text-[13.5px] leading-relaxed text-[#ECECEC]">
                {c}
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-[#7A7A7A]">
                <span>
                  {inferredMood} · {inferredStyle}
                </span>
                <span className="text-emerald-400">点击填入 →</span>
              </div>
            </button>
          ))}
        </div>

        {/* 隐私守门 */}
        {privacyTip && (
          <div className="mt-3 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-[#2A2218] to-[#1F1A14] p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-white">
                <Lock className="h-3 w-3" />
              </div>
              <div className="text-[12px] font-medium text-amber-300">
                元宝 · 隐私守门
              </div>
              <span className="ml-auto text-[10px] text-[#7A7A7A]">· 只对你可见</span>
            </div>
            <div className="text-[12.5px] leading-relaxed text-[#E0E0E0]">
              {privacyTip}
            </div>
            <div className="mt-2 flex justify-end gap-1.5">
              <button className="rounded-full bg-[#1F1F1F] border border-[#2A2A2A] px-2.5 py-1 text-[11px] text-[#9A9A9A]">
                忽略
              </button>
              <button className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-medium text-white">
                按建议处理
              </button>
            </div>
          </div>
        )}
      </div>

      {done && (
        <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center">
          <div className="rounded-2xl bg-[#1A1A1A] border border-emerald-500/30 px-5 py-4 text-[13px] text-emerald-300 yb-fade-up">
            ✓ 已发表
          </div>
        </div>
      )}
    </div>
  );
}

function ReadonlyChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-[1px] text-[11px] font-medium text-emerald-200">
      {children}
    </span>
  );
}
