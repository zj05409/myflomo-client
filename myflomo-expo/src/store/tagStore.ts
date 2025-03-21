import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tag } from '../types/tag';

interface TagStore {
    tags: Tag[];
    addTag: (tag: Omit<Tag, 'id'>) => Promise<void>;
    loadTags: () => Promise<void>;
}

export const useTagStore = create<TagStore>((set) => ({
    tags: [],
    addTag: async (tag) => {
        const newTag: Tag = {
            ...tag,
            id: Date.now().toString(),
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
        await AsyncStorage.setItem('tags', JSON.stringify([...useTagStore.getState().tags, newTag]));
    },
    loadTags: async () => {
        const tagsJson = await AsyncStorage.getItem('tags');
        if (tagsJson) {
            set({ tags: JSON.parse(tagsJson) });
        }
    },
})); 