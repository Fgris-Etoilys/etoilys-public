import { useEffect, useState } from 'react';

/** Section du sommaire de la Grille suivie au défilement (première section par défaut). */
export function useActiveGridSection(sectionIds: string[]) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sectionIds[0] ?? null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveSectionId(null);
      return;
    }

    const firstSectionId = sectionIds[0];
    if (!firstSectionId) {
      setActiveSectionId(null);
      return;
    }

    setActiveSectionId((currentSectionId) =>
      currentSectionId && sectionIds.includes(currentSectionId) ? currentSectionId : firstSectionId
    );
  }, [sectionIds]);

  useEffect(() => {
    if (sectionIds.length === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio - firstEntry.intersectionRatio
          )[0];

        if (activeEntry?.target.id) {
          setActiveSectionId(activeEntry.target.id);
        }
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: [0, 0.1, 0.25, 0.5] }
    );

    sectionIds.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return [activeSectionId, setActiveSectionId] as const;
}
