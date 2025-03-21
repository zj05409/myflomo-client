import { useEffect, useState } from 'react';
import { format, startOfWeek, addDays, isSameDay, subWeeks, isToday } from 'date-fns';
import { Note } from '../types/note';

interface HeatmapProps {
    notes: Note[];
}

interface Cell {
    date: Date;
    count: number;
}

/**
 * 热力图组件，显示最近10周的笔记活动
 */
export default function Heatmap({ notes }: HeatmapProps) {
    const [cells, setCells] = useState<Cell[]>([]);

    // 生成模拟数据
    const generateMockData = (startDate: Date, endDate: Date) => {
        const mockNotes: Note[] = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            // 随机决定是否添加笔记
            const shouldAddNote = Math.random() < 0.6; // 60%的概率添加笔记
            if (shouldAddNote) {
                // 随机生成1-4条笔记
                const noteCount = Math.floor(Math.random() * 4) + 1;
                for (let i = 0; i < noteCount; i++) {
                    mockNotes.push({
                        id: `mock-${currentDate.getTime()}-${i}`,
                        content: '模拟笔记',
                        createdAt: currentDate,
                        updatedAt: currentDate,
                        tags: []
                    });
                }
            }
            currentDate = addDays(currentDate, 1);
        }
        return mockNotes;
    };

    // 当笔记变化时重新计算热图
    useEffect(() => {
        // 计算日期范围：今天到10周前
        const endDate = new Date();
        const startDate = subWeeks(endDate, 9); // 减去9周得到10周的范围

        // 获取开始日期所在周的周一
        const firstDayOfWeek = startOfWeek(startDate, { weekStartsOn: 1 });

        // 生成模拟数据
        const mockNotes = generateMockData(firstDayOfWeek, endDate);
        const allNotes = [...notes, ...mockNotes];

        // 生成70个单元格的数据（10列 × 7行）
        const _cells: Cell[] = [];

        // 遍历10列
        for (let col = 0; col < 10; col++) {
            // 遍历每列的7天
            for (let row = 0; row < 7; row++) {
                const currentDate = addDays(firstDayOfWeek, col * 7 + row);
                const count = allNotes.filter(note =>
                    isSameDay(new Date(note.createdAt), currentDate)
                ).length;

                _cells.push({
                    date: currentDate,
                    count
                });
            }
        }

        setCells(_cells);
    }, [notes]);

    // 根据笔记数量确定单元格的颜色深度
    const getCellColor = (count: number) => {
        if (count === 0) return 'cell-0';
        if (count === 1) return 'cell-1';
        if (count === 2) return 'cell-2';
        if (count <= 4) return 'cell-3';
        return 'cell-4';
    };

    // 生成周标签（周一至周日）
    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

    return (
        <div className="heatmap">
            <div className="flex items-center justify-end mb-4">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>少</span>
                    <div className="flex gap-[2px]">
                        <div className="h-2.5 w-2.5 cell-0 rounded-sm"></div>
                        <div className="h-2.5 w-2.5 cell-1 rounded-sm"></div>
                        <div className="h-2.5 w-2.5 cell-2 rounded-sm"></div>
                        <div className="h-2.5 w-2.5 cell-3 rounded-sm"></div>
                        <div className="h-2.5 w-2.5 cell-4 rounded-sm"></div>
                    </div>
                    <span>多</span>
                </div>
            </div>

            <div className="flex">
                {/* 周标签 */}
                <div className="flex flex-col text-xs text-gray-400 pr-3">
                    {weekDays.map(day => (
                        <div
                            key={day}
                            className="flex items-center"
                            style={{
                                height: '14px',
                                marginBottom: '3px',
                                paddingTop: '1px'
                            }}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 热力图网格 */}
                <div className="flex-1">
                    <div className="heatmap-grid">
                        {cells.map((cell, index) => {
                            const col = Math.floor(index / 7);
                            const row = index % 7;
                            return (
                                <div
                                    key={index}
                                    className={`heatmap-cell ${getCellColor(cell.count)} ${isToday(cell.date) ? 'today-cell' : ''}`}
                                    title={`${format(cell.date, 'yyyy-MM-dd')}: ${cell.count} 条笔记`}
                                    style={{
                                        gridColumn: col + 1,
                                        gridRow: row + 1
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
} 