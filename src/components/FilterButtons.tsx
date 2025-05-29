import { MediaFilter } from '@/types/tmdb';
import { Dispatch, SetStateAction } from 'react';

interface FilterButtonsProps {
    filters: MediaFilter[];
    selectedFilter: string;
    onFilterSelect: Dispatch<SetStateAction<string>>;
}

export default function FilterButtons({ filters, selectedFilter, onFilterSelect }: FilterButtonsProps) {
    return (
        <div className="flex my-10 overflow-x-auto pb-2 no-scrollbar">
            {filters.map((filter, index) => (
                <button
                    key={filter.value}
                    onClick={() => onFilterSelect(filter.value)}
                    className={`px-5 py-2 whitespace-nowrap cursor-pointer ${
                        selectedFilter === filter.value
                            ? 'bg-gray-700/20 backdrop-blur-sm text-white'
                            : 'bg-gray-950/20 backdrop-blur-sm text-gray-500 hover:text-gray-300'
                    } ${index !== 0 ? 'border-l border-gray-600' : ''}`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}