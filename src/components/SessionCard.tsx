import type { PracticeSession } from '../types';
import StarRating from './StarRating';

interface SessionCardProps {
  session: PracticeSession;
  materialName: string;
  onDelete: (id: string) => void;
}

export default function SessionCard({ session, materialName, onDelete }: SessionCardProps) {
  const handleDelete = () => {
    if (window.confirm('この練習記録を削除しますか？')) {
      onDelete(session.id);
    }
  };

  const memoPreview =
    session.memo && session.memo.length > 30 ? session.memo.slice(0, 30) + '…' : session.memo;

  return (
    <div className="card card-hover flex items-start justify-between">
      <div className="space-y-1">
        <p className="font-medium text-theme">{materialName}</p>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span>{session.durationMinutes}分</span>
          <StarRating value={session.selfEvaluation} readonly />
        </div>
        {memoPreview && <p className="text-sm text-faint">{memoPreview}</p>}
      </div>
      <button
        onClick={handleDelete}
        className="rounded-lg px-2 py-1 text-sm text-danger transition-colors hover:opacity-80"
      >
        削除
      </button>
    </div>
  );
}
