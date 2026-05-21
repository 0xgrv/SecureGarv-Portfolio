import { useState, useEffect, useCallback } from 'react';

/**
 * Tracks which section is currently in the viewport and returns its id.
 * Uses IntersectionObserver for performance — no scroll event listeners.
 *
 * @param sectionIds - Array of section element ids to observe
 * @param rootMargin - IntersectionObserver rootMargin (default centres the trigger)
 */
export function useScrollSpy(
  sectionIds: string[],
  rootMargin = '-40% 0px -55% 0px',
): string {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '');

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    },
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, { rootMargin });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, rootMargin, handleIntersect]);

  return activeId;
}
