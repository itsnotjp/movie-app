import Hero from '@/components/Hero';
import { fetchMedia, fetchTrending } from '@/services/tmdb';

export default async function Home() {
  const allTrending = await fetchTrending('all', 'day');
  return (
    <main className="min-h-screen">
      <Hero movie={allTrending} />
    </main>
  );
}