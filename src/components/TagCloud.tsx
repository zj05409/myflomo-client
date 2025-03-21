import { useMemo } from 'react';
import { getAllTags } from '../utils/noteUtils';
import { Note } from '../types/note';

interface TagCloudProps {
    notes: Note[];
    selectedTag: string | null;
    onSelectTag: (tag: string) => void;
}

export default function TagCloud({ notes, selectedTag, onSelectTag }: TagCloudProps) {
    // 获取所有标签及其出现次数
    const tags = useMemo(() => getAllTags(notes), [notes]);

    // 按出现频率排序标签
    const sortedTags = useMemo(() => {
        return Object.entries(tags)
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => tag);
    }, [tags]);

    if (sortedTags.length === 0) {
        return (
            <div className="tag-cloud p-4">
                <h3 className="text-lg font-medium mb-4">标签</h3>
                <p className="text-sm text-gray-500 italic">暂无标签</p>
            </div>
        );
    }

    return (
        <div className="tag-cloud p-4">
            <h3 className="text-lg font-medium mb-4">标签</h3>
            <div className="flex flex-wrap gap-2">
                {sortedTags.map((tag) => (
                    <button
                        key={tag}
                        className={`tag-item ${selectedTag === tag ? 'bg-[#3ab682] text-white' : ''}`}
                        onClick={() => onSelectTag(tag)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mr-1 shrink-0"
                        >
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        {tag}
                        <span className="ml-1 text-xs opacity-70">({tags[tag]})</span>
                    </button>
                ))}
            </div>

            {selectedTag && (
                <div className="mt-4">
                    <button
                        className="text-sm text-[#3ab682] hover:underline flex items-center"
                        onClick={() => onSelectTag('')}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mr-1"
                        >
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        清除筛选
                    </button>
                </div>
            )}
        </div>
    );
} 