import { useState } from 'react';
import { LATEST_REPORT_DATE } from '../data/mock';

interface ReportDatePickerProps {
  selected: string;
  onSelect: (date: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
const TODAY = LATEST_REPORT_DATE;

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function toDateStr(y: number, m: number, d: number) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}

export default function ReportDatePicker({ selected, onSelect }: ReportDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selY, selM] = selected.split('-').map(Number);
  const [viewYear, setViewYear] = useState(selY);
  const [viewMonth, setViewMonth] = useState(selM - 1); // 0-indexed

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewMonth(m);
    setViewYear(y);
  };

  const openPopover = () => {
    setViewYear(selY);
    setViewMonth(selM - 1);
    setOpen(true);
  };

  return (
    <div className="relative">
      <button
        onClick={openPopover}
        className="mono flex items-center gap-2 rounded-md border border-line bg-panel-elev px-3 py-2 text-xs font-semibold text-text-dim transition-colors hover:border-accent hover:text-accent"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
          <path d="M1.5 6h13M4.5 1v3M11.5 1v3" />
        </svg>
        {selected}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-30 mt-2 w-[280px] rounded-xl border border-line bg-panel-elev p-4 shadow-2xl">
            <div className="mb-3.5 flex items-center justify-between">
              <button
                onClick={() => changeMonth(-1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-dim hover:bg-line-soft hover:text-accent"
              >
                ‹
              </button>
              <div className="text-sm font-bold text-text">
                {viewYear}년 {viewMonth + 1}월
              </div>
              <button
                onClick={() => changeMonth(1)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-dim hover:bg-line-soft hover:text-accent"
              >
                ›
              </button>
            </div>

            <div className="mb-1.5 grid grid-cols-7">
              {WEEKDAYS.map((w) => (
                <div key={w} className="py-1 text-center text-[10.5px] font-bold text-text-faint">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={i} />;
                const dateStr = toDateStr(viewYear, viewMonth, day);
                const isSelected = dateStr === selected;
                const isToday = dateStr === TODAY;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      onSelect(dateStr);
                      setOpen(false);
                    }}
                    className={
                      'mono relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors ' +
                      (isSelected
                        ? 'bg-accent font-bold text-ink-fixed'
                        : 'text-text-dim hover:bg-line-soft hover:text-accent')
                    }
                  >
                    {day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 h-1 w-1 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
