import type { CategoryType, Media, MovieCategory, MediaType, TrendingType, TimeWindow, TVCategory,MediaResponse } from '@/types/tmdb';

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`
    }
};
const fetchMedia = async (
    category: CategoryType = 'popular',
    mediaType: MediaType = 'movie',
    page: number = 1,
    language: string = 'en-US'
): Promise<MediaResponse> => {
    try {
        const endpoint = `${BASE_URL}/${mediaType}/${category}?language=${language}&page=${page}`;
        // console.log('endpoint',endpoint);
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${mediaType} data: ${response.status}`);
        }

        const data = await response.json();
        
        return {
            ...data,
            results: data.results.filter((item: Media) => !!item.poster_path)
        };
    } catch (error) {
        throw error;
    }
}
const fetchTrending = async (
    mediaType: TrendingType = 'all',
    timeWindow: TimeWindow = 'day',
    language: string = 'en-US'
): Promise<MediaResponse> => {
    try {
        const endpoint = `${BASE_URL}/trending/${mediaType}/${timeWindow}?language=${language}`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
            throw new Error(`Failed to fetch trending ${mediaType} data: ${response.status}`);
        }

        const data = await response.json();

        return {
            ...data,
            results: data.results.filter((item: Media) => !!item.poster_path)
        };
    } catch (error) {
        throw error;
    }
}

const fetchSearch = async (
    query: string,
    page: number = 1,
    language: string = 'en-US'
): Promise<MediaResponse> => {
    try {
        // Check if query is searching by ID
        if (query.startsWith('id::')) {
            const id = query.replace('id::', '').trim();
            const movieResult = await fetchById(id, 'movie', language)
                .catch(() => null);
            const tvResult = await fetchById(id, 'tv', language)
                .catch(() => null);
            
            const results = [movieResult, tvResult]
                .filter(result => result !== null);

            return {
                page: 1,
                results,
                total_pages: 1,
                total_results: results.length
            };
        }

        // Regular search query
        const endpoint = `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&language=${language}&page=${page}`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
            throw new Error(`Failed to fetch search results: ${response.status}`);
        }

        const data = await response.json();

        return {
            ...data,
            results: data.results.filter((item: Media) => !!item.poster_path)
        };
    } catch (error) {
        throw error;
    }
}

const fetchById = async (
    id: string | number,
    mediaType: MediaType = 'movie',
    language: string = 'en-US'
): Promise<Media> => {
    try {
        const endpoint = `${BASE_URL}/${mediaType}/${id}?language=${language}`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${mediaType} by ID: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

const fetchDetails = async (
    id: string | number,
    mediaType: MediaType = 'movie',
    language: string = 'en-US'
): Promise<Media & { credits?: any, videos?: any, similar?: any }> => {
    try {
        const appendedQuery = 'append_to_response=credits,videos,similar';
        const endpoint = `${BASE_URL}/${mediaType}/${id}?language=${language}&${appendedQuery}`;
        const response = await fetch(endpoint, API_OPTIONS);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${mediaType} details: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

export { fetchMedia, fetchTrending, fetchSearch, fetchById, fetchDetails };