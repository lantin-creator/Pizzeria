import { useEffect, useState } from 'react';

const useFloatingBtn = (elementId = 'main') => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.intersectionRatio < 0.1);
      },
      { threshold: [0, 0.1, 1] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [elementId]);

  return isVisible;
};

export default useFloatingBtn;