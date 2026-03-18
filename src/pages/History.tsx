import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAppData } from '../hooks/useAppData';
import SessionCard from '../components/SessionCard';

export default function History() {
  const { data, deleteSession } = useAppData();
  const { sessions, materials } = data;
  const location = useLocation();

  const materialMap = useMemo(() => new Map(materials.map((m) => [m.id, m.name])), [materials]);

  // 日付でグループ化（新しい順）
  const grouped = useMemo(() => {
    const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));
    const groups = new Map<string, typeof sessions>();
    for (const s of sorted) {
      const existing = groups.get(s.date) ?? [];
      existing.push(s);
      groups.set(s.date, existing);
    }
    return groups;
  }, [sessions]);

  // 月ごとにグループ化
  const monthGroups = useMemo(() => {
    const months = new Map<string, string[]>();
    for (const date of grouped.keys()) {
      const month = date.slice(0, 7);
      const existing = months.get(month) ?? [];
      existing.push(date);
      months.set(month, existing);
    }
    return months;
  }, [grouped]);

  const currentMonth = format(new Date(), 'yyyy-MM');

  // ヒートマップからのジャンプ対応
  const jumpToDate = (location.state as { jumpToDate?: string } | null)?.jumpToDate;
  const jumpMonth = jumpToDate?.slice(0, 7);

  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(() => {
    const initial = new Set([currentMonth]);
    if (jumpMonth) initial.add(jumpMonth);
    return initial;
  });

  // ジャンプ先へスクロール
  useEffect(() => {
    if (jumpToDate) {
      setTimeout(() => {
        const el = document.getElementById(`date-${jumpToDate}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [jumpToDate]);

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) {
        next.delete(month);
      } else {
        next.add(month);
      }
      return next;
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <p className="font-heading text-4xl mb-2" style={{ color: 'var(--text-faint)' }}>
          ☰
        </p>
        <p className="mb-4" style={{ color: 'var(--text-muted)' }}>
          まだ記録がありません
        </p>
        <Link
          to="/record"
          className="inline-block rounded-full px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          記録する
        </Link>
      </div>
    );
  }

  const sortedMonths = [...monthGroups.keys()].sort().reverse();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {sortedMonths.map((month) => {
        const dates = monthGroups.get(month)!;
        const isExpanded = expandedMonths.has(month);
        const sessionCount = dates.reduce((sum, d) => sum + (grouped.get(d)?.length ?? 0), 0);
        const monthDate = parseISO(`${month}-01`);
        const monthLabel = format(monthDate, 'yyyy年M月', { locale: ja });

        return (
          <div key={month}>
            <button
              onClick={() => toggleMonth(month)}
              className="flex items-center gap-2 text-sm font-medium mb-3 transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              <span
                className="transition-transform inline-block"
                style={{ transform: isExpanded ? 'rotate(90deg)' : undefined }}
              >
                ▶
              </span>
              {monthLabel}（{sessionCount}件）
            </button>

            {isExpanded && (
              <div className="space-y-4 ml-4">
                {dates.map((date) => {
                  const daySessions = grouped.get(date)!;
                  const dateObj = parseISO(date);
                  const dateLabel = format(dateObj, 'yyyy年M月d日（E）', { locale: ja });

                  return (
                    <div key={date} id={`date-${date}`}>
                      <h3
                        className="text-sm font-medium mb-2"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {dateLabel}
                      </h3>
                      <div className="space-y-2">
                        {daySessions.map((session) => (
                          <SessionCard
                            key={session.id}
                            session={session}
                            materialName={materialMap.get(session.materialId) ?? '（削除済み教材）'}
                            onDelete={deleteSession}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
