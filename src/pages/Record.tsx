import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppData } from '../hooks/useAppData';
import { calculateStreak } from '../lib/streak';
import { getPositiveMessage, RETURNING_MESSAGE } from '../lib/messages';
import StarRating from '../components/StarRating';
import MaterialForm from '../components/MaterialForm';
import EmptyState from '../components/EmptyState';

const PRESET_MINUTES = [5, 10, 15, 30];
const NEW_MATERIAL_VALUE = '__new__' as const;

export default function Record() {
  const navigate = useNavigate();
  const { data, addSession, addMaterial } = useAppData();
  const { materials, sessions } = data;

  // 教材0件
  if (materials.length === 0) {
    return (
      <EmptyState
        icon="✎"
        message="教材を登録してから記録しましょう"
        linkTo="/settings"
        linkLabel="設定画面へ"
      />
    );
  }

  // デフォルト教材の決定
  const latestSession = [...sessions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];
  const defaultMaterialId =
    latestSession && materials.some((m) => m.id === latestSession.materialId)
      ? latestSession.materialId
      : materials[0].id;

  return (
    <RecordForm
      defaultMaterialId={defaultMaterialId}
      materials={materials}
      sessions={sessions}
      onSubmit={(values) => {
        // ストリーク断絶チェック（保存前）
        const streakBefore = calculateStreak(sessions);
        const wasBreaking = streakBefore.current === 0 && sessions.length > 0;

        addSession(values);

        if (wasBreaking) {
          toast.success(RETURNING_MESSAGE);
        } else {
          toast.success(getPositiveMessage());
        }
        navigate('/');
      }}
      onAddMaterial={addMaterial}
    />
  );
}

interface RecordFormProps {
  defaultMaterialId: string;
  materials: { id: string; name: string }[];
  sessions: { date: string }[];
  onSubmit: (values: {
    date: string;
    materialId: string;
    durationMinutes: number;
    selfEvaluation: 1 | 2 | 3 | 4 | 5;
    memo?: string;
  }) => void;
  onAddMaterial: (input: { name: string; lengthSeconds: number; url?: string }) => {
    id: string;
  };
}

function RecordForm({ defaultMaterialId, materials, onSubmit, onAddMaterial }: RecordFormProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [dateValue, setDate] = useState(todayStr);
  const [materialId, setMaterialId] = useState(defaultMaterialId);
  const [duration, setDuration] = useState<number | ''>('');
  const [evaluation, setEvaluation] = useState<number>(0);
  const [memo, setMemo] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [showNewMaterial, setShowNewMaterial] = useState(false);

  const handleMaterialSelect = (value: string) => {
    if (value === NEW_MATERIAL_VALUE) {
      setShowNewMaterial(true);
    } else {
      setMaterialId(value);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];

    if (!dateValue) errs.push('日付を入力してください');
    if (dateValue > todayStr) errs.push('未来の日付は指定できません');
    if (!duration || duration < 1 || duration > 180)
      errs.push('練習時間は1〜180分で入力してください');
    if (evaluation < 1 || evaluation > 5) errs.push('自己評価を選択してください');
    if (memo.length > 500) errs.push('メモは500文字以内で入力してください');

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    onSubmit({
      date: dateValue,
      materialId,
      durationMinutes: duration as number,
      selfEvaluation: evaluation as 1 | 2 | 3 | 4 | 5,
      memo: memo.trim() || undefined,
    });
  };

  if (showNewMaterial) {
    return (
      <div className="space-y-4 animate-fade-in-up">
        <h2 className="font-heading text-lg font-bold text-theme">新しい教材を登録</h2>
        <MaterialForm
          onSubmit={(values) => {
            const newMaterial = onAddMaterial(values);
            setMaterialId(newMaterial.id);
            setShowNewMaterial(false);
          }}
          onCancel={() => setShowNewMaterial(false)}
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
      <h2 className="font-heading text-lg font-bold text-theme">練習を記録</h2>

      {errors.length > 0 && (
        <div className="text-sm space-y-1 text-danger">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          日付 <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          value={dateValue}
          max={todayStr}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-theme px-3 py-2 text-sm text-theme transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          教材 <span className="text-danger">*</span>
        </label>
        <select
          value={materialId}
          onChange={(e) => handleMaterialSelect(e.target.value)}
          className="w-full rounded-lg border border-theme px-3 py-2 text-sm text-theme transition-all"
        >
          {materials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
          <option value={NEW_MATERIAL_VALUE}>+ 新規登録</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          練習時間（分） <span className="text-danger">*</span>
        </label>
        <div className="flex gap-2 mb-2">
          {PRESET_MINUTES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setDuration(m)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                duration === m
                  ? 'bg-theme-accent text-white'
                  : 'bg-accent-soft text-muted'
              }`}
            >
              {m}分
            </button>
          ))}
        </div>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
          min={1}
          max={180}
          placeholder="カスタム入力"
          className="w-32 rounded-lg border border-theme px-3 py-2 text-sm text-theme transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          自己評価 <span className="text-danger">*</span>
        </label>
        <StarRating value={evaluation} onChange={setEvaluation} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">メモ</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full rounded-lg border border-theme px-3 py-2 text-sm text-theme transition-all"
          placeholder="気づいたことなど..."
        />
        <p className="text-xs mt-1 text-faint">{memo.length}/500</p>
      </div>

      <button
        type="submit"
        className="w-full rounded-full px-4 py-3 text-sm font-medium text-white bg-theme-accent transition-colors"
      >
        記録を保存
      </button>
    </form>
  );
}
