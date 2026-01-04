import { useEffect, useRef, RefObject } from 'react';

export function useCloseOnClickOutside<T extends HTMLElement>(
    handler: () => void // MouseEventHandler?? 
): RefObject<T | null> { // MouseEventHandler ?? 
  const domNodeRef = useRef<T>(null);

  useEffect(() => {
    const maybeHandler = (event: MouseEvent | TouchEvent): void => {
      // If the clicked element is NOT inside the domNodeRef, trigger handler
      if (domNodeRef.current && !domNodeRef.current.contains(event.target as Node)) {
        handler();
      }
    };

    // Listen for both mouse and touch events for 2026 mobile compatibility
    document.addEventListener("mousedown", maybeHandler);
    document.addEventListener("touchstart", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
      document.removeEventListener("touchstart", maybeHandler);
    };
  }, [handler]);

  return domNodeRef;
}