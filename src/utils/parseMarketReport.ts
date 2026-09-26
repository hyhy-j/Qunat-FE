export type StockTone = 'positive' | 'negative' | 'caution';

export interface ParsedStockNews {
  code: string;
  name: string;
  note: string;
  tone: StockTone;
}

export interface ParsedMarketReport {
  summary: string;
  stockNews: ParsedStockNews[];
  watchPoints: string[];
}

const SUMMARY_HEADER = '오늘 시장 한줄 요약';
const STOCK_NEWS_HEADER = '종목별 오늘 뉴스 흐름';
const WATCH_POINTS_HEADER = '오늘 시장에서 조심할 점';

const STOCK_LINE_RE = /^(.+?)\((\d{6})\)\s*[:：]\s*(.+)$/;

const POSITIVE_WORDS = ['긍정', '상승', '강세', '개선', '호조', '기대감', '활발', '경쟁력 강화', '주목받', '좋은 소식'];
const NEGATIVE_WORDS = ['하락', '불안', '우려', '악재', '부진', '갈등', '엇갈리', '부정'];

function classifyTone(note: string): StockTone {
  const posCount = POSITIVE_WORDS.filter((w) => note.includes(w)).length;
  const negCount = NEGATIVE_WORDS.filter((w) => note.includes(w)).length;
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'caution';
}

function lineStart(content: string, index: number): number {
  const newlineIndex = content.lastIndexOf('\n', index - 1);
  return newlineIndex === -1 ? 0 : newlineIndex + 1;
}

function sectionBody(content: string, header: string, nextHeaders: string[]): string | null {
  const start = content.indexOf(header);
  if (start === -1) return null;

  let bodyStart = content.indexOf('\n', start);
  if (bodyStart === -1) return '';
  bodyStart += 1;

  let bodyEnd = content.length;
  for (const next of nextHeaders) {
    const idx = content.indexOf(next, bodyStart);
    if (idx !== -1) {
      const cutoff = lineStart(content, idx);
      if (cutoff < bodyEnd) bodyEnd = cutoff;
    }
  }

  return content.slice(bodyStart, bodyEnd).trim();
}

function parseBulletLines(body: string): string[] {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('-'))
    .map((line) => line.replace(/^-\s*/, '').trim());
}

export function parseMarketReport(content: string): ParsedMarketReport {
  const summaryBody = sectionBody(content, SUMMARY_HEADER, [STOCK_NEWS_HEADER, WATCH_POINTS_HEADER]);
  const stockNewsBody = sectionBody(content, STOCK_NEWS_HEADER, [WATCH_POINTS_HEADER]);
  const watchPointsBody = sectionBody(content, WATCH_POINTS_HEADER, []);

  if (summaryBody === null && stockNewsBody === null && watchPointsBody === null) {
    return { summary: content.trim(), stockNews: [], watchPoints: [] };
  }

  const watchPoints = watchPointsBody ? parseBulletLines(watchPointsBody) : [];
  const watchedCodes = new Set<string>();
  for (const point of watchPoints) {
    const codes = point.match(/\d{6}/g);
    if (codes && codes.length === 1) watchedCodes.add(codes[0]);
  }

  const stockNews: ParsedStockNews[] = stockNewsBody
    ? parseBulletLines(stockNewsBody)
        .map((line) => STOCK_LINE_RE.exec(line))
        .filter((match): match is RegExpExecArray => match !== null)
        .map((match) => {
          const code = match[2];
          const note = match[3].trim();
          const tone = watchedCodes.has(code) ? 'caution' : classifyTone(note);
          return { name: match[1].trim(), code, note, tone };
        })
    : [];

  return {
    summary: (summaryBody ?? '').trim(),
    stockNews,
    watchPoints,
  };
}
