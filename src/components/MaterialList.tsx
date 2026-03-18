import { useState } from 'react';
import type { Material, PracticeSession } from '../types';
import { formatLength } from '../lib/format';
import MaterialForm from './MaterialForm';

interface MaterialListProps {
  materials: Material[];
  sessions: PracticeSession[];
  onUpdate: (id: string, values: Partial<Omit<Material, 'id' | 'createdAt'>>) => void;
  onDelete: (id: string) => void;
}

export default function MaterialList({
  materials,
  sessions,
  onUpdate,
  onDelete,
}: MaterialListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const sorted = [...materials].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleDelete = (material: Material) => {
    const count = sessions.filter((s) => s.materialId === material.id).length;
    const message =
      count > 0
        ? `この教材に紐づく${count}件の記録があります。教材を削除しても記録は残ります。`
        : 'この教材を削除しますか？';
    if (window.confirm(message)) {
      onDelete(material.id);
    }
  };

  return (
    <div className="space-y-3">
      {sorted.map((material) =>
        editingId === material.id ? (
          <div key={material.id} className="card">
            <MaterialForm
              initialValues={{
                name: material.name,
                lengthSeconds: material.lengthSeconds,
                url: material.url ?? '',
              }}
              onSubmit={(values) => {
                onUpdate(material.id, values);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
              submitLabel="更新"
            />
          </div>
        ) : (
          <div key={material.id} className="card card-hover flex items-center justify-between">
            <div>
              <p className="font-medium text-theme">{material.name}</p>
              <p className="text-sm text-muted">
                {formatLength(material.lengthSeconds)}
                {material.url && (
                  <>
                    {' ・ '}
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-accent"
                    >
                      リンク
                    </a>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingId(material.id)}
                className="rounded-lg px-3 py-1 text-sm text-muted transition-colors hover:opacity-80"
              >
                編集
              </button>
              <button
                onClick={() => handleDelete(material)}
                className="rounded-lg px-3 py-1 text-sm text-danger transition-colors hover:opacity-80"
              >
                削除
              </button>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
