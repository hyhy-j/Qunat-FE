export default function InfoTip({ text }: { text: string }) {
  return (
    <span className="group relative ml-1.5 inline-flex align-middle">
      <span className="flex h-[15px] w-[15px] cursor-help items-center justify-center rounded-full border border-text-faint text-[9.5px] font-bold leading-none text-text-faint transition-colors group-hover:border-accent group-hover:text-accent">
        ?
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md border border-line bg-panel-elev px-3 py-2 text-left text-[11.5px] font-normal leading-[1.6] text-text-dim opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
        {text}
        <span className="absolute left-1/2 top-full -ml-1 h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-line bg-panel-elev" />
      </span>
    </span>
  );
}
