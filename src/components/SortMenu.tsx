import React from 'react';

export type SortOption = {
    id: string;
    label: string;
};

interface SortMenuProps {
    options: SortOption[];
    selectedOption: string;
    onSelect: (option: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

const SortMenu: React.FC<SortMenuProps> = ({
    options,
    selectedOption,
    onSelect,
    isOpen,
    onClose,
}) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] z-50">
            {options.map((option) => (
                <button
                    key={option.id}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center ${selectedOption === option.id ? 'text-[#3ab682]' : 'text-gray-700'
                        }`}
                    onClick={() => {
                        onSelect(option.id);
                        onClose();
                    }}
                >
                    {selectedOption === option.id && (
                        <svg
                            className="mr-2 shrink-0"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    )}
                    <span className={selectedOption === option.id ? 'ml-0' : 'ml-5'}>
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default SortMenu; 