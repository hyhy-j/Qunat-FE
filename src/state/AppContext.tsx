import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ProfileResult, SurveyState } from '../types';
import { computeProfile } from '../types';

interface AppContextValue {
  survey: SurveyState;
  setGoal: (goal: string) => void;
  setRisk: (riskVal: number) => void;
  setPeriod: (period: string, periodScore: number) => void;
  setAmount: (amountTier: string, amountScore: number) => void;
  setInvestableAmount: (amount: number) => void;
  profile: ProfileResult | null;
  finalizeProfile: () => ProfileResult;
  introShown: boolean;
  markIntroShown: () => void;
}

const RISK_SCORES = [0, 0, 12, 25, 37, 50];

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

export function AppProvider({ children }: { children: ReactNode }) {
  const [survey, setSurvey] = useState<SurveyState>(initialSurvey);
  const [profile, setProfile] = useState<ProfileResult | null>(null);
  const [introShown, setIntroShown] = useState(false);

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
      finalizeProfile: () => {
        const result = computeProfile(survey);
        setProfile(result);
        return result;
      },
      introShown,
      markIntroShown: () => setIntroShown(true),
    }),
    [survey, profile, introShown],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
