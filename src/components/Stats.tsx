import { format } from 'date-fns';
import { Note } from '../types/note';
import React from 'react';

interface StatsProps {
    notes: Note[];
}

interface StatIcon extends React.SVGProps<SVGSVGElement> {
    width?: string | number;
    height?: string | number;
}

export default function Stats({ notes }: StatsProps) {
    // 计算笔记总数
    const totalNotes = notes.length;

    // 计算所有标签并统计次数
    const tags = notes.reduce((acc, note) => {
        note.tags.forEach(tag => {
            if (!acc[tag]) {
                acc[tag] = 0;
            }
            acc[tag] += 1;
        });
        return acc;
    }, {} as Record<string, number>);

    // 统计标签总数
    const totalTags = Object.keys(tags).length;

    // 计算有记录的天数（去重）
    const activeDays = notes.reduce((days, note) => {
        const dateStr = format(new Date(note.createdAt), 'yyyy-MM-dd');
        days.add(dateStr);
        return days;
    }, new Set<string>()).size;

    // 统计项
    const statsItems = [
        {
            title: '总笔记',
            value: totalNotes,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
            )
        },
        {
            title: '总标签',
            value: totalTags,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            title: '记录天数',
            value: activeDays,
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    return (
        <div className="stats-block w-full">
            <div className="grid grid-cols-3 gap-4">
                {statsItems.map((item, index) => (
                    <div key={index} className="stat-item flex flex-col items-center justify-center p-3">
                        <div className="stat-icon mb-2 p-3 bg-[#3ab682] bg-opacity-10 rounded-lg">
                            {React.cloneElement(item.icon as React.ReactElement<StatIcon>, {
                                width: 24,
                                height: 24,
                                className: 'text-[#3ab682]'
                            })}
                        </div>
                        <div className="text-lg font-medium mb-0.5">{item.value}</div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
} 