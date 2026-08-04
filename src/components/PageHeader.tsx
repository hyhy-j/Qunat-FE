import type { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <>
      <div className="mb-1.5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 text-[10.5px] font-bold tracking-[1.5px] text-accent">{eyebrow}</div>
          <div className="text-xl font-extrabold tracking-[-0.3px] text-text">{title}</div>
        </div>
        {action && <div className="flex-shrink-0 pt-1">{action}</div>}
      </div>
      <div className="mb-[22px] text-[12.5px] text-text-faint">{subtitle}</div>
    </>
  );
}
