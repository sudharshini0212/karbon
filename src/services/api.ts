import {
  MineProfile,
  ActivityRecord,
  EmissionSummary,
  ReductionTarget,
  RoadmapStage,
  ProgressData,
  EmissionFactorConfig,
} from '../types/karbon.ts';

const API_BASE = '/api';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// MINE PROFILE
export async function getMineProfile(): Promise<MineProfile> {
  const result = await fetchJSON<{ success: boolean; data: MineProfile }>(`${API_BASE}/mine`);
  return result.data;
}

export async function updateMineProfile(data: Partial<MineProfile>): Promise<MineProfile> {
  const result = await fetchJSON<{ success: boolean; data: MineProfile }>(`${API_BASE}/mine`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

// ACTIVITIES
export async function getActivities(period?: string, category?: string): Promise<ActivityRecord[]> {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (category) params.append('category', category);
  const query = params.toString() ? `?${params.toString()}` : '';
  const result = await fetchJSON<{ success: boolean; data: ActivityRecord[] }>(`${API_BASE}/activities${query}`);
  return result.data;
}

export async function createActivity(data: Omit<ActivityRecord, 'id'>): Promise<ActivityRecord> {
  const result = await fetchJSON<{ success: boolean; data: ActivityRecord }>(`${API_BASE}/activities`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateActivity(id: string, data: Partial<ActivityRecord>): Promise<ActivityRecord> {
  const result = await fetchJSON<{ success: boolean; data: ActivityRecord }>(`${API_BASE}/activities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteActivity(id: string): Promise<void> {
  await fetchJSON<{ success: boolean }>(`${API_BASE}/activities/${id}`, {
    method: 'DELETE',
  });
}

// EMISSIONS
export async function getEmissions(period: string = '2025-10'): Promise<EmissionSummary> {
  const result = await fetchJSON<{ success: boolean; data: EmissionSummary }>(
    `${API_BASE}/emissions?period=${encodeURIComponent(period)}`
  );
  return result.data;
}

// REDUCTION TARGETS
export async function getTargets(): Promise<ReductionTarget[]> {
  const result = await fetchJSON<{ success: boolean; data: ReductionTarget[] }>(`${API_BASE}/targets`);
  return result.data;
}

export async function createTarget(data: Omit<ReductionTarget, 'id'>): Promise<ReductionTarget> {
  const result = await fetchJSON<{ success: boolean; data: ReductionTarget }>(`${API_BASE}/targets`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateTarget(id: string, data: Partial<ReductionTarget>): Promise<ReductionTarget> {
  const result = await fetchJSON<{ success: boolean; data: ReductionTarget }>(`${API_BASE}/targets/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteTarget(id: string): Promise<void> {
  await fetchJSON<{ success: boolean }>(`${API_BASE}/targets/${id}`, {
    method: 'DELETE',
  });
}

// ROADMAP
export async function getRoadmap(): Promise<RoadmapStage[]> {
  const result = await fetchJSON<{ success: boolean; data: RoadmapStage[] }>(`${API_BASE}/roadmap`);
  return result.data;
}

export async function createRoadmapStage(data: Partial<RoadmapStage>): Promise<RoadmapStage> {
  const result = await fetchJSON<{ success: boolean; data: RoadmapStage }>(`${API_BASE}/roadmap`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateRoadmapStage(id: string, data: Partial<RoadmapStage>): Promise<RoadmapStage> {
  const result = await fetchJSON<{ success: boolean; data: RoadmapStage }>(`${API_BASE}/roadmap/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

// PROGRESS
export async function getProgress(): Promise<ProgressData> {
  const result = await fetchJSON<{ success: boolean; data: ProgressData }>(`${API_BASE}/progress`);
  return result.data;
}

// FACTORS
export async function getFactors(): Promise<Record<string, EmissionFactorConfig>> {
  const result = await fetchJSON<{ success: boolean; data: Record<string, EmissionFactorConfig> }>(
    `${API_BASE}/factors`
  );
  return result.data;
}

export async function updateFactor(
  key: string,
  data: Partial<EmissionFactorConfig>
): Promise<EmissionFactorConfig> {
  const result = await fetchJSON<{ success: boolean; data: EmissionFactorConfig }>(
    `${API_BASE}/factors/${key}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    }
  );
  return result.data;
}

// REPORTS (collection: 'carbonreports')
export async function getReports(): Promise<any[]> {
  const result = await fetchJSON<{ success: boolean; data: any[] }>(`${API_BASE}/reports`);
  return result.data;
}

export async function createReport(data: any): Promise<any> {
  const result = await fetchJSON<{ success: boolean; data: any }>(`${API_BASE}/reports`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

// RESET DEMO
export async function resetDemoData(): Promise<void> {
  await fetchJSON<{ success: boolean }>(`${API_BASE}/reset-demo`, {
    method: 'POST',
  });
}

