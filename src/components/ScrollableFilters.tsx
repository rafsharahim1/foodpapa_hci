import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Filter {
  id: string;
  label: string;
  active?: boolean;
}

interface ScrollableFiltersProps {
  filters: Filter[];
  onFilterClick?: (filterId: string) => void;
  onFilterChange?: (filterId: string) => void;
}

export function ScrollableFilters({ filters, onFilterClick, onFilterChange }: ScrollableFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filters]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };
  
  const handleFilterClick = (filterId: string) => {
    onFilterClick?.(filterId);
    onFilterChange?.(filterId);
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="flex-shrink-0 min-w-[56px] min-h-[56px] bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-2xl flex items-center justify-center shadow-lg z-10 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {/* Scrollable Filter Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-2 flex-1 scroll-smooth"
        onScroll={checkScroll}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => handleFilterClick(filter.id)}
            className={`px-6 py-3 rounded-full whitespace-nowrap min-h-[56px] text-lg transition-colors flex-shrink-0 ${
              filter.active
                ? 'bg-purple-700 text-white shadow-md'
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="flex-shrink-0 min-w-[56px] min-h-[56px] bg-purple-700 hover:bg-purple-800 active:bg-purple-900 text-white rounded-2xl flex items-center justify-center shadow-lg z-10 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}