import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ProfileResult, SurveyState } from '../types';

export interface AgentEvent {
  time: string;
  agent: 'AGENT1' | 'AGENT2' | 'AGENT3';
  message: string;
}

interface AppContextValue {
  survey: SurveyState;
  setGoal: (goal: string) => void;
  setRisk: (riskVal: number) => void;
  setPeriod: (period: string, periodScore: number) => void;
  setAmount: (amountTier: string, amountScore: number) => void;
  setInvestableAmount: (amount: number) => void;
  profile: ProfileResult | null;
  setProfile: (profile: ProfileResult) => void;
  introShown: boolean;
  markIntroShown: () => void;
  agentEvents: AgentEvent[];
  pushAgentEvent: (message: string) => void;
}

const RISK_SCORES = [0, 0, 12, 25, 37, 50];
const MAX_AGENT_EVENTS = 5;

const initialSurvey: SurveyState = {
  goal: '',
  riskVal: 3,
  riskScore: 25,
  period: '',
  periodScore: 0,
  amountTier: '',
  amountScore: 0,
  investableAmount: 0,
};

const AppContext = createContext<AppContextValue | null>(null);

function formatTime(date: Date) {
  return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [survey, setSurvey] = useState<SurveyState>(initialSurvey);
  const [profile, setProfileState] = useState<ProfileResult | null>(null);
  const [introShown, setIntroShown] = useState(false);
  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);

  const value = useMemo<AppContextValue>(
    () => ({
      survey,
      setGoal: (goal) => setSurvey((s) => ({ ...s, goal })),
      setRisk: (riskVal) =>
        setSurvey((s) => ({ ...s, riskVal, riskScore: RISK_SCORES[riskVal] })),
      setPeriod: (period, periodScore) =>
        setSurvey((s) => ({ ...s, period, periodScore })),
      setAmount: (amountTier, amountScore) =>
        setSurvey((s) => ({ ...s, amountTier, amountScore })),
      setInvestableAmount: (investableAmount) =>
        setSurvey((s) => ({ ...s, investableAmount })),
      profile,
      setProfile: (result) => setProfileState(result),
      introShown,
      markIntroShown: () => setIntroShown(true),
      agentEvents,
      pushAgentEvent: (message) =>
        setAgentEvents((events) => {
          const entry: AgentEvent = { time: formatTime(new Date()), agent: 'AGENT3', message };
          return [entry, ...events].slice(0, MAX_AGENT_EVENTS);
        }),
    }),
    [survey, profile, introShown, agentEvents],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
