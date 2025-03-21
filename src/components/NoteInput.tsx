import { useState, KeyboardEvent, useRef, useCallback } from 'react';
import { SendIcon } from './icons';

// 类型定义
interface NoteInputProps {
    onSubmit: (content: string) => void;
}

interface Position {
    left: number;
    top: number;
}

// 常量定义
const EMOJIS = ['😊', '😂', '🤔', '👍', '❤️', '🎉', '🌟', '😴', '😎', '🤗', '😅', '😍', '🤩', '😋', '😇'];
const STORAGE_KEY = {
    TAGS: 'flomo_tags',
    IMAGES: 'flomo_images'
};
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const TAG_REGEX = /#([^\s#]+)/g;

// 工具函数
const getTagsFromStorage = (): string[] => {
    try {
        const tags = localStorage.getItem(STORAGE_KEY.TAGS);
        return tags ? JSON.parse(tags) : [];
    } catch (error) {
        console.error('Error reading tags from localStorage:', error);
        return [];
    }
};

const saveTagsToStorage = (tags: string[]) => {
    try {
        localStorage.setItem(STORAGE_KEY.TAGS, JSON.stringify(Array.from(new Set(tags))));
    } catch (error) {
        console.error('Error saving tags to localStorage:', error);
    }
};

const extractTags = (content: string): string[] => {
    const matches = content.match(TAG_REGEX);
    return matches ? matches.map(tag => tag.slice(1)) : [];
};

// 图片处理函数
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 如果图片大于 1200px，按比例缩小
                const maxSize = 1200;
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);
                const quality = 0.7; // 压缩质量
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
};

const saveImageToStorage = (imageData: string) => {
    try {
        const images = JSON.parse(localStorage.getItem(STORAGE_KEY.IMAGES) || '[]');
        const imageId = Date.now().toString();
        images.push({ id: imageId, data: imageData });
        localStorage.setItem(STORAGE_KEY.IMAGES, JSON.stringify(images));
        return imageId;
    } catch (error) {
        console.error('Error saving image to localStorage:', error);
        return null;
    }
};

export default function NoteInput({ onSubmit }: NoteInputProps) {
    // 状态管理
    const [content, setContent] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const [showEmojis, setShowEmojis] = useState(false);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 拖拽状态
    const [isDragging, setIsDragging] = useState(false);

    // 标签建议处理
    const updateTagSuggestions = useCallback((searchText: string) => {
        const storedTags = getTagsFromStorage();
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
    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);

        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = newContent.substring(0, cursorPos);
        const hashIndex = textBeforeCursor.lastIndexOf('#');

        if (hashIndex !== -1) {
            const tagText = textBeforeCursor.substring(hashIndex + 1);
            updateTagSuggestions(tagText);
            return;
        }

        setShowTagSuggestions(false);
    }, [updateTagSuggestions]);

    // 标签操作
    const insertTag = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + '#' + content.substring(start);
        setContent(newContent);

        const storedTags = getTagsFromStorage();
        setTagSuggestions(storedTags);

        setTimeout(() => {
            setShowTagSuggestions(storedTags.length > 0);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
            textarea.focus();
        }, 0);
    }, [content]);

    const selectTag = useCallback((tag: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const currentPos = textarea.selectionStart;
        const textBeforeCursor = content.substring(0, currentPos);
        const hashIndex = textBeforeCursor.lastIndexOf('#');

        if (hashIndex !== -1) {
            const newContent = content.substring(0, hashIndex + 1) + tag + ' ' + content.substring(currentPos);
            setContent(newContent);
            setShowTagSuggestions(false);

            const newPosition = hashIndex + tag.length + 2;
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = newPosition;
                textarea.focus();
            }, 0);
        }
    }, [content]);

    // 位置计算
    const getSuggestionPosition = useCallback((): Position => {
        const textarea = textareaRef.current;
        if (!textarea) return { left: 0, top: 0 };

        const computedStyle = window.getComputedStyle(textarea);
        const container = textarea.closest('.relative');
        if (!container) return { left: 0, top: 0 };

        const textBeforeCursor = content.substring(0, textarea.selectionStart);
        const hashIndex = textBeforeCursor.lastIndexOf('#');
        if (hashIndex === -1) return { left: 0, top: 0 };

        const span = document.createElement('span');
        Object.assign(span.style, {
            font: computedStyle.font,
            fontSize: computedStyle.fontSize,
            letterSpacing: computedStyle.letterSpacing,
            whiteSpace: 'pre-wrap',
            position: 'absolute',
            visibility: 'hidden',
            top: '0',
            left: '0'
        });

        const textContent = textBeforeCursor.substring(0, hashIndex).replace(/\n/g, '<br>');
        span.innerHTML = textContent;
        document.body.appendChild(span);

        const left = span.offsetWidth;
        const lines = textContent.split('\n');
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const top = lines.length * lineHeight;

        document.body.removeChild(span);
        return { left, top };
    }, [content]);

    // 提交处理
    const handleSubmit = useCallback(() => {
        if (!content.trim()) return;

        const newTags = extractTags(content);
        if (newTags.length > 0) {
            const existingTags = getTagsFromStorage();
            saveTagsToStorage([...existingTags, ...newTags]);
        }

        onSubmit(content);
        setContent('');
        setShowEmojis(false);
        setShowTagSuggestions(false);
    }, [content, onSubmit]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit, isComposing]);

    // 处理拖拽事件
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        for (const file of imageFiles) {
            await handleImageFile(file);
        }
    }, [content]);

    // 处理图片文件
    const handleImageFile = async (file: File) => {
        if (file.size > MAX_IMAGE_SIZE) {
            alert('图片大小不能超过 5MB');
            return;
        }

        try {
            const compressedImage = await compressImage(file);
            const imageId = saveImageToStorage(compressedImage);

            if (!imageId) {
                throw new Error('Failed to save image');
            }

            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const imageMarkdown = `![图片](local-image://${imageId})`;
                const newContent = content.substring(0, start) + imageMarkdown + content.substring(start);
                setContent(newContent);

                // 更新光标位置
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
                    textarea.focus();
                }, 0);
            }
        } catch (error) {
            console.error('图片处理失败:', error);
            alert('图片处理失败，请重试');
        }
    };

    // 处理图片上传
    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleImageFile(file);
        }
    }, [content]);

    // 表情处理
    const insertEmoji = useCallback((emoji: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newContent = content.substring(0, start) + emoji + content.substring(start);
        setContent(newContent);
        setShowEmojis(false);

        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
            textarea.focus();
        }, 0);
    }, [content]);

    return (
        <div className="card p-4 transition-all duration-200 rounded-xl border border-[#e5e7eb] focus-within:border-[#3ab682] focus-within:shadow-[0_0_0_1px_#3ab682]">
            <div
                className={`relative ${isDragging ? 'bg-gray-50' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {isDragging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded-lg border-2 border-dashed border-gray-300 z-50">
                        <p className="text-gray-500">拖放图片到这里</p>
                    </div>
                )}
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                    placeholder="现在的想法是..."
                    className="w-full min-h-[80px] resize-none text-gray-700 placeholder-gray-400 bg-white border-0 focus:ring-0 outline-none p-0"
                    rows={3}
                />

                {showTagSuggestions && (
                    <div
                        className="absolute bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                        style={{
                            left: `${getSuggestionPosition().left}px`,
                            top: `${getSuggestionPosition().top + 6}px`,
                            minWidth: '120px'
                        }}
                    >
                        {tagSuggestions.map((tag, index) => (
                            <button
                                key={index}
                                className="w-full text-left px-4 py-1.5 hover:bg-gray-50 text-sm text-gray-700"
                                onClick={() => selectTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 mt-2 text-gray-400">
                <button
                    className="p-1.5 hover:text-gray-600 transition-colors"
                    title="添加标签"
                    onClick={insertTag}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                        <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                <button
                    className="p-1.5 hover:text-gray-600 transition-colors"
                    title="插入图片"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                    </svg>
                </button>

                <div className="relative">
                    <button
                        className="p-1.5 hover:text-gray-600 transition-colors"
                        title="添加表情"
                        onClick={() => setShowEmojis(!showEmojis)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                            <line x1="9" y1="9" x2="9.01" y2="9" />
                            <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg>
                    </button>

                    {showEmojis && (
                        <div className="absolute bottom-full right-0 mb-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="grid grid-cols-5 gap-2 w-[220px]">
                                {EMOJIS.map((emoji, index) => (
                                    <button
                                        key={index}
                                        className="w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-100 rounded transition-colors"
                                        onClick={() => insertEmoji(emoji)}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="ml-auto btn-primary p-1.5 rounded-full flex items-center justify-center w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="发送"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
} 