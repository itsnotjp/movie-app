"use client"

import { FastAverageColor } from 'fast-average-color';

import Image from 'next/image';
import cn from 'classnames';
import Carousel from '@/components/Carousel';
import { useEffect, useState } from 'react';
import { Media } from '@/types/tmdb';

interface HeroProps {
    movie: {
        results: Media[];
    };
}

export default function Hero({ movie }: HeroProps) {
    const [activeItem, setActiveItem] = useState<Media>(movie.results[0]);
    const [dominantColor, setDominantColor] = useState<string | null>(null);

    useEffect(() => {
        const extractColor = async () => {
            const fac = new FastAverageColor();
            const imageUrl = `https://image.tmdb.org/t/p/w500${activeItem.backdrop_path}`;
            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;

            img.onload = async () => {
                const color = await fac.getColorAsync(img);
                setDominantColor(color.hex);
            };
        };
        extractColor();
    }, [activeItem]);


    return (
        <div className="relative h-dvh w-dvw">
            <div
                className="hidden 2xl:block absolute via-gray-950 inset-0 2xl:bg-gradient-to-r bg-gradient-to-t 2xl:via-30% 2xl:w-7/12 to-transparent z-1"
                style={{
                    backgroundImage: dominantColor
                        ? `linear-gradient(to right, ${dominantColor} 30%, ${dominantColor}30, transparent 100%)`
                        : `linear-gradient(to right, #030712 30%, #030712 30%, transparent 100%)`
                }}
            />
            <div className={cn(
                'absolute right-0 h-full',
                '2xl:w-10/12 w-full'
            )}>
                <Image
                    src={`https://image.tmdb.org/t/p/original/${activeItem.backdrop_path}`}
                    alt={activeItem.title || activeItem.name || activeItem.original_title || activeItem.original_name || ''}
                    fill
                    className="object-cover object-center brightness-[0.4] sm:brightness-50 sm:w-dvw"
                    sizes="100vw"
                    priority
                />
            </div>
            <div className={cn(
                '2xl:hidden absolute inset-0 bottom-0 h-full w-full ',
                'bg-gradient-to-t from-gray-950 to-transparent to-60%',
            )} />


            <div className='absolute bottom-0 w-full z-2'>
                <div className={cn(
                    'text-white mx-auto max-w-400 2xl:max-w-500',
                    'mb-10 landscape:mb-5 md:mb-15 md:landscape:mb-5 lg:landscape:mb-15 lg:mb-25 xl:mb-30 xl:landscape:mb-15 2xl:px-32',
                )}>
                    <div className='px-4 md:px-8'>
                        <h1 className={cn(
                            'font-bold',
                            'text-3xl md:text-5xl',
                            'mb-4 md:mb-6 lg:mb-8',
                        )}>{activeItem.title || activeItem.name || activeItem.original_title || activeItem.original_name || ''}</h1>
                        <p className={cn(
                            'text-base max-w-2xl',
                            'text-sm md:text-base lg:text-lg',
                            'sm:landscape:line-clamp-2 md:landscape:line-clamp-3 line-clamp-6',
                        )}>{activeItem.overview}</p>
                    </div>
                </div>
                <section className="w-full">
                    <Carousel
                        title=""
                        items={movie.results}
                        visibleItems={10}
                        onItemChange={(item) => setActiveItem(item)}
                        hideButtons
                    />
                </section>
            </div>
        </div>
    );
}