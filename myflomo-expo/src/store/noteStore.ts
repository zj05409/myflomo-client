import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

interface NoteStore {
    notes: Note[];
    addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    loadNotes: () => Promise<void>;
}

export const useNoteStore = create<NoteStore>((set) => ({
    notes: [],
    addNote: async (note) => {
        const newNote: Note = {
            ...note,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
        await AsyncStorage.setItem('notes', JSON.stringify([...useNoteStore.getState().notes, newNote]));
    },
    loadNotes: async () => {
        const notesJson = await AsyncStorage.getItem('notes');
        if (notesJson) {
            set({ notes: JSON.parse(notesJson) });
        }
    },
})); 