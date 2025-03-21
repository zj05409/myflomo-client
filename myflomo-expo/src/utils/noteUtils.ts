import { Note } from '../types/note';

// 生成 UUID 的兼容函数
function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const createNote = (content: string): Note => {
    return {
        id: crypto.randomUUID(),
        content,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
};

export const updateNote = (note: Note, content: string): Note => {
    return {
        ...note,
        content,
        updatedAt: new Date().toISOString(),
    };
};

export const deleteNote = (notes: Note[], id: string): Note[] => {
    return notes.filter(note => note.id !== id);
}; 