import { useState, KeyboardEvent, useRef, useCallback, DragEvent } from 'react';
import { SendIcon } from './icons';
import { countCharacters } from '../utils/text';

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
const STORAGE_KEYS = {
    TAGS: 'myflomo-tags',
    IMAGES: 'myflomo-images'
};
const TAG_REGEX = /#([^\s#]+)/g;

// 工具函数
const getTagsFromStorage = (): string[] => {
    try {
        const tags = localStorage.getItem(STORAGE_KEYS.TAGS);
        return tags ? JSON.parse(tags) : [];
    } catch (error) {
        console.error('Error loading tags from localStorage:', error);
        return [];
    }
};

const saveTagsToStorage = (tags: string[]) => {
    try {
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(Array.from(new Set(tags))));
    } catch (error) {
        console.error('Error saving tags to localStorage:', error);
    }
};

const extractTags = (content: string): string[] => {
    const matches = content.match(TAG_REGEX);
    return matches ? matches.map(tag => tag.slice(1)) : [];
};

// 压缩图片
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 如果图片尺寸超过 1200px，按比例缩小
                if (width > 1200 || height > 1200) {
                    if (width > height) {
                        height = Math.round((height * 1200) / width);
                        width = 1200;
                    } else {
                        width = Math.round((width * 1200) / height);
                        height = 1200;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('无法创建 canvas 上下文'));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = reject;
            img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
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

    // 添加自动调整高度的函数
    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // 重置高度
        textarea.style.height = 'auto';
        // 设置新高度
        textarea.style.height = `${Math.max(80, textarea.scrollHeight)}px`;
    }, []);

    // 修改内容变化处理函数
    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        adjustTextareaHeight();

        const cursorPos = e.target.selectionStart;
        const textBeforeCursor = newContent.substring(0, cursorPos);
        const hashIndex = textBeforeCursor.lastIndexOf('#');

        if (hashIndex !== -1) {
            const tagText = textBeforeCursor.substring(hashIndex + 1);
            updateTagSuggestions(tagText);
            return;
        }

        setShowTagSuggestions(false);
    }, [updateTagSuggestions, adjustTextareaHeight]);

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

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit();
        }
    }, [isComposing, handleSubmit]);

    // 处理拖拽事件
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
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
        if (!file.type.startsWith('image/')) {
            alert('请选择图片文件');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过 5MB');
            return;
        }

        try {
            const compressedData = await compressImage(file);
            const imageId = Date.now().toString();

            // 保存图片到 LocalStorage
            const images = JSON.parse(localStorage.getItem(STORAGE_KEYS.IMAGES) || '{}');
            images[imageId] = compressedData;
            localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));

            // 插入图片标记
            const imageMarkdown = `![图片](${imageId})`;
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newContent = content.slice(0, start) + imageMarkdown + content.slice(end);
                setContent(newContent);
                // 将光标移动到图片标记后
                const newPosition = start + imageMarkdown.length;
                setTimeout(() => {
                    textarea.focus();
                    textarea.setSelectionRange(newPosition, newPosition);
                }, 0);
            }
        } catch (error) {
            console.error('Error handling image:', error);
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
                    className="w-full min-h-[80px] resize-none text-gray-700 placeholder-gray-400 bg-white border-0 focus:ring-0 outline-none p-0 overflow-hidden"
                    rows={1}
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

                <span className="ml-auto text-xs text-gray-400">
                    {countCharacters(content)} 字
                </span>

                <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="btn-primary p-1.5 rounded-full flex items-center justify-center w-8 h-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="发送"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
    );
} 