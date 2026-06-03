import { Link, useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ChevronLeft, Camera, Heart, ArrowDown, Sparkles } from 'lucide-react';
import { momentFeed } from '../data/moments';
import type { MomentPost } from '../types';
import { StatusBar } from '../components/StatusBar';

/** 上次看到的位置（演示：第 3 条） */
const LAST_SEEN_INDEX = 2;
/** 相对上次浏览，新增的动态条数 */
const NEW_COUNT = LAST_SEEN_INDEX;
/** 新增动态的话题分布 */
const NEW_CATEGORIES = ['咖啡日常', '工作小成就', '海边出片'];

export function MomentsPage() {
  const nav = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastSeenAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToLastSeen = () => {
    lastSeenAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full flex-col bg-black text-[#ECECEC]">
      <StatusBar />

      {/* 顶部透明导航 */}
      <div className="flex items-center justify-between px-2 py-2">
        <button
          onClick={() => nav(-1)}
          className="flex h-9 w-9 items-center justify-center text-[#ECECEC]"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <div className="text-[15px] font-medium">朋友圈</div>
        <Link
          to="/moments/post"
          className="flex h-9 w-9 items-center justify-center text-[#ECECEC]"
          aria-label="发表"
        >
          <Camera className="h-5 w-5" />
        </Link>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto thin-scroll">
        {/* 封面区 - 不再被遮挡 */}
        <div className="relative h-[180px] bg-gradient-to-br from-slate-700 via-slate-600 to-emerald-700">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,.08),transparent)]" />
          <div className="absolute right-4 bottom-3 flex items-center gap-2">
            <span className="text-[13px] text-white/90 drop-shadow">海浪 / 夏天</span>
            <div className="h-12 w-12 rounded-md bg-emerald-500/40 backdrop-blur flex items-center justify-center text-2xl">
              🙂
            </div>
          </div>
        </div>

        {/* 信息流 */}
        <div className="bg-black">
          {/* 元宝氛围条 - 放在第一条朋友圈上方，只占一行不挡背景 */}
          <YbAmbientStrip
            newCount={NEW_COUNT}
            categories={NEW_CATEGORIES}
            onJumpLastSeen={scrollToLastSeen}
          />

          {momentFeed.map((p, idx) => (
            <div key={p.id}>
              {/* "上次看到这里"锚点 */}
              {idx === LAST_SEEN_INDEX && (
                <div ref={lastSeenAnchorRef} className="relative">
                  <div className="flex items-center gap-2 px-4 py-2 text-[10.5px] text-[#6E6E6E]">
                    <div className="h-px flex-1 bg-[#1F1F1F]" />
                    <span>上次看到这里</span>
                    <div className="h-px flex-1 bg-[#1F1F1F]" />
                  </div>
                </div>
              )}
              <MomentCard post={p} />
            </div>
          ))}
          <div className="text-center text-[11px] text-[#4A4A4A] py-6">
            没有更多内容了
          </div>
        </div>
      </div>
    </div>
  );
}

/** 朋友圈氛围条 - 位于第一条朋友圈上方，单行紧凑、不遮挡背景 */
function YbAmbientStrip({
  newCount,
  categories,
  onJumpLastSeen,
}: {
  newCount: number;
  categories: string[];
  onJumpLastSeen: () => void;
}) {
  return (
    <div className="px-4 pt-3 pb-2 border-b border-[#141414] bg-black/40">
      <div className="flex items-center gap-2">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/90 text-white">
          <Sparkles className="h-2.5 w-2.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 text-[12.5px] leading-snug">
            <span className="text-[#D8D8D8]">距上次浏览</span>
            <span className="font-medium text-emerald-300">{newCount} 条新动态</span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[10.5px] text-[#7A7A7A]">
            <span>主要是</span>
            {categories.map((c, i) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full bg-[#161616] border border-[#222] px-1.5 py-[1px] text-[#B8B8B8]"
              >
                {c}
                {i < categories.length - 1 && ''}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onJumpLastSeen}
          className="shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300 hover:bg-emerald-500/20"
        >
          <ArrowDown className="h-3 w-3" />
          回到上次看的位置
        </button>
      </div>
    </div>
  );
}

function MomentCard({ post }: { post: MomentPost }) {
  const imgs = post.images ?? [];
  const cols = imgs.length === 1 ? 1 : imgs.length === 4 ? 2 : Math.min(3, imgs.length);
  return (
    <div className="px-4 pt-4 pb-3 flex gap-3 border-b border-[#1A1A1A]">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-xl ${post.authorBg}`}
      >
        {post.authorAvatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-medium text-[#6FA3F7]">{post.authorName}</div>
        {post.text && (
          <div className="mt-1 text-[14px] leading-relaxed text-[#ECECEC]">
            {post.text}
          </div>
        )}
        {imgs.length > 0 && (
          <div
            className="mt-2 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: 280 }}
          >
            {imgs.map((im, i) => (
              <div
                key={i}
                className={`aspect-square rounded-sm bg-gradient-to-br ${im.bg} flex items-center justify-center text-3xl`}
              >
                {im.emoji}
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-3 text-[11px] text-[#6E6E6E]">
          <span>{post.timeAgo}</span>
          {post.location && <span>· {post.location}</span>}
          <span className="ml-auto">···</span>
        </div>
        {(post.likes?.length || post.comments?.length) ? (
          <div className="mt-2 rounded-md bg-[#161616] px-2.5 py-1.5 text-[12px] space-y-1">
            {post.likes && post.likes.length > 0 && (
              <div className="flex items-start gap-1 text-[#6FA3F7]">
                <Heart className="h-3 w-3 mt-1 fill-current" />
                <span>{post.likes.join('，')}</span>
              </div>
            )}
            {post.comments?.map((c, i) => (
              <div key={i} className="text-[#D8D8D8]">
                <span className="text-[#6FA3F7]">{c.name}：</span>
                {c.text}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
