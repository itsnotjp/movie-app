import { CategoryType} from '@/types/tmdb';
import { fetchMedia } from '@/services/tmdb';
import ClientPage from './client.tv';

export default async function TVPage() {
    const initialData = await fetchMedia('popular' as CategoryType, 'tv', 1);
    
    return <ClientPage initialData={initialData} />;
}