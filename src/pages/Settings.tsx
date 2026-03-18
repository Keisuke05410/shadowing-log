import { useRef, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useAppData } from '../hooks/useAppData';
import { exportData, importData } from '../lib/storage';
import MaterialForm from '../components/MaterialForm';
import MaterialList from '../components/MaterialList';

export default function Settings() {
  const { data, addMaterial, updateMaterial, deleteMaterial, importAll } = useAppData();
  const [showAddForm, setShowAddForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasMaterials = data.materials.length > 0;

  const handleExport = () => {
    const json = exportData(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shadowing-log-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (!window.confirm('現在のデータはすべて上書きされます。よろしいですか？')) return;
        const newData = importData(reader.result as string);
        importAll(newData);
        toast.success('データをインポートしました');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'インポートに失敗しました');
      }
    };
    reader.onerror = () => {
      toast.error('ファイルの読み込みに失敗しました');
    };
    reader.readAsText(file);

    // 同じファイルを再選択可能にする
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <section>
        <h2 className="font-heading text-lg font-bold mb-4 text-theme">教材管理</h2>

        {!hasMaterials && !showAddForm ? (
          <div className="text-center py-8">
            <p className="mb-4 text-muted">教材を追加しましょう</p>
            <MaterialForm
              onSubmit={(values) => {
                addMaterial(values);
              }}
            />
          </div>
        ) : (
          <>
            <MaterialList
              materials={data.materials}
              sessions={data.sessions}
              onUpdate={updateMaterial}
              onDelete={deleteMaterial}
            />

            {showAddForm ? (
              <div className="mt-4 card">
                <h3 className="text-sm font-medium mb-3 text-muted">新しい教材を追加</h3>
                <MaterialForm
                  onSubmit={(values) => {
                    addMaterial(values);
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 w-full rounded-lg border border-dashed border-theme py-2 text-sm text-muted transition-colors"
              >
                + 教材を追加
              </button>
            )}
          </>
        )}
      </section>

      <section>
        <h2 className="font-heading text-lg font-bold mb-4 text-theme">データ管理</h2>
        <div className="flex gap-3">
          <button
            onClick={handleExport}
            className="rounded-lg px-4 py-2 text-sm font-medium bg-accent-soft text-muted transition-colors"
          >
            エクスポート
          </button>
          <label className="rounded-lg px-4 py-2 text-sm font-medium bg-accent-soft text-muted transition-colors cursor-pointer">
            インポート
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </section>
    </div>
  );
}
