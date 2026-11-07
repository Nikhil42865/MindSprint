import type { PersonalRecord } from "../types/challenge.ts";

const PERSONAL_RECORDS_KEY = "mindsprint:personal-records";
const STORAGE_VERSION = 1;
const MAX_RECORDS = 10;

type StoredPersonalRecords = {
  version: number;
  records: PersonalRecord[];
};

export function getPersonalRecords(): PersonalRecord[] {
  try {
    const raw = window.localStorage.getItem(PERSONAL_RECORDS_KEY);
    if (!raw) {
      return [];
    }

    const stored = JSON.parse(raw) as StoredPersonalRecords;
    return stored.version === STORAGE_VERSION && Array.isArray(stored.records)
      ? stored.records
      : [];
  } catch {
    return [];
  }
}

export function savePersonalRecord(record: PersonalRecord): boolean {
  try {
    const records = getPersonalRecords().filter(
      (existing) => existing.sessionId !== record.sessionId,
    );
    const stored: StoredPersonalRecords = {
      version: STORAGE_VERSION,
      records: [record, ...records].slice(0, MAX_RECORDS),
    };
    window.localStorage.setItem(PERSONAL_RECORDS_KEY, JSON.stringify(stored));
    return true;
  } catch {
    return false;
  }
}