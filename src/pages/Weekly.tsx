import { useLocalStorage } from '../hooks/useLocalStorage';
import { Subject, DailyRecord, DayOfWeek } from '../types';

function getWeekDates(today: Date): string[] {
  const day = today.getDay(); // 0=일
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day === 0 ? 7 : day) - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export default function Weekly() {
  const [subjects] = useLocalStorage<Subject[]>('study-app:subjects', []);
  const [records] = useLocalStorage<DailyRecord[]>('study-app:records', []);

  const weekDates = getWeekDates(new Date());
  const weekSet = new Set(weekDates);

  const weekRecords = records.filter((r) => weekSet.has(r.date));

  const rows = subjects.map((s) => {
    const targetTotal = weekDates.reduce((sum, dateStr) => {
      const day = new Date(dateStr).getDay() as DayOfWeek;
      return sum + (s.targetMinutes[day] ?? 0);
    }, 0);

    const actualTotal = weekRecords
      .filter((r) => r.subjectId === s.id)
      .reduce((sum, r) => sum + r.actualMinutes, 0);

    const rate = targetTotal > 0 ? Math.min(100, Math.round((actualTotal / targetTotal) * 100)) : 0;

    return { subject: s, targetTotal, actualTotal, rate };
  });

  const weekLabel = `${weekDates[0].slice(5).replace('-', '/')} ~ ${weekDates[6].slice(5).replace('-', '/')}`;

  if (subjects.length === 0) {
    return (
      <div className="page">
        <h2 className="page-title">주간 요약</h2>
        <div className="empty-state">
          <p>등록된 과목이 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page-title">주간 요약 — {weekLabel}</h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="weekly-table">
          <thead>
            <tr>
              <th>과목</th>
              <th>목표</th>
              <th>실제</th>
              <th>달성률</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ subject, targetTotal, actualTotal, rate }) => (
              <tr key={subject.id}>
                <td style={{ fontWeight: 600 }}>{subject.name}</td>
                <td>{targetTotal}분</td>
                <td>{actualTotal}분</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="rate-bar-bg">
                      <div className="rate-bar-fill" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="rate-text">{rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
