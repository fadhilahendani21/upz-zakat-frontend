import { useMemo, useCallback, useRef, useEffect } from 'react';

/**
 * Hook untuk virtualize long lists
 * Hanya render items yang visible di viewport
 */
export function useVirtualScroll(items, itemHeight = 50, containerHeight = 500) {
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);
  
  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      visibleItems: items.slice(startIndex, endIndex).map((item, i) => ({
        ...item,
        index: startIndex + i,
      })),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, scrollTop, itemHeight, containerHeight]);
  
  return {
    scrollRef,
    handleScroll,
    visibleItems,
    totalHeight,
    offsetY,
  };
}

/**
 * Hook untuk lazy load images
 */
export function useLazyImage(src) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  
  return { imageSrc, isLoading };
}

/**
 * Hook untuk throttle function calls
 */
export function useThrottle(callback, delay = 100) {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
    }
  }, [callback, delay]);
}
