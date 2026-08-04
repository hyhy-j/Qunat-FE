import { useTheme } from '../state/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      aria-label="테마 전환"
      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[5px] border border-line bg-panel-elev text-text-dim transition-colors hover:border-accent hover:text-accent"
    >
      {isLight ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
          <circle cx="8" cy="8" r="3.2" />
          <path d="M8 1v1.4M8 13.6V15M2.6 8H1M15 8h-1.6M3.8 3.8l1 1M11.2 11.2l1 1M3.8 12.2l1-1M11.2 4.8l1-1" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.5 9.3A5.8 5.8 0 0 1 6.7 2.5a5.8 5.8 0 1 0 6.8 6.8z" />
        </svg>
      )}
    </button>
  );
}
