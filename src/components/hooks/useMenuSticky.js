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
    const sections = menuItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let mostVisible = null;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisible = entry.target;
          }
        });
        if (mostVisible && maxRatio >= 1) {
          setActiveSection(mostVisible.id);
        }
      },
      { threshold: [0.5, 0.6, 0.8, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return { isMenuSticky, activeSection };
};

export default useMenu;