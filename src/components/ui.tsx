import type { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export function FillButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'mt-auto block w-full rounded-lg border border-accent bg-accent px-3.5 py-3.5 text-center text-[15px] font-bold text-ink-fixed transition-colors hover:enabled:bg-[#ffc94d] disabled:cursor-not-allowed disabled:opacity-40 ' +
        className
      }
    />
  );
}

export function OutlineButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'inline-block rounded-lg border border-line bg-transparent px-5 py-[13px] text-sm font-semibold text-text-dim transition-colors hover:border-accent hover:text-accent ' +
        className
      }
    />
  );
}

export function BackButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        'mt-3 rounded-lg border border-line bg-transparent px-[18px] py-[9px] text-[13px] font-semibold text-text-dim transition-colors hover:border-accent hover:text-accent ' +
        className
      }
    />
  );
}

export function Field({
  label,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="mb-[13px]">
      <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[1px] text-text-faint">
        {label}
      </label>
      <input
        {...props}
        className={
          'w-full rounded-md border border-line bg-panel-elev px-[13px] py-[11px] text-[13.5px] text-text outline-none placeholder:text-text-faint focus:border-accent ' +
          className
        }
      />
    </div>
  );
}
