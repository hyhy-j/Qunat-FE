export interface Holding {
  code: string;
  name: string;
  short: string;
  qty: number;
  avgPrice: number;
  curPrice: number;
}

export const holdings: Holding[] = [
  { code: '005930', name: '삼성전자', short: '삼성', qty: 2, avgPrice: 277500, curPrice: 286000 },
  { code: '000660', name: 'SK하이닉스', short: 'SK', qty: 1, avgPrice: 2150000, curPrice: 2187000 },
];

export interface TradeOption {
  code: string;
  name: string;
  price: number;
}

export const tradeOptions: TradeOption[] = [
  { code: '005930', name: '삼성전자', price: 286000 },
  { code: '000660', name: 'SK하이닉스', price: 2187000 },
  { code: '402340', name: 'SK스퀘어', price: 1525000 },
  { code: '005380', name: '현대차', price: 482000 },
  { code: '373220', name: 'LG에너지솔루션', price: 354000 },
  { code: '032830', name: '삼성생명', price: 370500 },
  { code: '028260', name: '삼성물산', price: 406500 },
  { code: '329180', name: 'HD현대중공업', price: 590000 },
  { code: '000270', name: '기아', price: 145200 },
];

export type ReportTone = 'up' | 'down' | 'mixed';

export interface ReportStock {
  code: string;
  name: string;
  short: string;
  note: string;
  tone: ReportTone;
}

export const reportStocks: ReportStock[] = [
  { code: '005930', name: '삼성전자', short: '삼성전', tone: 'down', note: '사회연대임금과 관련된 논란과 금융 상품 규제에 대한 이야기들이 나오면서 최근 부정적인 뉴스가 많습니다.' },
  { code: '000660', name: 'SK하이닉스', short: 'SK하닉', tone: 'down', note: '금융 상품 관련 논란이 이어지고 있으나, 다른 한편으로는 낮은 가격에 주식을 사려는 움직임이 나타나며 시장에서 우려의 목소리가 나오고 있습니다.' },
  { code: '402340', name: 'SK스퀘어', short: 'SK스퀘', tone: 'mixed', note: '주가가 강하게 오르고 있는 흐름을 보이나, 실제 장중에는 주가가 소폭 내려가는 모습을 보여 뉴스와 실제 주가 흐름이 엇갈리고 있습니다.' },
  { code: '207940', name: '삼성바이오로직스', short: '삼바', tone: 'mixed', note: '큰 규모의 투자를 결정하며 성장을 도모하고 있으나, 시장의 기대와 달리 장 초반에는 주가가 힘을 쓰지 못하는 모습입니다.' },
  { code: '005380', name: '현대차', short: '현대차', tone: 'down', note: '노조의 부분 파업 소식이 전해지면서 사업 운영에 차질이 생길까 우려하는 시선이 공존하고 있습니다.' },
  { code: '373220', name: 'LG에너지솔루션', short: 'LG엔솔', tone: 'mixed', note: '전체적인 시장의 움직임 속에서 외국인과 기관의 관심을 받으며 분위기를 살피는 중입니다.' },
  { code: '032830', name: '삼성생명', short: '삼성생', tone: 'up', note: '주가가 강하게 오르고 있으며, 투자자들 사이에서 향후 흐름에 대한 기대감이 형성되고 있습니다.' },
  { code: '028260', name: '삼성물산', short: '삼성물', tone: 'mixed', note: '주주 행동주의와 같은 기업의 구조적인 변화에 대한 관심이 이어지고 있으나 시장 전체의 분위기에 영향을 받는 모습입니다.' },
  { code: '329180', name: 'HD현대중공업', short: 'HD현중', tone: 'down', note: '시장 전반의 침체 우려와 함께 최근 부정적인 뉴스가 많아 투자자들의 주의가 필요합니다.' },
  { code: '000270', name: '기아', short: '기아', tone: 'mixed', note: '계열사의 새로운 기술 도입 소식이 전해졌으나, 전반적인 시장의 약세 분위기가 함께 언급되고 있습니다.' },
];

export const reportWatchPoints: string[] = [
  '삼성전자(005930)와 HD현대중공업(329180)은 최근 부정적인 뉴스가 많으므로 신중한 접근이 필요합니다.',
  'SK스퀘어(402340)와 같이 뉴스와 실제 주가 흐름이 엇갈리는 종목들은 주가가 크게 오르내릴 수 있습니다.',
  '시장 전반에 걸쳐 불확실한 소식들이 섞여 있으므로 지금 당장 사기보다 조금 더 지켜보는 것이 좋을 수 있습니다.',
];

export const LATEST_REPORT_DATE = '2026-07-08';

export interface PortfolioItem {
  code: string;
  name: string;
  short: string;
  weightPct: number;
  weightBar: number;
  reasons: string[];
}

export const portfolioItems: PortfolioItem[] = [
  {
    code: '402340',
    name: 'SK스퀘어',
    short: 'SK²',
    weightPct: 20,
    weightBar: 80,
    reasons: [
      'SK스퀘어는 정보통신기술 분야의 다양한 기업들을 거느리며 미래 가치를 키워나가는 투자 전문 회사입니다.',
      '5년 이상의 긴 호흡으로 투자를 바라보는 사용자에게 이 종목은 당장의 작은 주가 변동에 흔들리기보다 자회사들의 성장을 함께 지켜보며 기다릴 가치가 있는 선택입니다.',
      '다만 자체 사업보다 보유한 기업들의 가치 변화에 따라 주가가 움직이는 구조인 만큼, 계열사 관련 소식을 꾸준히 확인하는 것이 좋습니다.',
    ],
  },
  {
    code: '000660',
    name: 'SK하이닉스',
    short: 'SK',
    weightPct: 20,
    weightBar: 80,
    reasons: [
      'SK하이닉스는 인공지능 시대를 이끄는 핵심 부품인 고성능 메모리 반도체 분야에서 세계적인 기술력을 갖춘 기업입니다.',
      '지금처럼 업황에 대한 우려로 주가가 잠시 주춤한 시기는 오히려 5년 이상 길게 보고 투자하려는 분에게 좋은 진입 시점이 될 수 있습니다.',
      '반도체 업황은 글로벌 수요 변화에 민감하게 반응하므로, 분기별 실적과 메모리 가격 흐름을 함께 살펴보는 것이 좋습니다.',
    ],
  },
  {
    code: '032830',
    name: '삼성생명',
    short: '삼성생',
    weightPct: 20,
    weightBar: 80,
    reasons: [
      '삼성생명은 오랜 역사를 가진 국내 대표 생명보험사로, 안정적인 사업 구조를 바탕으로 꾸준한 성과를 내는 기업입니다.',
      '5년 이상의 긴 호흡으로 투자를 바라보는 사용자에게 이 종목은 시장 변동성 속에서도 중심을 잡아줄 수 있는 안정적인 선택지입니다.',
      '보험업 특성상 금리와 경제 여건 변화에 실적이 영향을 받을 수 있다는 점은 염두에 두는 것이 좋습니다.',
    ],
  },
  {
    code: '005930',
    name: '삼성전자',
    short: '삼성',
    weightPct: 10,
    weightBar: 40,
    reasons: [
      '삼성전자는 우리나라를 대표하는 정보기술 기업으로 반도체와 가전 등 다양한 분야에서 탄탄한 기반을 갖추고 있습니다.',
      '지금처럼 시장의 우려로 주가가 주춤하는 시기는 장기적인 관점에서 부담 없이 비중을 늘려갈 수 있는 기회로 볼 수 있습니다.',
      '글로벌 반도체 업황과 환율 변화가 실적에 영향을 줄 수 있는 만큼, 꾸준한 관심을 갖고 지켜보는 자세가 필요합니다.',
    ],
  },
  {
    code: '028260',
    name: '삼성물산',
    short: '삼물',
    weightPct: 10,
    weightBar: 40,
    reasons: [
      '삼성물산은 다양한 사업 부문을 안정적으로 운영하며 그룹의 중심을 잡고 있는 기업으로, 꾸준한 성장을 기대할 수 있는 탄탄한 기초 체력을 갖추고 있습니다.',
      '5년 이상의 긴 호흡으로 안정적인 자산 증식을 목표로 하는 투자자에게 든든한 중심을 잡아주는 종목입니다.',
      '주주 행동주의 등 지배구조 이슈가 주가에 영향을 줄 수 있으므로 관련 소식을 함께 확인하는 것이 좋습니다.',
    ],
  },
  {
    code: '000270',
    name: '기아',
    short: '기아',
    weightPct: 10,
    weightBar: 40,
    reasons: [
      '기아는 안정적인 실적을 바탕으로 꾸준히 자동차를 생산하며 시장에서 탄탄한 입지를 다져온 기업입니다.',
      '현재 주가가 큰 변동 없이 머물러 있는 상황은 5년 이상 길게 보고 투자하려는 분에게 여유를 갖고 접근할 수 있는 시점입니다.',
      '자동차 산업은 환율과 원자재 가격 변화에 영향을 받기 쉬우니, 실적 흐름을 주기적으로 점검하는 것이 좋습니다.',
    ],
  },
  {
    code: '005380',
    name: '현대차',
    short: '현대',
    weightPct: 2.5,
    weightBar: 10,
    reasons: [
      '현대차는 자동차 제조를 기반으로 미래 모빌리티 시장으로 사업 영역을 넓혀가며 탄탄한 실적을 유지하고 있는 기업입니다.',
      '5년 이상의 긴 호흡으로 투자를 바라보는 사용자에게는 지금과 같은 사업 확장 과정을 함께 지켜보는 것도 의미 있는 선택이 될 수 있습니다.',
      '최근 노조 파업 이슈 등 생산 차질 가능성이 있는 만큼, 관련 소식을 주의 깊게 살펴보는 것이 좋습니다.',
    ],
  },
  {
    code: '329180',
    name: 'HD현대중공업',
    short: 'HD현중',
    weightPct: 2.5,
    weightBar: 10,
    reasons: [
      'HD현대중공업은 바다 위를 누비는 거대한 배를 만들고 관련 설비를 구축하는 우리나라의 대표적인 조선 기업입니다.',
      '지금 당장은 업황에 대한 걱정스러운 시선이 많고 주가의 움직임도 더딘 편이지만, 5년 이상 길게 보면 수주 잔고 회복과 함께 반등할 여지가 있는 종목입니다.',
      '조선업은 글로벌 물동량과 선박 발주 사이클에 민감하므로, 업황 회복 속도를 꾸준히 지켜보는 것이 좋습니다.',
    ],
  },
  {
    code: '207940',
    name: '삼성바이오로직스',
    short: '삼바',
    weightPct: 2.5,
    weightBar: 10,
    reasons: [
      '삼성바이오로직스는 세계적인 수준의 바이오 의약품 생산 능력을 바탕으로 꾸준히 성장하고 있는 우량한 기업입니다.',
      '현재 주가가 다소 힘을 쓰지 못하고 있지만, 5년 이상 길게 보고 투자하려는 분에게는 오히려 여유를 갖고 접근할 수 있는 시점입니다.',
      '대규모 투자에 따른 단기 비용 부담이 실적에 영향을 줄 수 있으니, 수주 및 증설 관련 소식을 함께 확인하는 것이 좋습니다.',
    ],
  },
  {
    code: '373220',
    name: 'LG에너지솔루션',
    short: 'LG엔솔',
    weightPct: 2.5,
    weightBar: 10,
    reasons: [
      'LG에너지솔루션은 전기차 배터리 시장을 선도하는 기업으로, 장기적인 관점에서 에너지 전환의 핵심적인 역할을 담당하고 있습니다.',
      '현재는 시장 상황으로 인해 주가 움직임이 다소 더딘 편이지만, 5년 이상 길게 보고 투자하려는 분에게는 전기차 시장 성장과 함께할 수 있는 기회입니다.',
      '전기차 수요 둔화나 원자재 가격 변동이 실적에 영향을 줄 수 있어, 관련 산업 동향을 함께 지켜보는 것이 좋습니다.',
    ],
  },
];

export interface OrderRecord {
  datetime: string;
  code: string;
  name: string;
  side: 'BUY' | 'SELL';
  qty: number;
  price: number;
  amount: number;
  balanceAfter: number;
}

export const orderHistory: OrderRecord[] = [
  { datetime: '2026-07-08 08:01', code: '005930', name: '삼성전자', side: 'BUY', qty: 1, price: 277500, amount: 277500, balanceAfter: 9722500 },
  { datetime: '2026-07-08 08:03', code: '000660', name: 'SK하이닉스', side: 'BUY', qty: 1, price: 2150000, amount: 2150000, balanceAfter: 7572500 },
  { datetime: '2026-07-09 10:15', code: '005930', name: '삼성전자', side: 'BUY', qty: 1, price: 286000, amount: 286000, balanceAfter: 9150500 },
  { datetime: '2026-07-10 14:22', code: '005380', name: '현대차', side: 'SELL', qty: 1, price: 490000, amount: 490000, balanceAfter: 9640500 },
];

export interface WeeklyPnl {
  week: string;
  pnl: number;
}

export const weeklyPnl: WeeklyPnl[] = [
  { week: '6/15주', pnl: -18000 },
  { week: '6/22주', pnl: 32000 },
  { week: '6/29주', pnl: 12500 },
  { week: '7/6주', pnl: 54000 },
];
