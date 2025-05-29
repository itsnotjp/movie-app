import { CategoryType} from '@/types/tmdb';
import { fetchMedia } from '@/services/tmdb';
import ClientPage from './client.movies';

export default async function MoviesPage() {
    const initialData = await fetchMedia('popular' as CategoryType, 'movie', 1);
    
    return <ClientPage initialData={initialData} />;
}