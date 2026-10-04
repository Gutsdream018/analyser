import snapshotData from './snapshot.json';

export interface PersistedCacheData {
  indices?: Record<string, unknown>;
  screener?: unknown[];
  quotes?: Record<string, unknown>;
  fiiDii?: unknown[];
  movers?: Record<string, unknown>;
  stocks?: Record<string, unknown>;
  updatedAt: string;
}

let inMemoryPersisted: PersistedCacheData = snapshotData as PersistedCacheData;

export function loadPersistedCache(): PersistedCacheData {
  return inMemoryPersisted;
}

export function savePersistedCache(data: Partial<PersistedCacheData>): void {
  inMemoryPersisted = {
    ...inMemoryPersisted,
    ...data,
    indices: { ...inMemoryPersisted.indices, ...(data.indices || {}) },
    quotes: { ...inMemoryPersisted.quotes, ...(data.quotes || {}) },
    movers: { ...inMemoryPersisted.movers, ...(data.movers || {}) },
    stocks: { ...inMemoryPersisted.stocks, ...(data.stocks || {}) },
    updatedAt: new Date().toISOString(),
  };
}
