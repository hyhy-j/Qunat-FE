import { useState } from 'react';
import type { TradableStockResponse } from '../api/types';

interface StockSelectProps {
  stocks: TradableStockResponse[];
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export default function StockSelect({ stocks, value, onChange, disabled }: StockSelectProps) {
  const [open, setOpen] = useState(false);
  const selected = stocks.find((s) => s.code === value);

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-line bg-panel-elev px-[13px] py-[11px] text-left text-[13.5px] text-text outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {selected ? (
          <span>
            <span className="mono text-text-faint">{selected.code}</span>
            <span className="mx-1.5 text-text-faint">—</span>
            {selected.name}
          </span>
        ) : (
          <span className="text-text-faint">종목을 선택하세요</span>
        )}
        <span className={'text-[10px] text-text-faint transition-transform ' + (open ? 'rotate-180' : '')}>▼</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-64 overflow-y-auto rounded-md border border-line bg-panel-elev shadow-2xl">
            {stocks.map((s) => (
              <button
                key={s.code}
                type="button"
                onClick={() => {
                  onChange(s.code);
                  setOpen(false);
                }}
                className={
                  'flex w-full items-center justify-between px-[13px] py-[10px] text-left text-[13px] transition-colors hover:bg-line-soft ' +
                  (s.code === value ? 'text-accent' : 'text-text-dim')
                }
              >
                <span>
                  <span className="mono text-[11px] text-text-faint">{s.code}</span>
                  <span className="ml-2">{s.name}</span>
                </span>
                <span className="mono text-[11.5px] text-text-faint">
                  {s.price != null ? `${s.price.toLocaleString()}원` : '-'}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
