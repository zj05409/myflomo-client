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
    const now = new Date();
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
    const tags = extractTags(content);

    return {
        ...note,
        content,
        tags,
        updatedAt: new Date()
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
        // 处理日期对象，将其转为 ISO 字符串
        const notesToSave = notes.map(note => ({
            ...note,
            createdAt: note.createdAt.toISOString(),
            updatedAt: note.updatedAt.toISOString()
        }));
        const serializedNotes = JSON.stringify(notesToSave);
        localStorage.setItem('myflomo-notes', serializedNotes);
    } catch (error) {
        console.error('保存笔记到本地存储失败', error);
    }
}

/**
 * 从 localStorage 加载笔记数据
 * @returns 加载的笔记列表
 */
export function loadNotesFromLocalStorage(): Note[] {
    try {
        const serializedNotes = localStorage.getItem('myflomo-notes');
        if (!serializedNotes) return [];

        // 解析 JSON 并将日期字符串转回日期对象
        const notes = JSON.parse(serializedNotes) as Note[];

        // 修复日期对象
        return notes.map(note => ({
            ...note,
            createdAt: new Date(note.createdAt),
            updatedAt: new Date(note.updatedAt)
        }));
    } catch (error) {
        console.error('从本地存储加载笔记失败', error);
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