import React from 'react';

interface DownloadIconProps {
    width?: number;
    height?: number;
    stroke?: string;
}

const DownloadIcon: React.FC<DownloadIconProps> = ({
    width = 16,
    height = 16,
    stroke = 'currentColor'
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
};

export default DownloadIcon; 