import React from 'react';
import { Note } from '../types/note';

interface DataSyncProps {
    onImport: (data: { notes: Note[], images: Record<string, string> }) => void;
    onExport: () => { notes: Note[], images: Record<string, string> };
}

const DataSync: React.FC<DataSyncProps> = ({ onImport, onExport }) => {
    const handleExport = () => {
        const data = onExport();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `myflomo-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                onImport(data);
            } catch {
                alert('导入失败：文件格式错误');
            }
        };
        reader.readAsText(file);
        // 重置 input 的值,这样可以重复导入同一个文件
        event.target.value = '';
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleExport}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                导出数据
            </button>
            <label className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
                <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                导入数据
                <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                />
            </label>
        </div>
    );
};

export default DataSync; 