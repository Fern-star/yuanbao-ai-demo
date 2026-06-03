import type { ReactNode } from 'react';

/**
 * 模拟 iPhone 外壳：
 * - 桌面端居中放一个圆角 phone-frame
 * - 移动端铺满
 * 内部由各页面自己负责 status bar，App 负责切换 TabBar。
 */
export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center sm:p-6">
      <div className="phone-frame">
        <div className="ios-notch" />
        <div className="absolute inset-0 flex flex-col">{children}</div>
      </div>
    </div>
  );
}
