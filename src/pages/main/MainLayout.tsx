import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import LogoAnim from '../../components/LogoAnim';
import ThemeToggle from '../../components/ThemeToggle';
import { useAppState } from '../../state/AppContext';
import { useAuth } from '../../state/AuthContext';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: '대시보드',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1" />
        <rect x="8.5" y="1.5" width="6" height="4" rx="1" />
        <rect x="8.5" y="7.5" width="6" height="7" rx="1" />
        <rect x="1.5" y="9.5" width="6" height="5" rx="1" />
      </svg>
    ),
  },
  {
    to: '/report',
    label: '시장 리포트',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2.5 2h7l3.5 3.5V14h-10.5z" />
        <path d="M9 2v3.5h3.5" />
      </svg>
    ),
  },
  {
    to: '/portfolio',
    label: '포트폴리오',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="8" cy="8" r="6.2" />
        <path d="M8 1.8V8L12.4 11.2" />
      </svg>
    ),
  },
  {
    to: '/trade',
    label: '매수매도',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M2 5h9M11 5l-2.3-2.3M11 5l-2.3 2.3" />
        <path d="M14 11H5M5 11l2.3-2.3M5 11l2.3 2.3" />
      </svg>
    ),
  },
  {
    to: '/assets',
    label: '나의 자산',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 1.8h10v12.4H3z" />
        <path d="M5.3 5h5.4M5.3 8h5.4M5.3 11h3.4" />
      </svg>
    ),
  },
];

export default function MainLayout() {
  const { profile } = useAppState();
  const { nickname, logout } = useAuth();
  const navigate = useNavigate();
  const roleText = profile ? `${profile.type} · ${profile.typeKr.replace(' 투자자', '')}` : 'NEUTRAL · 중립형';
  const displayName = nickname ?? '사용자';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50 flex h-[52px] flex-shrink-0 items-center border-b border-line bg-header px-8">
        <div className="flex flex-shrink-0 items-center gap-[9px]">
          <LogoAnim variant="nav" />
          <div className="text-[15px] font-extrabold tracking-[-0.3px] text-text">QuantAI</div>
        </div>
        <nav className="flex flex-1 items-center justify-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                'flex h-9 flex-shrink-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-md px-3.5 text-[13px] font-medium leading-none transition-colors ' +
                (isActive
                  ? 'bg-accent-dim font-bold text-accent'
                  : 'text-text-faint hover:bg-line-soft hover:text-text-dim')
              }
            >
              <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-shrink-0 items-center gap-3.5">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <span className="text-[12.5px] font-semibold text-text">{displayName}</span>
            <span className="mono inline-flex items-center rounded border border-accent/35 bg-accent-dim px-[9px] py-1 text-[10px] font-bold tracking-[0.3px] text-accent">
              {roleText}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border border-line px-2.5 py-1.5 text-[11px] font-semibold text-text-faint transition-colors hover:border-accent hover:text-accent"
          >
            로그아웃
          </button>
        </div>
      </div>
      <div className="relative flex-1 bg-ink px-6 py-8 sm:px-[100px]">
        <Outlet />
      </div>
    </div>
  );
}
