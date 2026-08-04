import type { ReactNode } from 'react';

export default function AuthWrap({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[900px] flex-col items-center justify-center bg-ink px-5 py-10">
      {children}
    </div>
  );
}
