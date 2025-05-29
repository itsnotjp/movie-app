import { useState, useEffect } from 'react';

export const useWindowSize = () => {
  const [visibleItems, setVisibleItems] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) { // sm
        setVisibleItems(2);
      } else if (width < 768) { // md
        setVisibleItems(3);
      } else if (width < 1024) { // lg
        setVisibleItems(4);
      } else if (width < 1280) { // xl
        setVisibleItems(5);
      } else { // 2xl
        setVisibleItems(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return visibleItems;
};