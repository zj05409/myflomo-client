import { useState, useEffect } from 'react';
import NoteInput from './components/NoteInput';
import NoteCard from './components/NoteCard';
import Stats from './components/Stats';
import Heatmap from './components/Heatmap';
import TagCloud from './components/TagCloud';
import { Note } from './types/note';
import { createNote, saveNotesToLocalStorage, loadNotesFromLocalStorage, sortNotesByDate, extractTags } from './utils/noteUtils';

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

  // 监听笔记变化并保存到localStorage
  useEffect(() => {
    saveNotesToLocalStorage(notes);
  }, [notes]);

  // 添加新笔记
  const handleNewNote = (content: string) => {
    if (!content.trim()) return;

    const newNote = createNote(content);
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
  };

  // 删除笔记
  const handleDeleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
  };

  // 编辑笔记
  const handleEditNote = (id: string, content: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, content, tags: extractTags(content), updatedAt: new Date() }
        : note
    );
    setNotes(updatedNotes);
  };

  // 处理标签选择
  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag || null);
  };

  // 根据选中的标签过滤笔记
  const filteredNotes = selectedTag
    ? notes.filter(note => note.tags.includes(selectedTag))
    : notes;

  // 按日期排序（最新的在前）
  const sortedNotes = sortNotesByDate(filteredNotes);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#3ab682]">MyFlomo</h1>
            <div className="text-sm text-gray-500">思想的数字花园</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧边栏 */}
          <div className="lg:col-span-3 space-y-6">
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

          {/* 主内容区 */}
          <div className="lg:col-span-9 space-y-6">
            <NoteInput onSubmit={handleNewNote} />

            {selectedTag && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center">
                  <span className="tag-item bg-[#3ab682] text-white">
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
                    {selectedTag}
                  </span>
                  <button
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedTag(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {sortedNotes.length > 0 ? (
                sortedNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={handleDeleteNote}
                    onEdit={handleEditNote}
                  />
                ))
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">
                    {selectedTag
                      ? `没有包含 #${selectedTag} 标签的笔记`
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
