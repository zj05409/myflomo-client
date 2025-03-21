import { Note } from '../types/note';

/**
 * 从笔记内容中提取标签
 * @param content 笔记内容
 * @returns 提取的标签数组
 */
export function extractTags(content: string): string[] {
    const tagRegex = /#([^\s#]+)/g;
    const matches = content.match(tagRegex);

    if (!matches) return [];

    // 移除 # 符号并去重
    return [...new Set(matches.map(tag => tag.slice(1)))];
}

/**
 * 创建新笔记对象
 * @param content 笔记内容
 * @returns 新的笔记对象
 */
export function createNote(content: string): Note {
    const now = Date.now();
    const tags = extractTags(content);

    return {
        id: crypto.randomUUID(), // 使用浏览器原生 UUID 生成器
        content,
        tags,
        createdAt: now,
        updatedAt: now
    };
}

/**
 * 更新笔记内容和标签
 * @param note 要更新的笔记
 * @param content 新的笔记内容
 * @returns 更新后的笔记
 */
export function updateNote(note: Note, content: string): Note {
    return {
        ...note,
        content,
        tags: extractTags(content),
        updatedAt: Date.now()
    };
}

/**
 * 按标签过滤笔记
 * @param notes 笔记列表
 * @param tag 要过滤的标签
 * @returns 包含指定标签的笔记
 */
export function filterNotesByTag(notes: Note[], tag: string): Note[] {
    if (!tag) return notes;
    return notes.filter(note => note.tags.includes(tag));
}

/**
 * 按日期排序笔记
 * @param notes 笔记列表
 * @param ascending 是否升序（从早到晚）
 * @returns 排序后的笔记
 */
export function sortNotesByDate(notes: Note[], ascending = false): Note[] {
    return [...notes].sort((a, b) => {
        const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return ascending ? comparison : -comparison;
    });
}

/**
 * 将笔记数据保存到 localStorage
 * @param notes 要保存的笔记列表
 */
export function saveNotesToLocalStorage(notes: Note[]): void {
    try {
        localStorage.setItem('myflomo-notes', JSON.stringify(notes));
    } catch (error) {
        console.error('Failed to save notes to localStorage:', error);
    }
}

/**
 * 从 localStorage 加载笔记数据
 * @returns 加载的笔记列表
 */
export function loadNotesFromLocalStorage(): Note[] {
    try {
        const notesJson = localStorage.getItem('myflomo-notes');
        if (!notesJson) return [];

        const notes = JSON.parse(notesJson);

        // 确保日期是数字类型
        return notes.map((note: Partial<Note>) => ({
            ...note,
            createdAt: typeof note.createdAt === 'string' ? new Date(note.createdAt).getTime() : note.createdAt,
            updatedAt: typeof note.updatedAt === 'string' ? new Date(note.updatedAt).getTime() : note.updatedAt
        }));
    } catch (error) {
        console.error('Failed to load notes from localStorage:', error);
        return [];
    }
}

/**
 * 获取所有唯一标签及其使用次数
 * @param notes 笔记列表
 * @returns 标签及其使用次数的字典
 */
export function getAllTags(notes: Note[]): Record<string, number> {
    return notes.reduce((acc, note) => {
        note.tags.forEach(tag => {
            if (acc[tag]) {
                acc[tag] += 1;
            } else {
                acc[tag] = 1;
            }
        });
        return acc;
    }, {} as Record<string, number>);
}