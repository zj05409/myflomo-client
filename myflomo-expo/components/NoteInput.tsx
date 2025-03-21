import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Text,
    Alert,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// 常量定义
const EMOJIS = ['😊', '😂', '🤔', '👍', '❤️', '🎉', '🌟', '😴', '😎', '🤗', '😅', '😍', '🤩', '😋', '😇'];
const STORAGE_KEYS = {
    TAGS: 'myflomo-tags',
    IMAGES: 'myflomo-images',
};
const TAG_REGEX = /#([^\s#]+)/g;

// 类型定义
interface NoteInputProps {
    onSubmit?: (content: string) => void;
}

// 工具函数
const getTagsFromStorage = async (): Promise<string[]> => {
    try {
        const tags = await AsyncStorage.getItem(STORAGE_KEYS.TAGS);
        return tags ? JSON.parse(tags) : [];
    } catch (error) {
        console.error('Error loading tags from storage:', error);
        return [];
    }
};

const saveTagsToStorage = async (tags: string[]) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(Array.from(new Set(tags))));
    } catch (error) {
        console.error('Error saving tags to storage:', error);
    }
};

const extractTags = (content: string): string[] => {
    const matches = content.match(TAG_REGEX);
    return matches ? matches.map(tag => tag.slice(1)) : [];
};

export default function NoteInput({ onSubmit }: NoteInputProps) {
    const [content, setContent] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
    const textInputRef = useRef<TextInput>(null);

    // 标签建议处理
    const updateTagSuggestions = useCallback(async (searchText: string) => {
        const storedTags = await getTagsFromStorage();
        const suggestions = searchText === '' ? storedTags :
            storedTags.filter(tag =>
                tag.toLowerCase().includes(searchText.toLowerCase())
            ).sort((a, b) => {
                const aStartsWith = a.toLowerCase().startsWith(searchText.toLowerCase());
                const bStartsWith = b.toLowerCase().startsWith(searchText.toLowerCase());
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;
                return a.localeCompare(b);
            });
        setTagSuggestions(suggestions);
        setShowTagSuggestions(suggestions.length > 0);
    }, []);

    // 内容变化处理
    const handleContentChange = useCallback((text: string) => {
        setContent(text);
        const hashIndex = text.lastIndexOf('#');
        if (hashIndex !== -1) {
            const tagText = text.substring(hashIndex + 1);
            updateTagSuggestions(tagText);
        } else {
            setShowTagSuggestions(false);
        }
    }, [updateTagSuggestions]);

    // 标签操作
    const insertTag = useCallback(() => {
        const newContent = content + '#';
        setContent(newContent);
        textInputRef.current?.focus();
    }, [content]);

    const selectTag = useCallback((tag: string) => {
        const newContent = content.replace(/#[^#\s]*$/, `#${tag} `);
        setContent(newContent);
        setShowTagSuggestions(false);
        textInputRef.current?.focus();
    }, [content]);

    // 提交处理
    const handleSubmit = useCallback(async () => {
        if (!content.trim()) return;

        const newTags = extractTags(content);
        if (newTags.length > 0) {
            const existingTags = await getTagsFromStorage();
            await saveTagsToStorage([...existingTags, ...newTags]);
        }

        // 保存笔记
        try {
            const storedNotes = await AsyncStorage.getItem('notes');
            const notes = storedNotes ? JSON.parse(storedNotes) : [];
            const newNote = {
                id: Date.now().toString(),
                content: content.trim(),
                createdAt: new Date().toISOString(),
            };
            notes.unshift(newNote);
            await AsyncStorage.setItem('notes', JSON.stringify(notes));
        } catch (error) {
            console.error('Error saving note:', error);
            Alert.alert('错误', '保存笔记失败，请重试');
            return;
        }

        if (onSubmit) {
            onSubmit(content);
        }
        setContent('');
        setShowEmojis(false);
        setShowTagSuggestions(false);
    }, [content, onSubmit]);

    // 表情处理
    const insertEmoji = useCallback((emoji: string) => {
        setContent(prev => prev + emoji);
        setShowEmojis(false);
        textInputRef.current?.focus();
    }, []);

    // 图片处理
    const handleImagePick = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const imageId = Date.now().toString();

                // 保存图片到 AsyncStorage
                const images = JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.IMAGES) || '{}');
                images[imageId] = imageUri;
                await AsyncStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));

                // 插入图片标记
                const imageMarkdown = `![图片](${imageId})`;
                setContent(prev => prev + imageMarkdown);
                textInputRef.current?.focus();
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('错误', '图片处理失败，请重试');
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={textInputRef}
                    value={content}
                    onChangeText={handleContentChange}
                    placeholder="现在的想法是..."
                    multiline
                    style={styles.input}
                    onSubmitEditing={handleSubmit}
                />

                {showTagSuggestions && (
                    <View style={styles.tagSuggestions}>
                        {tagSuggestions.map((tag, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.tagSuggestion}
                                onPress={() => selectTag(tag)}
                            >
                                <Text style={styles.tagText}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.toolbar}>
                <TouchableOpacity
                    style={styles.toolbarButton}
                    onPress={insertTag}
                >
                    <Text style={styles.toolbarIcon}>#</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.toolbarButton}
                    onPress={handleImagePick}
                >
                    <Text style={styles.toolbarIcon}>📷</Text>
                </TouchableOpacity>

                <View style={styles.emojiContainer}>
                    <TouchableOpacity
                        style={styles.toolbarButton}
                        onPress={() => setShowEmojis(!showEmojis)}
                    >
                        <Text style={styles.toolbarIcon}>😊</Text>
                    </TouchableOpacity>

                    {showEmojis && (
                        <ScrollView style={styles.emojiPicker}>
                            <View style={styles.emojiGrid}>
                                {EMOJIS.map((emoji, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.emojiButton}
                                        onPress={() => insertEmoji(emoji)}
                                    >
                                        <Text style={styles.emojiText}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, !content.trim() && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!content.trim()}
                >
                    <Text style={styles.submitButtonText}>发送</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inputContainer: {
        flex: 1,
        padding: 16,
    },
    input: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        textAlignVertical: 'top',
        padding: 0,
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    toolbarButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    toolbarIcon: {
        fontSize: 20,
    },
    emojiContainer: {
        position: 'relative',
    },
    emojiPicker: {
        position: 'absolute',
        bottom: '100%',
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        maxHeight: 200,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    emojiGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    emojiButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emojiText: {
        fontSize: 24,
    },
    submitButton: {
        marginLeft: 'auto',
        backgroundColor: '#3ab682',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    tagSuggestions: {
        position: 'absolute',
        top: 0,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    tagSuggestion: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    tagText: {
        fontSize: 16,
        color: '#374151',
    },
}); 