import { useState, useEffect, useCallback } from 'react';

export function useFavorites() {
  const [favoriteHouses, setFavoriteHouses] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteHouses(JSON.parse(localStorage.getItem('fav_houses') || '[]'));
    setFavoriteItems(JSON.parse(localStorage.getItem('fav_items') || '[]'));
  }, []);

  const toggleFavoriteHouse = useCallback((id: string) => {
    setFavoriteHouses(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('fav_houses', JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFavoriteItem = useCallback((id: string) => {
    setFavoriteItems(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('fav_items', JSON.stringify(next));
      return next;
    });
  }, []);

  return { favoriteHouses, favoriteItems, toggleFavoriteHouse, toggleFavoriteItem };
}
