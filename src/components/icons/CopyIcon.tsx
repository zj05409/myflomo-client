import React from 'react';

interface CopyIconProps {
    width?: number;
    height?: number;
    stroke?: string;
}

const CopyIcon: React.FC<CopyIconProps> = ({
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
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
};

export default CopyIcon; 