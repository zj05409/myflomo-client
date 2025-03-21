import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageData } from '../types/image';

interface ImageStore {
    images: ImageData[];
    addImage: (image: Omit<ImageData, 'id' | 'createdAt'>) => Promise<void>;
    loadImages: () => Promise<void>;
}

export const useImageStore = create<ImageStore>((set) => ({
    images: [],
    addImage: async (image) => {
        const newImage: ImageData = {
            ...image,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        set((state) => ({ images: [...state.images, newImage] }));
        await AsyncStorage.setItem('images', JSON.stringify([...useImageStore.getState().images, newImage]));
    },
    loadImages: async () => {
        const imagesJson = await AsyncStorage.getItem('images');
        if (imagesJson) {
            set({ images: JSON.parse(imagesJson) });
        }
    },
})); 