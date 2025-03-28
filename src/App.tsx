import { useState, useCallback, useMemo, useEffect } from 'react';
import NoteInput from './components/NoteInput';
import NoteCard from './components/NoteCard';
import Stats from './components/Stats';
import Heatmap from './components/Heatmap';
import TagCloud from './components/TagCloud';
import NotesHeader from './components/NotesHeader';
import DataSync from './components/DataSync';
import { Note } from './types/note';
import { createNote, saveNotesToLocalStorage, loadNotesFromLocalStorage } from './utils/noteUtils';

const IMAGES_STORAGE_KEY = 'myflomo-images';

function App() {
    // 状态管理
    const [notes, setNotes] = useState<Note[]>(() => {
        // 在初始化时直接从 localStorage 加载数据
        const loadedNotes = loadNotesFromLocalStorage();
        if (loadedNotes.length > 0) {
            return loadedNotes;
        }
        // 如果没有笔记，创建欢迎笔记
        const welcomeNote = createNote(
            "欢迎使用 MyFlomo! 🎉\n\n这是一个简单的笔记应用，灵感来源于 flomo.app\n\n特点：\n- 简单记录想法和灵感\n- 使用 #标签 来组织笔记\n- 查看活动热力图\n- 数据保存在本地浏览器中\n\n试着创建你的第一条笔记吧！💡"
        );
        return [welcomeNote];
    });
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState('create-desc');

    // 监听笔记变化并保存到localStorage
    useEffect(() => {
        saveNotesToLocalStorage(notes);
    }, [notes]);

    // 添加新笔记
    const handleSubmit = useCallback((content: string) => {
        if (!content.trim()) return;

        const newNote = createNote(content);
        setNotes(prev => [newNote, ...prev]);
    }, []);

    // 删除笔记
    const handleDelete = useCallback((id: string) => {
        setNotes(prev => prev.filter(note => note.id !== id));
    }, []);

    // 编辑笔记
    const handleEdit = useCallback((id: string, content: string) => {
        setNotes(prev => prev.map(note => {
            if (note.id === id) {
                return {
                    ...note,
                    content,
                    updatedAt: Date.now(),
                    tags: (content.match(/#[^\s#]+/g) || []).map(tag => tag.slice(1))
                };
            }
            return note;
        }));
    }, []);

    // 处理标签选择
    const handleSelectTag = (tag: string) => {
        setSelectedTag(tag || null);
    };

    // 处理搜索
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    // 处理排序
    const handleSort = useCallback((option: string) => {
        setSortOption(option);
    }, []);

    // 导出数据
    const handleExport = useCallback(() => {
        const images = JSON.parse(localStorage.getItem(IMAGES_STORAGE_KEY) || '{}');
        return {
            notes,
            images
        };
    }, [notes]);

    // 导入数据
    const handleImport = useCallback((data: { notes: Note[], images: Record<string, string> }) => {
        // 验证数据格式
        if (!Array.isArray(data.notes) || typeof data.images !== 'object') {
            alert('导入失败：数据格式错误');
            return;
        }

        // 转换日期字符串为时间戳
        const processedNotes = data.notes.map(note => ({
            ...note,
            createdAt: typeof note.createdAt === 'string' ? new Date(note.createdAt).getTime() : note.createdAt,
            updatedAt: typeof note.updatedAt === 'string' ? new Date(note.updatedAt).getTime() : note.updatedAt
        }));

        // 保存笔记
        setNotes(processedNotes);

        // 保存图片
        localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(data.images));

        alert('数据导入成功！');
    }, []);

    // 根据选中的标签过滤笔记
    const filteredNotes = selectedTag
        ? notes.filter(note => note.tags.includes(selectedTag))
        : notes;

    // 根据搜索和排序过滤笔记
    const filteredAndSortedNotes = useMemo(() => {
        let filtered = filteredNotes;

        // 搜索过滤
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(note =>
                note.content.toLowerCase().includes(query) ||
                note.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // 排序
        return filtered.sort((a, b) => {
            switch (sortOption) {
                case 'create-asc':
                    return a.createdAt - b.createdAt;
                case 'create-desc':
                    return b.createdAt - a.createdAt;
                case 'edit-asc':
                    return a.updatedAt - b.updatedAt;
                case 'edit-desc':
                    return b.updatedAt - a.updatedAt;
                default:
                    return 0;
            }
        });
    }, [filteredNotes, searchQuery, sortOption]);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#3ab682] text-white font-bold text-lg">
                                M
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-gray-900">MyFlomo</h1>
                                <p className="text-xs text-gray-500">思想的数字花园</p>
                            </div>
                        </div>
                        <DataSync onExport={handleExport} onImport={handleImport} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* 左侧边栏 - 在小屏幕上隐藏 */}
                    <div className="hidden lg:block lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-lg shadow">
                            <Stats notes={notes} />
                        </div>

                        <div className="bg-white rounded-lg shadow p-4">
                            <Heatmap notes={notes} />
                        </div>

                        <div className="bg-white rounded-lg shadow">
                            <TagCloud
                                notes={notes}
                                selectedTag={selectedTag}
                                onSelectTag={handleSelectTag}
                            />
                        </div>
                    </div>

                    {/* 主内容区 - 在小屏幕上占满宽度 */}
                    <div className="col-span-1 lg:col-span-9 space-y-6">
                        <NoteInput onSubmit={handleSubmit} />

                        <NotesHeader
                            onSearch={handleSearch}
                            onSort={handleSort}
                        />

                        {selectedTag && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>已筛选:</span>
                                <span className="tag-item">
                                    #{selectedTag}
                                    <button
                                        onClick={() => handleSelectTag('')}
                                        className="ml-1 hover:text-gray-700"
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {filteredAndSortedNotes.length > 0 ? (
                                filteredAndSortedNotes.map(note => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        onDelete={handleDelete}
                                        onEdit={handleEdit}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">
                                        {selectedTag
                                            ? `没有包含 #${selectedTag} 标签的笔记`
                                            : searchQuery
                                                ? '没有找到匹配的笔记'
                                                : '暂无笔记，开始添加你的第一条笔记吧！'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 mt-10">
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center text-sm text-gray-500">
                        <p>MyFlomo - 一个简单的笔记应用</p>
                        <p className="mt-1">灵感来源于 flomo.app</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
