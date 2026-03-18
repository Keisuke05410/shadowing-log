import { useState, type FormEvent } from 'react';
import { secondsToMinSec } from '../lib/format';

interface MaterialFormProps {
  initialValues?: { name: string; lengthSeconds: number; url: string };
  onSubmit: (values: { name: string; lengthSeconds: number; url?: string }) => void;
  onCancel?: () => void;
  submitLabel?: string;
}

const baseInputClass = 'rounded-lg border border-theme px-3 py-2 text-sm text-theme transition-all';
const inputClass = `${baseInputClass} w-full`;

export default function MaterialForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = '登録',
}: MaterialFormProps) {
  const initial = initialValues
    ? {
        name: initialValues.name,
        ...secondsToMinSec(initialValues.lengthSeconds),
        url: initialValues.url,
      }
    : { name: '', min: '', sec: '00', url: '' };

  const [name, setName] = useState(initial.name);
  const [min, setMin] = useState(initial.min);
  const [sec, setSec] = useState(initial.sec);
  const [url, setUrl] = useState(initial.url);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: string[] = [];

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length > 100) {
      errs.push('教材名は1〜100文字で入力してください');
    }

    const minNum = parseInt(min || '0', 10);
    const secNum = parseInt(sec || '0', 10);
    const totalSeconds = minNum * 60 + secNum;
    if (isNaN(totalSeconds) || totalSeconds < 1 || totalSeconds > 3600) {
      errs.push('教材の長さは1秒〜3600秒（1時間）で入力してください');
    }

    if (url && url.length > 2048) {
      errs.push('URLは2048文字以内で入力してください');
    }

    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    setErrors([]);
    onSubmit({
      name: trimmedName,
      lengthSeconds: totalSeconds,
      url: url.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="text-sm space-y-1 text-danger">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          教材名 <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className={inputClass}
          placeholder="例: TED Talk - The Power of Vulnerability"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">
          教材の長さ <span className="text-danger">*</span>
        </label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            min={0}
            max={60}
            className={`${baseInputClass} w-20`}
            placeholder="分"
          />
          <span className="text-muted">:</span>
          <input
            type="number"
            value={sec}
            onChange={(e) => setSec(e.target.value)}
            min={0}
            max={59}
            className={`${baseInputClass} w-20`}
            placeholder="秒"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-muted">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          maxLength={2048}
          className={inputClass}
          placeholder="https://..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-theme-accent transition-colors"
        >
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-accent-soft text-muted transition-colors"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
