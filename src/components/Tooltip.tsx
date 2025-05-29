import React, { useState, useEffect, useRef } from 'react';
import { Media } from '@/types/tmdb';

interface TooltipProps {
    details: Media;
    className?: string;
}

const Tooltip = ({ details, className = '' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="absolute inset-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className={`absolute inset-x-0 bottom-0 bg-gray-900/95 p-4 transform transition-all duration-300 ease-in-out
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            >
                <h3 className="text-lg font-bold mb-2">{details.title || details.name}</h3>
                <p className="text-sm text-gray-300 mb-3 line-clamp-4">{details.overview}</p>
                <div className="flex flex-col gap-1 text-sm">
                    {details.media_type === 'tv' && (
                        <>
                            <p>Episodes: {details.number_of_episodes}</p>
                            <p>Seasons: {details.number_of_seasons}</p>
                        </>
                    )}
                    <p>Status: {details.status}</p>
                    <div className="flex justify-between items-center mt-2">
                        <span>{details.release_date || details.first_air_date}</span>
                        <span>⭐ {details.vote_average.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip;