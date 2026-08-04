interface ChoiceProps {
  main: string;
  sub: string;
  selected: boolean;
  onSelect: () => void;
}

export default function Choice({ main, sub, selected, onSelect }: ChoiceProps) {
  return (
    <div
      onClick={onSelect}
      className={
        'mb-2.5 last:mb-0 cursor-pointer rounded-lg border px-[18px] py-4 transition-colors ' +
        (selected
          ? 'border-accent bg-accent-dim'
          : 'border-line bg-panel-elev hover:border-accent')
      }
    >
      <div className="text-[15px] font-bold text-text">
        {main} <span className="text-xs font-normal text-text-faint">{sub}</span>
      </div>
    </div>
  );
}
