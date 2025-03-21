import React from 'react';

interface SendIconProps {
    className?: string;
}

export const SendIcon: React.FC<SendIconProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="2" y1="11" x2="13" y2="11"></line>
            <polygon points="2 11 22 2 15 22 13 11 2 11"></polygon>
        </svg>
    );
};

export default SendIcon; 