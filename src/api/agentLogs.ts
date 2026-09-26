import { get } from './client';
import type { AgentActivityLogResponse } from './types';

export function getAgentLogs() {
  return get<AgentActivityLogResponse[]>('/api/agent-logs');
}
