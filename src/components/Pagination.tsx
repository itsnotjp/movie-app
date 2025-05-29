"use client"

import cn from "classnames";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const maxPages = Math.min(totalPages, 500);

    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(maxPages, startPage + 4);

        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        if (startPage === 1) {
            endPage = Math.min(maxPages, 5);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const DEFAULT_CN = 'px-3 py-1.5 text-gray-500 cursor-pointer';
    const ACTIVE_CN = 'px-4 py-2 rounded text-gray-50 bg-gray-800 cursor-pointer';
    const HOVER_CN = 'hover:bg-gray-900/90 hover:text-gray-300 hover:rounded ';
    const DISABLED_CN = 'disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:opacity-20 disabled:cursor-auto';

    return (
        <div className="flex justify-center items-center mt-8 mb-8">
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage <= 1}
                className={cn(DEFAULT_CN, HOVER_CN, DISABLED_CN)}
            >
                First
            </button>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={cn(DEFAULT_CN, HOVER_CN, DISABLED_CN, `hidden md:block`)}
            >
                Prev
            </button>
            <div className={`mx-2.5`}>
                {getPageNumbers().map((pageNum) => (
                    <button
                        key={pageNum}
                        onClick={() => onPageChange(pageNum)}
                        className={
                            currentPage === pageNum
                                ? ACTIVE_CN
                                : cn(DEFAULT_CN, DISABLED_CN, HOVER_CN)
                        }
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= maxPages}
                className={cn(DEFAULT_CN, HOVER_CN, DISABLED_CN, `hidden md:block`)}
            >
                Next
            </button>
            <button
                onClick={() => onPageChange(maxPages)}
                disabled={currentPage >= maxPages}
                className={cn(DEFAULT_CN, HOVER_CN, DISABLED_CN)}
            >
                Last
            </button>
        </div>
    );
}