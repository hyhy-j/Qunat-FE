import { useState } from 'react';
import InfoTip from './InfoTip';
import StockLogo from './StockLogo';

const AMOUNT_INFO =
  '비중(%)에 총 투자금액을 곱해 계산한 목표 배분액이에요. 실제 매수 시에는 이 금액을 그 시점 주가로 나눈 정수 주 단위로 체결되며, 남는 금액은 현금으로 남습니다.';

interface AccordionItem {
  code: string;
  name: string;
  weightPct: number;
  weightBar: number;
  reasons: string[];
  amount?: number;
}

export default function Accordion({
  items,
  defaultVisibleCount,
}: {
  items: AccordionItem[];
  defaultVisibleCount?: number;
}) {
  const [openCode, setOpenCode] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const showToggle = !!defaultVisibleCount && items.length > defaultVisibleCount;
  const visibleItems = showToggle && !expanded ? items.slice(0, defaultVisibleCount) : items;
  const hiddenCount = items.length - (defaultVisibleCount ?? items.length);

  return (
    <div>
      {visibleItems.map((item, idx) => {
        const isOpen = openCode === item.code;
        const isLast = idx === visibleItems.length - 1 && !showToggle;
        return (
          <div key={item.code} className={isLast ? '' : 'border-b border-line-soft'}>
            <div
              onClick={() => setOpenCode(isOpen ? null : item.code)}
              className="flex cursor-pointer items-center justify-between py-3"
            >
              <div className="flex items-center gap-2.5">
                <StockLogo code={item.code} name={item.name} />
                <div>
                  <div className={'text-[13.5px] font-semibold ' + (isOpen ? 'text-accent' : 'text-text')}>
                    {item.name}
                  </div>
                  <div className="mono text-[11px] text-text-faint">{item.code}</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-1 w-[60px] overflow-hidden rounded-sm bg-line-soft">
                  <div className="h-1 rounded-sm bg-accent" style={{ width: `${item.weightBar}%` }} />
                </div>
                <span className="mono min-w-[28px] text-[11.5px] text-text-dim">{item.weightPct}%</span>
                <span
                  className={
                    'text-[11px] text-text-faint transition-transform ' + (isOpen ? 'rotate-180 text-accent' : '')
                  }
                >
                  ▼
                </span>
              </div>
            </div>
            <div className={'acc-body' + (isOpen ? ' open' : '')}>
              {item.amount !== undefined && (
                <div className="mb-2.5 flex items-center rounded-md bg-panel-elev px-3.5 py-2.5 text-[12.5px]">
                  <span className="text-text-faint">투자 금액</span>
                  <InfoTip text={AMOUNT_INFO} placement="bottom" align="start" />
                  <span className="mono ml-1.5 font-bold text-accent">{item.amount.toLocaleString()}원</span>
                </div>
              )}
              {item.reasons.map((reason, i) => (
                <div
                  key={i}
                  className={
                    'rounded-r-md border border-l-2 border-line border-l-accent bg-panel-elev px-3.5 py-[11px] text-[12.5px] leading-[1.7] text-text-dim ' +
                    (i === item.reasons.length - 1 ? 'mb-2.5' : 'mb-[9px]')
                  }
                >
                  {reason}
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {showToggle && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 pt-3 text-xs font-semibold text-text-faint hover:text-accent"
        >
          {expanded ? '접기' : `${hiddenCount}개 종목 더보기`}
          <span className={'text-[10px] transition-transform ' + (expanded ? 'rotate-180' : '')}>▼</span>
        </button>
      )}
    </div>
  );
}
