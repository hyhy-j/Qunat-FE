type LogoVariant = 'nav' | 'login' | 'callout';

interface LogoAnimProps {
  variant?: LogoVariant;
}

export default function LogoAnim({ variant = 'nav' }: LogoAnimProps) {
  if (variant === 'login') {
    return (
      <div
        className="relative flex items-center justify-center w-16 h-16 mb-[30px]"
        style={{ transform: 'scale(1.8)' }}
      >
        <div className="absolute w-16 h-16 rounded-[4px] border-[1.5px] border-accent/35 animate-spin-slow" />
        <div className="absolute w-[46px] h-[46px] rounded-[3px] border-[1.5px] border-accent/20 animate-spin-rev" />
        <div className="relative z-10 w-4 h-4 rounded-[2px] bg-accent animate-pulse-glow" />
        <div className="absolute w-1.5 h-1.5 -mt-[3px] -ml-[3px] top-1/2 left-1/2 rounded-full bg-accent animate-login-orbit" />
        <div className="absolute w-[5px] h-[5px] -mt-[2.5px] -ml-[2.5px] top-1/2 left-1/2 rounded-full bg-accent/50 animate-login-orbit2" />
      </div>
    );
  }

  if (variant === 'callout') {
    return (
      <div className="relative flex items-center justify-center w-7 h-7 flex-shrink-0">
        <div className="absolute w-7 h-7 rounded-[4px] border-[1.5px] border-accent/40 animate-spin-slow" />
        <div className="relative z-10 w-2 h-2 rounded-[2px] bg-accent animate-pulse-glow" />
        <div className="absolute w-[3px] h-[3px] -mt-[1.5px] -ml-[1.5px] top-1/2 left-1/2 rounded-full bg-accent animate-orbit" />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-9 h-9 flex-shrink-0">
      <div className="absolute w-9 h-9 rounded-[4px] border-[1.5px] border-accent/35 animate-spin-slow" />
      <div className="absolute w-[26px] h-[26px] rounded-[3px] border-[1.5px] border-accent/20 animate-spin-rev" />
      <div className="relative z-10 w-2.5 h-2.5 rounded-[2px] bg-accent animate-pulse-glow" />
      <div className="absolute w-1 h-1 -mt-0.5 -ml-0.5 top-1/2 left-1/2 rounded-full bg-accent animate-orbit" />
      <div className="absolute w-[3px] h-[3px] -mt-[1.5px] -ml-[1.5px] top-1/2 left-1/2 rounded-full bg-accent/50 animate-orbit2" />
    </div>
  );
}
