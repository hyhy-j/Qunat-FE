const LOGO_BY_CODE: Record<string, string> = {
  '005930': '/logos/005930.png',
  '000660': '/logos/000660.webp',
  '402340': '/logos/402340.png',
  '207940': '/logos/207940.png',
  '005380': '/logos/005380.png',
  '373220': '/logos/373220.webp',
  '032830': '/logos/032830.png',
  '028260': '/logos/028260.webp',
  '329180': '/logos/329180.png',
  '000270': '/logos/000270.png',
};

interface StockLogoProps {
  code: string;
  name: string;
  size?: 'sm' | 'md';
}

export default function StockLogo({ code, name, size = 'md' }: StockLogoProps) {
  const src = LOGO_BY_CODE[code];
  const sizeClass = size === 'sm' ? 'h-7 w-10' : 'h-8 w-11';

  return (
    <div
      className={
        'flex flex-shrink-0 items-center justify-center rounded-[5px] border border-line bg-white p-1 ' + sizeClass
      }
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-contain" />
      ) : (
        <span className="text-[10px] font-bold text-ink">{name.slice(0, 2)}</span>
      )}
    </div>
  );
}
