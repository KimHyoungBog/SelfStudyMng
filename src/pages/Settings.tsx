import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Subject, DayOfWeek, DAY_NAMES } from '../types';

const DAYS: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

function emptyTargetMinutes(): Partial<Record<DayOfWeek, number>> {
  return {};
}

interface SubjectFormProps {
  initial?: Subject;
  onSave: (s: Omit<Subject, 'id'>) => void;
  onCancel: () => void;
}

function SubjectForm({ initial, onSave, onCancel }: SubjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [targets, setTargets] = useState<Partial<Record<DayOfWeek, number>>>(
    initial?.targetMinutes ?? emptyTargetMinutes(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), targetMinutes: targets });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="subject-name">과목명</label>
        <input
          id="subject-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 수학"
          maxLength={20}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>요일별 목표 시간 (분, 0이면 해당 없음)</label>
        <div className="day-grid">
          {DAYS.map((day) => (
            <div className="day-cell" key={day}>
              <span>{DAY_NAMES[day]}</span>
              <input
                type="number"
                min={0}
                max={480}
                value={targets[day] ?? 0}
                aria-label={`${DAY_NAMES[day]}요일 목표 시간`}
                onChange={(e) => {
                  const v = Math.max(0, Number(e.target.value));
                  setTargets((prev) => ({ ...prev, [day]: v }));
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="btn-row">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          취소
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={!name.trim()}>
          저장
        </button>
      </div>
    </form>
  );
}

export default function Settings() {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('study-app:subjects', []);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addSubject = (data: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...data, id: crypto.randomUUID() };
    setSubjects((prev) => [...prev, newSubject]);
    setAdding(false);
  };

  const updateSubject = (id: string, data: Omit<Subject, 'id'>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { id, ...data } : s)));
    setEditingId(null);
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  const scheduleSummary = (s: Subject) => {
    const days = DAYS.filter((d) => (s.targetMinutes[d] ?? 0) > 0);
    if (days.length === 0) return '요일 미설정';
    return days.map((d) => `${DAY_NAMES[d]} ${s.targetMinutes[d]}분`).join(', ');
  };

  return (
    <div className="page">
      <h2 className="page-title">과목 설정</h2>

      {subjects.map((s) =>
        editingId === s.id ? (
          <SubjectForm
            key={s.id}
            initial={s}
            onSave={(data) => updateSubject(s.id, data)}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div className="subject-item" key={s.id}>
            <span className="subject-name">{s.name}</span>
            <span className="subject-schedule">{scheduleSummary(s)}</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setEditingId(s.id)}
              aria-label={`${s.name} 편집`}
            >
              편집
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteSubject(s.id)}
              aria-label={`${s.name} 삭제`}
            >
              삭제
            </button>
          </div>
        ),
      )}

      {adding ? (
        <SubjectForm onSave={addSubject} onCancel={() => setAdding(false)} />
      ) : (
        <button
          className="btn btn-primary"
          style={{ marginTop: subjects.length ? '0.5rem' : 0 }}
          onClick={() => setAdding(true)}
        >
          + 과목 추가
        </button>
      )}
    </div>
  );
}
