"use client";

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import Spinner from '@/components/Spinner';
import { CategoryType, MediaFilter, MOVIE_CATEGORIES, MediaResponse } from '@/types/tmdb';
import { fetchMedia } from '@/services/tmdb';
import FilterButtons from '@/components/FilterButtons';
import Pagination from '@/components/Pagination';
import Card from '@/components/Card';

interface MoviesClientProps {
    initialData: MediaResponse;
}

export default function MoviesClient({ initialData }: MoviesClientProps) {
    const [movies, setMovies] = useState<MediaResponse>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string>('popular');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filters: MediaFilter[] = Object.entries(MOVIE_CATEGORIES).map(([value, label]) => ({
        label,
        value: value as CategoryType,
    }));

    useEffect(() => {
        const loadMovies = async () => {
            setIsLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const data = await fetchMedia(selectedFilter as CategoryType, 'movie', currentPage);
                setMovies(data);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            }
            setIsLoading(false);
        };

        loadMovies();

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
                ) : movies?.results ? (
                    <>
                        <div className="grid grid-cols-2 2xl:grid-cols-5 md:grid-cols-3 gap-4">
                            {movies.results.map((movie) => (
                                <Card key={movie.id} media={movie} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={movies.total_pages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
                        No movies found
                    </div>
                )}
            </div>
        </main>
    );
}