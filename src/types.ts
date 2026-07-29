export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=일, 1=월, ..., 6=토

export const DAY_NAMES: Record<DayOfWeek, string> = {
  0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토',
};

export interface Subject {
  id: string;
  name: string;
  targetMinutes: Partial<Record<DayOfWeek, number>>;
}

export interface DailyRecord {
  date: string;       // YYYY-MM-DD
  subjectId: string;
  completed: boolean;
  actualMinutes: number;
}
