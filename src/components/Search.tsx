import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { fetchSearch } from '@/services/tmdb';
import { Media } from '@/types/tmdb';
import Spinner from '@/components/Spinner';

const Search = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const [searchResults, setSearchResults] = useState<Media[]>([]);
    

    const handleFocus = () => {
        setIsFocused(true);
        setIsExpanded(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!inputRef.current?.value) {
            setIsExpanded(false);
        }
    };

    const handleMouseEnter = () => {
        if (!isFocused) {
            setIsExpanded(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isFocused && !inputRef.current?.value) {
            setIsExpanded(false);
        }
    };

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);

        if (!e.target.value.trim() || e.target.value.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetchSearch(e.target.value);
                setSearchResults(response.results);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);
    };

    const SearchDropdownItem = ({ item }: { item: Media }) => {
        return (
            <div className="p-2 text-zinc-100 hover:bg-gray-800 cursor-pointer flex gap-3">
                <div className="w-16 h-16 flex-shrink-0">
                    {item.backdrop_path ? (
                        <img
                            src={`https://image.tmdb.org/t/p/w200${item.backdrop_path}`}
                            alt={item.name || item.title || item.original_name || item.original_title}
                            className="w-full h-full object-cover rounded"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-700 rounded flex items-center justify-center">
                            No image
                        </div>
                    )}
                </div>
                
                <div className="flex flex-col justify-between py-1">
                    <div className="text-sm truncate max-w-[200px]">{item.name || item.title || item.original_name || item.original_title}</div>
                    <div className="text-sm text-zinc-400">
                        {item.release_date || item.first_air_date}
                    </div>
                    <div className="text-sm text-yellow-500">
                        ★ {item.vote_average?.toFixed(1)}
                    </div>
                </div>
            </div>
        );
    };

    const SearchDropdown = () => {
        return (
            <div className="absolute left-3 right-0 top-full mt-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {isLoading ? (
                    <div className="p-4 text-zinc-100"><Spinner /></div>
                ) : searchResults.length > 0 ? (
                    searchResults.slice(0, 10).map((item) => (
                        <SearchDropdownItem key={item.id} item={item} />
                    ))
                ) : (
                    <div className="p-4 text-zinc-100">No results found</div>
                )}
            </div>
        );
    };

    useEffect(() => {
        if (isExpanded && isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded, isFocused]);

    return (
        <div className="relative">
            <div
                className={cn(
                    "relative flex items-center ml-3",
                    " rounded-full bg-gray-900/40",
                    "transition-[width] duration-200 ease-in-out",
                    "overflow-hidden",
                    isExpanded ? "w-fit md:w-80 bg-gray-950/40" : "w-8 h-8"
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex items-center w-full">
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={handleInputChange}
                        placeholder={isExpanded ? "Search..." : ""}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={cn(
                            "bg-transparent outline-none text-zinc-100 placeholder-zinc-400",
                            "transition-all duration-300 ease-out",
                            isExpanded ? "opacity-100 mr-3 w-full px-3" : "opacity-0 w-0 mr-0 p-0"
                        )}
                    />
                    <div className={cn(
                        "shrink-0 transition-[padding] ease-in-out duration-500 px-1 py-1",
                    )}>
                        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-100" />
                    </div>
                </div>
            </div>

            {/* Results dropdown */}
            {searchTerm.trim().length >= 2 && isExpanded && <SearchDropdown />}
        </div>
    );
};

export default Search;