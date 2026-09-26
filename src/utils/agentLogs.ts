import type { AgentActivityLogResponse } from '../api/types';
import type { AgentLogEntry } from '../components/AgentActivityLog';

const AGENT_MESSAGES: Record<string, { label: string; success: string; failure: string }> = {
  REPORT_GENERATOR: {
    label: 'AGENT1',
    success: '주가와 뉴스, 시장 감성 데이터를 수집·분석해 오늘의 리포트를 완성했습니다.',
    failure: '오늘의 리포트 생성에 실패했습니다.',
  },
  PORTFOLIO_GENERATOR: {
    label: 'AGENT2',
    success: '모멘텀 전략을 바탕으로 오늘의 추천 포트폴리오 구성을 새로 생성했습니다.',
    failure: '포트폴리오 생성에 실패했습니다.',
  },
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function buildSystemLogEntries(logs: AgentActivityLogResponse[], limit = 5): AgentLogEntry[] {
  return logs
    .filter((log) => AGENT_MESSAGES[log.agentType])
    .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
    .map((log) => {
      const meta = AGENT_MESSAGES[log.agentType];
      return {
        time: formatTime(log.finishedAt ?? log.startedAt),
        agent: meta.label,
        message: log.status === 'FAILED' ? meta.failure : meta.success,
      };
    })
    .slice(0, limit);
}
