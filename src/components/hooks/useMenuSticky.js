import { useEffect, useState } from 'react';

export const menuItems = [
  { id: 'popular-catalog', className: 'popular', label: 'Популярное' },
  { id: 'pizza-catalog', className: 'pizza', label: 'Пицца' },
  { id: 'snacks-catalog', className: 'snacks', label: 'Закуски' },
  { id: 'Drinks-catalog', className: 'drinks', label: 'Напитки' },
  { id: 'Desserts-catalog', className: 'Desserts', label: 'Десерты' },
  { id: 'sauces-catalog', className: 'Sauces', label: 'Соусы' },
  { id: 'Combo-catalog', className: 'Combo', label: 'Комбо' },
  { id: 'Reviews-about-us', className: 'Reviews', label: 'Отзывы' },
  { id: 'callback', className: 'Callback', label: 'Связаться', isButton: true },
];

const useMenu = () => {
  const [isMenuSticky, setIsMenuSticky] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsMenuSticky(window.scrollY >= window.innerHeight - 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
  const visibleSections = new Map();
  const observedSections = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(
            entry.target.id,
            entry.intersectionRatio
          );
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      const mostVisible = [...visibleSections.entries()]
        .sort((a, b) => b[1] - a[1])[0];

      setActiveSection(mostVisible ? mostVisible[0] : "");
    },
    {
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
    }
  );

  const observeSections = () => {
    menuItems
      .filter((item) => !item.isButton)
      .forEach((item) => {
        const section = document.getElementById(item.id);

        if (section && !observedSections.has(section)) {
          observedSections.add(section);
          observer.observe(section);
        }
      });
  };
  observeSections();

  const mutationObserver = new MutationObserver(() => {
    observeSections();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
    mutationObserver.disconnect();
  };
}, []);

  return { isMenuSticky, activeSection };
};

export default useMenu;