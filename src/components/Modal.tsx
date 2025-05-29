"use client"

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

import { Media } from '@/types/tmdb';
import { fetchDetails } from '@/services/tmdb';

import { getGenreName } from '@/utils/genres';
import { getLanguageName } from '@/utils/languages';

import Spinner from './Spinner';

interface ModalProps {
  media: Media;
  isOpen: boolean;
  onClose: () => void;
}



const Modal = ({ media, isOpen, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mediaDetails, setMediaDetails] = useState<Media | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      if (isOpen && !mediaDetails) {
        setIsLoading(true);
        try {
          const mediaType = media.first_air_date ? 'tv' : 'movie';
          const details = await fetchDetails(media.id, mediaType);
          setMediaDetails(details);
          console.log('modal',details);
        } catch (error) {
          console.error('Error fetching media details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDetails();
  }, [isOpen, media.id, media.media_type, mediaDetails]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayMedia = mediaDetails || media;
  const nameTitle = media.first_air_date ? 'name' : 'title';

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 bg-opacity-75 p-4">
      <div
        ref={modalRef}
        className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-1 z-10 text-white text-2xl [text-shadow:_0_1px_2px_rgba(0,0,0,0.8)] hover:text-gray-700 cursor-pointer"
        >
          ×
        </button>
        <div className="relative aspect-video">
          <Image
            src={`https://image.tmdb.org/t/p/original${media.backdrop_path || media.poster_path}`}
            alt={media.title || media.original_title || media.original_name || ''}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 70vw"
            className="object-cover rounded-t-lg"
          />
        </div>
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <Spinner />
            </div>
          ) : (
            <>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <span>{displayMedia.release_date && new Date(displayMedia.release_date).getFullYear()}</span>
                  <span className="flex items-center gap-1">
                    ⭐ {displayMedia.vote_average.toFixed(1)}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {displayMedia.title || displayMedia.name}
                </h2>

                {((displayMedia.name !== displayMedia.original_name) || (displayMedia.title !== displayMedia.original_title)) &&
                  <p className="text-sm mb-5">
                    <span className='font-bold'>Original:</span> {nameTitle === 'name' ? displayMedia.original_name : displayMedia.original_title}
                  </p>
                }



                <p className="text-gray-400 mb-4">{displayMedia.overview}</p>

                <div className="space-y-3">
                  <div className="text-sm space-y-1">
                  {displayMedia.adult && '+18'}
                    
                    <p><span className='font-bold'>Language:</span> {getLanguageName(displayMedia.original_language)}</p>
                    <p><span className='font-bold'>Genres:</span> {media.genre_ids?.map(id => getGenreName(id)).join(', ')}</p>
                    {displayMedia.first_air_date ? (
                      <>
                        <p><span className='font-bold'>First Air Date:</span> {displayMedia.first_air_date}</p>
                        <p><span className='font-bold'>Episodes:</span> {displayMedia.number_of_episodes}</p>
                        <p><span className='font-bold'>Seasons:</span> {displayMedia.number_of_seasons}</p>
                      </>
                    ) : (
                      <p><span className='font-bold'>Release Date:</span> {displayMedia.release_date}</p>
                    )}
                  </div>

                  {mediaDetails?.credits && (
                    <div>
                      <h3 className="font-bold mt-4 mb-2">Cast</h3>
                      <p>{mediaDetails.credits.cast?.slice(0, 5).map(actor => actor.name).join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;