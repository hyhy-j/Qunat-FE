export type ProfileType = 'STABLE' | 'NEUTRAL' | 'AGGRESSIVE';

export interface SurveyState {
  goal: string;
  riskVal: number;
  riskScore: number;
  period: string;
  periodScore: number;
  amountTier: string;
  amountScore: number;
  investableAmount: number;
}

export interface ProfileResult {
  type: ProfileType;
  typeKr: string;
  desc: string;
  totalScore: number;
}

export const RISK_LABELS = [
  '',
  '아주 작은 손실도 꺼림',
  '소폭 손실 감수 가능',
  '어느 정도 감수 가능',
  '상당한 손실 감수 가능',
  '높은 손실도 감수 가능',
] as const;

export const RISK_SCORES = [0, 0, 12, 25, 37, 50] as const;

export function computeProfile(state: SurveyState): ProfileResult {
  const totalScore = state.riskScore + state.periodScore + state.amountScore;
  if (totalScore <= 33) {
    return {
      type: 'STABLE',
      typeKr: '안정형 투자자',
      desc: '안정성을 최우선으로 추구하는 투자자입니다. 감성 점수 상위 종목 중심으로 리스크를 최소화한 포트폴리오를 구성해 드렸습니다.',
      totalScore,
    };
  }
  if (totalScore <= 66) {
    return {
      type: 'NEUTRAL',
      typeKr: '중립형 투자자',
      desc: '안정성과 성장성의 균형을 추구하는 투자자입니다. 모멘텀 전략 기반으로 맞춤 포트폴리오를 구성해 드렸습니다.',
      totalScore,
    };
  }
  return {
    type: 'AGGRESSIVE',
    typeKr: '공격형 투자자',
    desc: '높은 수익을 목표로 적극적으로 투자하는 투자자입니다. 모멘텀 상위 종목에 집중한 공격적 포트폴리오를 구성해 드렸습니다.',
    totalScore,
  };
}
