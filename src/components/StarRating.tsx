interface StarRatingProps {
  value: number;
  onChange?: (value: 1 | 2 | 3 | 4 | 5) => void;
  readonly?: boolean;
}

export default function StarRating({ value, onChange, readonly = false }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star as 1 | 2 | 3 | 4 | 5)}
          className={`text-2xl transition-all ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${star <= value ? 'text-accent' : ''}`}
          style={star <= value ? undefined : { color: 'var(--border)' }}
          aria-label={`${star}点`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
