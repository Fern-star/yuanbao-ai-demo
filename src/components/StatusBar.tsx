/** iOS 风格深色状态栏：左 14:46，右 信号/5G/电池 */
export function StatusBar({ time = '14:46', dark = true }: { time?: string; dark?: boolean }) {
  const fg = dark ? 'text-white' : 'text-black';
  return (
    <div className={`relative h-11 w-full flex items-center justify-between px-6 text-[15px] font-semibold ${fg} select-none`}>
      <div className="tracking-wide">{time}</div>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <div className="flex items-end gap-[2px]">
          <span className="w-[3px] h-[4px] bg-current rounded-[1px]" />
          <span className="w-[3px] h-[6px] bg-current rounded-[1px]" />
          <span className="w-[3px] h-[8px] bg-current rounded-[1px]" />
          <span className="w-[3px] h-[10px] bg-current rounded-[1px]" />
        </div>
        <span className="text-[13px] font-semibold ml-1">5G</span>
        {/* battery */}
        <div className="ml-1 relative w-[26px] h-[12px] border border-current rounded-[3px] flex items-center px-[1px]">
          <div className="w-full h-[7px] bg-current rounded-[1px] opacity-90" style={{ width: '70%' }} />
          <div className="absolute -right-[3px] top-[3px] w-[2px] h-[6px] bg-current rounded-r-[1px]" />
        </div>
      </div>
    </div>
  );
}
