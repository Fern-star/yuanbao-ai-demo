import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/', label: '微信', icon: 'chat' },
  { to: '/contacts', label: '通讯录', icon: 'contacts' },
  { to: '/discover', label: '发现', icon: 'discover' },
  { to: '/me', label: '我', icon: 'me' },
] as const;

function Icon({ name, active }: { name: string; active: boolean }) {
  const stroke = active ? '#07C160' : '#9A9A9A';
  const fill = active ? '#07C160' : 'none';
  if (name === 'chat') {
    return (
      <div className="relative">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M8.5 4C5.46 4 3 6.24 3 9c0 1.62.86 3.06 2.18 4l-.6 2.4 2.5-1.4c.42.07.85.1 1.42.1 3.04 0 5.5-2.24 5.5-5S11.54 4 8.5 4Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M14 11.6c.5 2.6 3.05 4.4 6 4.4.5 0 1-.04 1.5-.1l2.2 1.2-.5-2.1A4.93 4.93 0 0 0 25 11c0-2.6-2.32-4.7-5.5-4.7"
            fill={fill === 'none' ? 'none' : fill}
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
            transform="translate(-3 0)"
          />
        </svg>
        {/* 未读小红点（演示用） */}
        {active && (
          <span className="absolute -top-0.5 -right-1 px-1 min-w-[14px] h-[14px] rounded-full bg-[#FA5151] text-white text-[10px] flex items-center justify-center font-semibold">
            ···
          </span>
        )}
      </div>
    );
  }
  if (name === 'contacts') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3.2" stroke={stroke} strokeWidth="1.6" />
        <path d="M5 19c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'discover') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.6" />
        <path d="M9 15l2-5 5-2-2 5-5 2Z" fill={fill === 'none' ? 'none' : fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    );
  }
  // me
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="3.2" stroke={stroke} strokeWidth="1.6" />
      <path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TabBar() {
  return (
    <div className="bg-[#1B1B1B] border-t border-[#262626] pt-1.5 pb-[26px]">
      <div className="flex items-center justify-around">
        {ITEMS.map((item) => (
          <NavLink
            to={item.to}
            key={item.to}
            end={item.to === '/'}
            className="flex flex-col items-center justify-center gap-0.5 w-1/4"
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} active={isActive} />
                <span className={`text-[11px] ${isActive ? 'text-[#07C160]' : 'text-[#9A9A9A]'}`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
