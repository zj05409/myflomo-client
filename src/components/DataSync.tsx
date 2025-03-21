import React, { useState } from 'react';
import { DownloadIcon, UploadIcon } from './icons';
import { Note } from '../types/note';

interface DataSyncProps {
    onExport: () => { notes: Note[]; images: Record<string, string> };
    onImport: (data: { notes: Note[]; images: Record<string, string> }) => void;
}

export default function DataSync({ onExport, onImport }: DataSyncProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 导出所有数据
    const handleExport = () => {
        try {
            const exportData = onExport();
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `myflomo-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('导出失败:', error);
            setError('导出失败，请重试');
        }
    };

    // 导入所有数据
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setError(null);

        try {
            const text = await file.text();
            const importData = JSON.parse(text);

            // 验证导入数据的格式
            if (!importData.notes || !importData.images) {
                throw new Error('无效的备份文件格式');
            }

            // 使用传入的 onImport 处理导入
            onImport(importData);
        } catch (error) {
            console.error('导入失败:', error);
            setError('导入失败，请确保文件格式正确');
        } finally {
            setIsImporting(false);
            // 清除文件输入，允许重复导入相同文件
            event.target.value = '';
        }
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    title="导出数据"
                >
                    <DownloadIcon className="w-4 h-4" />
                    导出
                </button>

                <div className="relative">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                        id="import-input"
                        disabled={isImporting}
                    />
                    <label
                        htmlFor="import-input"
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors cursor-pointer ${isImporting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        title="导入数据"
                    >
                        <UploadIcon className="w-4 h-4" />
                        {isImporting ? '导入中...' : '导入'}
                    </label>
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
} 