interface InfoTipProps {
  text: string;
  variant?: 'default' | 'white';
  size?: 'sm' | 'md';
  placement?: 'top' | 'bottom';
  align?: 'center' | 'start';
}

export default function InfoTip({
  text,
  variant = 'default',
  size = 'sm',
  placement = 'top',
  align = 'center',
}: InfoTipProps) {
  const dotSizeClass = size === 'md' ? 'h-[19px] w-[19px] text-[11px]' : 'h-[15px] w-[15px] text-[9.5px]';
  const colorClass =
    variant === 'white'
      ? 'border-white/70 text-white group-hover:border-white group-hover:text-white'
      : 'border-text-faint text-text-faint group-hover:border-accent group-hover:text-accent';

  const bubblePlacementClass = placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2';
  const bubbleAlignClass = align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2';
  const arrowPlacementClass =
    placement === 'bottom' ? 'bottom-full -mb-1 rotate-[225deg]' : 'top-full -mt-1 rotate-45';
  const arrowAlignClass = align === 'start' ? 'left-2' : 'left-1/2 -ml-1';

  return (
    <span className="group relative ml-1.5 inline-flex align-middle">
      <span
        className={
          'flex cursor-help items-center justify-center rounded-full border font-bold leading-none transition-colors ' +
          dotSizeClass +
          ' ' +
          colorClass
        }
      >
        ?
      </span>
      <span
        className={
          'pointer-events-none absolute z-20 w-56 rounded-md border border-line bg-panel-elev px-3 py-2 text-left text-[11.5px] font-normal leading-[1.6] text-text-dim opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ' +
          bubblePlacementClass +
          ' ' +
          bubbleAlignClass
        }
      >
        {text}
        <span className={'absolute h-2 w-2 border-b border-r border-line bg-panel-elev ' + arrowPlacementClass + ' ' + arrowAlignClass} />
      </span>
    </span>
  );
}
