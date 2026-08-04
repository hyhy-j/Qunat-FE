import type { ReactNode } from 'react';
import StepIndicator from './StepIndicator';

interface SurveyCardProps {
  step: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer: ReactNode;
  minHeightPx?: number;
}

export default function SurveyCard({
  step,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  minHeightPx = 480,
}: SurveyCardProps) {
  return (
    <div
      className="flex w-full max-w-[480px] flex-col rounded-xl border border-line bg-panel p-8"
      style={{ minHeight: minHeightPx }}
    >
      <StepIndicator current={step} />
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-2 text-[10.5px] font-bold tracking-[1.5px] text-accent">{eyebrow}</div>
        <div className="mb-5 text-lg font-extrabold text-text">{title}</div>
        {subtitle && <div className="mb-7 text-xs text-text-faint">{subtitle}</div>}
        {children}
      </div>
      {footer}
    </div>
  );
}
