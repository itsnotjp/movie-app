"use client"

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image'
import cn from 'classnames';

import { Media } from '@/types/tmdb';
import { getGenreName } from '@/utils/genres';
import { getLanguageName } from '@/utils/languages';

import Modal from './Modal';

interface Card {
  media: Media;
  type?: 'default' | 'simple';
  className?: {
    cardClassName?: string;
    wrapperClassName?: string;
    imageClassName?: string;
    titleClassName?: string;
    infoClassName?: string;
  };
  onLoad?: () => void;
}

const CardModalTrigger = ({ media, openModal }: { media: Media, openModal: () => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const watchId = searchParams.get('watchId');
    if (watchId === media.id.toString()) {
      openModal();
    }
  }, [searchParams, media.id, openModal]);

  return null;
};

const Card = (
  {
    media,
    type = 'default',
    className: { cardClassName, wrapperClassName, imageClassName, titleClassName, infoClassName } = {}
  }: Card) => {

  if (!media.poster_path) return null;

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalInternal = () => {
    setIsModalOpen(true);
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
    router.push(`?watchId=${media.id}`, { scroll: false });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    router.back();
  };

  const imageUrl = media.poster_path
    ? `https://image.tmdb.org/t/p/w500/${media.poster_path}`
    : '/no-image.png';

  return (
    <>
      <Suspense fallback={null}> {/* Fallback can be null or a minimal loader */}
        <CardModalTrigger media={media} openModal={openModalInternal} />
      </Suspense>
      {type === 'simple' ? (
        <div className={cn(`w-full relative aspect-[2/3] max-h-[300px]`, cardClassName)}>
          <Image
            src={imageUrl}
            alt={media.title || media.name || media.original_title || media.original_name || ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-contain" // Change from object-cover to object-contain
          />
          {/* <Tooltip details={media} /> */}
        </div>
      ) : (
        <div onClick={handleCardClick} className={cn(cardClassName, "group relative overflow-hidden cursor-pointer")}>

          <div className='p-3 bg-gray-900/95 rounded-t-md'>
            <div className="flex justify-between items-center text-sm">
              <span>{media.release_date && new Date(media.release_date).getFullYear()}</span>
              <span className="flex items-center gap-1">
                ⭐ {media.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
          <div className={cn("group relative")}>
            <div className="relative aspect-[2/3]">
              <Image
                src={imageUrl}
                alt={media.title || media.name || media.original_title || media.original_name || ''}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className={cn("object-cover", imageClassName)}
              />
            </div>

            <div className="absolute inset-0 bg-gray-950/90 translate-y-full transition-transform duration-300 group-hover:translate-y-0 p-4 text-white overflow-y-auto no-scrollbar">
              <h3 className={cn(`font-semibold text-base mb-2.5 truncate`, titleClassName)}>
                {media.title || media.name || media.original_title || media.original_name}
              </h3>
              <div className="space-y-3">
                <div className="text-sm space-y-1">
                  {media.adult && '+18'}
                  <p>Language: {getLanguageName(media.original_language)}</p>
                  <p>Genres: {media.genre_ids?.map(id => getGenreName(id)).join(', ')}</p>
                </div>
                <p className="text-sm ">{media.overview}</p>
              </div>
            </div>
          </div>

        </div>

      )}


      <Modal
        media={media}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>

  );
}

export default Card