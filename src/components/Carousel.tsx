"use client";

import { useState, useEffect, useRef, MouseEvent, TouchEvent } from 'react';
import cn from 'classnames';
import Card from '@/components/Card';
import { Media } from '@/types/tmdb';

interface CarouselProps {
  items: Media[];
  title: string;
  visibleItems?: number;
  hideButtons?: boolean;
  onItemChange?: (item: Media) => void; 
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  title,
  visibleItems = 6,
  hideButtons = false,
  onItemChange
}) => {
  const safeItems = items.length < visibleItems ? [...items, ...items] : items;
  const carouselItems = [
    ...safeItems.slice(-visibleItems),
    ...safeItems,
    ...safeItems.slice(0, visibleItems)
  ];
  const [currentIndex, setCurrentIndex] = useState(visibleItems + 1);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<number>(0);
  const lastDragX = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);


  const handleDragStart = (e: MouseEvent | TouchEvent) => {
    setIsDragging(true);
    setIsTransitioning(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartRef.current = clientX;
    lastDragX.current = clientX;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - lastDragX.current;
    lastDragX.current = clientX;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setDragOffset(prev => prev + delta);
    });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsDragging(false);
    setIsTransitioning(true);

    const threshold = window.innerWidth / visibleItems / 3;
    const velocity = lastDragX.current - dragStartRef.current;
    
    if (Math.abs(dragOffset) > threshold || Math.abs(velocity) > 50) {
      if (dragOffset > 0 || velocity > 50) {
        prevSlide();
      } else {
        nextSlide();
      }
    }
    setDragOffset(0);
  };

  const handleItemClick = (index: number) => {
    const actualIndex = index - visibleItems;
    const diff = actualIndex - (currentIndex - (visibleItems + 1));
    if (diff !== 0) {
      setCurrentIndex(prev => prev + diff);
      setIsTransitioning(true);
    }
  };

  const nextSlide = () => {
    setCurrentIndex(prev => prev + 1);
    setIsTransitioning(true);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev - 1);
    setIsTransitioning(true);
  };

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused]);

  useEffect(() => {
    if (!isTransitioning) return;

    if (currentIndex >= carouselItems.length - visibleItems) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(visibleItems + 1); // Changed from visibleItems to visibleItems + 1
      }, 500);
    } else if (currentIndex < visibleItems) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(carouselItems.length - visibleItems - 1);
      }, 500);
    }
  }, [currentIndex, isTransitioning, carouselItems.length]);

  useEffect(() => {
    if (onItemChange) {
      const activeItemIndex = currentIndex - (visibleItems + 1); // Changed from visibleItems to visibleItems + 1
      const activeItem = safeItems[activeItemIndex % safeItems.length];
      onItemChange(activeItem);
    }
  }, [currentIndex, onItemChange, safeItems, visibleItems]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (!items.length) {
    return null;
  }

  return (
    <section className="relative w-full pb-5">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div
        className="group relative overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        <button
          onClick={prevSlide}
          className={cn(
            { 'hidden': hideButtons },
            `absolute left-0 top-1/2 -translate-y-1/2 z-10`,
            `bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`,
          )}
          aria-label="Previous"
        >
          ←
        </button>
        <div
          className={cn(
            "flex select-none",
            { "cursor-grab": !isDragging, "cursor-grabbing": isDragging },
            { "transition-transform duration-500 ease-out": isTransitioning }
          )}
          style={{
            transform: `translateX(calc(-${(currentIndex * (100 / visibleItems))}% + ${dragOffset}px))`,
            transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {carouselItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              style={{ width: `calc(${(100 / visibleItems)}% - 1rem)` }}
              className="flex-none mx-2 cursor-pointer"
              onClick={() => handleItemClick(index)}
            >
              <Card media={item} type="simple" />
            </div>
          ))}
        </div>
        <button
          onClick={nextSlide}
          className={cn(
            { 'hidden': hideButtons },
            `absolute right-0 top-1/2 -translate-y-1/2 z-10`,
            `bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`,
          )}
          aria-label="Next"
        >
          →
        </button>
      </div>
    </section>
  );
}

export default Carousel;