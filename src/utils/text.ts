/**
 * 计算文本的字数（包括中文字符）
 * @param text 要计算的文本
 * @returns 字数
 */
export const countCharacters = (text: string): number => {
    // 直接返回文本长度，因为中文字符在 JavaScript 中也是按1个字符计算的
    return text.length;
}; 