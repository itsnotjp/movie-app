"use client";

import { useState, useEffect } from 'react';
import { CategoryType, MediaFilter, TV_CATEGORIES, MediaResponse } from '@/types/tmdb';
import { fetchMedia } from '@/services/tmdb';

import Spinner from '@/components/Spinner';
import FilterButtons from '@/components/FilterButtons';
import Pagination from '@/components/Pagination';
import Card from '@/components/Card';

interface TVClientProps {
    initialData: MediaResponse;
}

export default function TVClient({ initialData }: TVClientProps) {
    const [tv, setTV] = useState<MediaResponse>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('popular');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filters: MediaFilter[] = Object.entries(TV_CATEGORIES).map(([value, label]) => ({
        label,
        value: value as CategoryType,
    }));

    useEffect(() => {
        const loadTV = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const data = await fetchMedia(selectedFilter as CategoryType, 'tv', currentPage);
                setTV(data);
            } catch (error) {
                console.error("Failed to fetch tv shows:", error);
            }
            setIsLoading(false);
        };
        loadTV();
    }, [selectedFilter, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo(0, 0);
    };

    return (
        <main className="pt-20 px-4 min-h-screen">
            <div className=" mx-auto">

                <FilterButtons
                    filters={filters}
                    selectedFilter={selectedFilter}
                    onFilterSelect={setSelectedFilter}
                />

                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <Spinner />
                    </div>
                ) : tv?.results ? (
                    <>
                        <div className="grid grid-cols-2 2xl:grid-cols-5 md:grid-cols-3 gap-4">
                            {tv.results.map((tv) => (
                                <Card key={tv.id} media={tv} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={tv.total_pages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
                        No tv shows found
                    </div>
                )}
            </div>
        </main>
    );
}