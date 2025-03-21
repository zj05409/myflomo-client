import { useState } from 'react';
import { format } from 'date-fns';
import { Note } from '../types/note';
import { ClockIcon, EditIcon, DeleteIcon, SaveIcon, CancelIcon, TagIcon } from './icons';

interface NoteCardProps {
    note: Note;
    onDelete?: (id: string) => void;
    onEdit?: (id: string, content: string) => void;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(note.content);

    // 处理笔记内容，移除标签
    const displayContent = note.content.replace(/#[^\s#]+/g, '').trim();

    const handleEdit = () => {
        setIsEditing(true);
        setEditContent(note.content);
    };

    const handleSave = () => {
        if (onEdit && editContent.trim() !== '') {
            onEdit(note.id, editContent);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditContent(note.content);
    };

    return (
        <div className="note-card group">
            {/* 日期 */}
            <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                <div className="flex items-center">
                    <ClockIcon className="mr-1 shrink-0" />
                    {format(note.createdAt, 'yyyy-MM-dd HH:mm:ss')}
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {!isEditing && (
                        <>
                            <button
                                onClick={handleEdit}
                                className="text-gray-400 hover:text-[#3ab682] mr-2"
                                aria-label="编辑笔记"
                            >
                                <EditIcon />
                            </button>
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(note.id)}
                                    className="text-gray-400 hover:text-red-500"
                                    aria-label="删除笔记"
                                >
                                    <DeleteIcon />
                                </button>
                            )}
                        </>
                    )}
                    {isEditing && (
                        <>
                            <button
                                onClick={handleSave}
                                className="text-[#3ab682] hover:text-[#34a476] mr-2"
                                aria-label="保存"
                            >
                                <SaveIcon />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="取消"
                            >
                                <CancelIcon />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 笔记内容 */}
            <div className="mb-2">
                {isEditing ? (
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full min-h-[100px] p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#3ab682] focus:border-[#3ab682]"
                        placeholder="编辑笔记..."
                    />
                ) : (
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{displayContent}</p>
                )}
            </div>

            {/* 标签 */}
            {note.tags.length > 0 && !isEditing && (
                <div className="flex flex-wrap gap-1.5">
                    {note.tags.map((tag) => (
                        <span
                            key={tag}
                            className="tag-item"
                        >
                            <TagIcon className="mr-1 shrink-0" />
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
} 