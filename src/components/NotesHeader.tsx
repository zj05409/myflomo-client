import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SortMenu, { SortOption } from './SortMenu';

interface NotesHeaderProps {
    onSearch: (query: string) => void;
    onSort: (option: string) => void;
    onToggleSidebar: () => void;
}

const SORT_OPTIONS: SortOption[] = [
    { id: 'create-desc', label: '创建时间，从新到旧' },
    { id: 'create-asc', label: '创建时间，从旧到新' },
    { id: 'edit-desc', label: '编辑时间，从新到旧' },
    { id: 'edit-asc', label: '编辑时间，从旧到新' },
];

const NotesHeader: React.FC<NotesHeaderProps> = ({ onSearch, onSort, onToggleSidebar }) => {
    const [searchValue, setSearchValue] = useState('');
    const [selectedSort, setSelectedSort] = useState('create-desc');
    const [showSortMenu, setShowSortMenu] = useState(false);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onSearch(value);
    };

    const handleSort = (option: string) => {
        setSelectedSort(option);
        onSort(option);
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div className="relative">
                    <button
                        className="flex items-center text-gray-700 hover:text-gray-900"
                        onClick={() => setShowSortMenu(!showSortMenu)}
                    >
                        <span className="font-medium">全部笔记</span>
                        <svg
                            className={`ml-1 transition-transform duration-200 ${showSortMenu ? 'rotate-180' : ''}`}
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    <SortMenu
                        options={SORT_OPTIONS}
                        selectedOption={selectedSort}
                        onSelect={handleSort}
                        isOpen={showSortMenu}
                        onClose={() => setShowSortMenu(false)}
                    />
                </div>
            </div>
            <div className="w-64">
                <SearchBar
                    value={searchValue}
                    onChange={handleSearch}
                    placeholder="搜索笔记..."
                />
            </div>
        </div>
    );
};

export default NotesHeader; 