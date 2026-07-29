import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Subject, DailyRecord, DayOfWeek, DAY_NAMES } from '../types';
import { toLocalDateString } from '../utils/date';

export default function Today() {
  const [subjects] = useLocalStorage<Subject[]>('study-app:subjects', []);
  const [records, setRecords] = useLocalStorage<DailyRecord[]>('study-app:records', []);

  const today = new Date();
  const todayStr = toLocalDateString(today);
  const todayDay = today.getDay() as DayOfWeek;

  const todaySubjects = subjects.filter((s) => (s.targetMinutes[todayDay] ?? 0) > 0);

  const getRecord = (subjectId: string): DailyRecord | undefined =>
    records.find((r) => r.date === todayStr && r.subjectId === subjectId);

  const upsertRecord = (subjectId: string, patch: Partial<Omit<DailyRecord, 'date' | 'subjectId'>>) => {
    setRecords((prev) => {
      const existing = prev.find((r) => r.date === todayStr && r.subjectId === subjectId);
      if (existing) {
        return prev.map((r) =>
          r.date === todayStr && r.subjectId === subjectId ? { ...r, ...patch } : r,
        );
      }
      return [
        ...prev,
        { date: todayStr, subjectId, completed: false, actualMinutes: 0, ...patch },
      ];
    });
  };

  if (subjects.length === 0) {
    return (
      <div className="page">
        <h2 className="page-title">오늘의 학습</h2>
        <div className="empty-state">
          <p>과목을 먼저 등록하세요.</p>
          <Link to="/settings" className="btn btn-primary">
            과목 설정으로 이동
          </Link>
        </div>
      </div>
    );
  }

  if (todaySubjects.length === 0) {
    return (
      <div className="page">
        <h2 className="page-title">오늘의 학습</h2>
        <div className="empty-state">
          <p>오늘({DAY_NAMES[todayDay]}요일) 예정된 학습이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">
        오늘의 학습 — {today.getMonth() + 1}월 {today.getDate()}일 ({DAY_NAMES[todayDay]})
      </h2>

      {todaySubjects.map((s) => {
        const rec = getRecord(s.id);
        const completed = rec?.completed ?? false;
        const actualMinutes = rec?.actualMinutes ?? 0;
        const target = s.targetMinutes[todayDay] ?? 0;

        return (
          <div className={`today-item${completed ? ' completed' : ''}`} key={s.id}>
            <input
              type="checkbox"
              className="today-checkbox"
              checked={completed}
              aria-label={`${s.name} 완료`}
              onChange={(e) => upsertRecord(s.id, { completed: e.target.checked })}
            />
            <span className={`today-subject-name${completed ? ' done' : ''}`}>{s.name}</span>
            <span className="today-target">목표 {target}분</span>
            <div className="time-input-wrap">
              <input
                type="number"
                min={0}
                max={720}
                value={actualMinutes}
                aria-label={`${s.name} 실제 시간`}
                onChange={(e) =>
                  upsertRecord(s.id, {
                    actualMinutes: Math.min(720, Math.max(0, Number(e.target.value))),
                  })
                }
              />
              <span>분</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
