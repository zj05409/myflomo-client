import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number;
}

/**
 * 发送按钮图标 - 纸飞机
 * @param size - 图标大小，默认 16
 * @param props - 其他 SVG 属性
 */
export function SendIcon({ size = 16, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: 'rotate(-30deg)' }}
            {...props}
        >
            <line x1="2" y1="2" x2="13" y2="13" />
            <polygon points="2 2 9 22 13 13 22 9 2 2" />
        </svg>
    );
}

/**
 * 编辑按钮图标 - 铅笔
 * @param size - 图标大小，默认 14
 * @param props - 其他 SVG 属性
 */
export function EditIcon({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    );
}

/**
 * 删除按钮图标 - 垃圾桶
 * @param size - 图标大小，默认 14
 * @param props - 其他 SVG 属性
 */
export function DeleteIcon({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="currentColor"
            {...props}
        >
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
    );
}

/**
 * 保存按钮图标 - 磁盘
 * @param size - 图标大小，默认 14
 * @param props - 其他 SVG 属性
 */
export function SaveIcon({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

/**
 * 取消按钮图标 - X
 * @param size - 图标大小，默认 14
 * @param props - 其他 SVG 属性
 */
export function CancelIcon({ size = 14, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}

/**
 * 时钟图标
 * @param size - 图标大小，默认 12
 * @param props - 其他 SVG 属性
 */
export function ClockIcon({ size = 12, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="currentColor"
            {...props}
        >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
    );
}

/**
 * 标签图标
 * @param size - 图标大小，默认 12
 * @param props - 其他 SVG 属性
 */
export function TagIcon({ size = 12, ...props }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="currentColor"
            {...props}
        >
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
    );
} 