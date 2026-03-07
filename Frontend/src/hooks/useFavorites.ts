import { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';

export function useFavorites() {
  const [favoriteHouses, setFavoriteHouses] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    setFavoriteHouses(JSON.parse(localStorage.getItem('fav_houses') || '[]'));
    setFavoriteItems(JSON.parse(localStorage.getItem('fav_items') || '[]'));
  }, []);

  const toggleFavoriteHouse = useCallback((id: string) => {
    setFavoriteHouses(prev => {
      const isNew = !prev.includes(id);
      const next = isNew ? [...prev, id] : prev.filter(x => x !== id);

      if (isNew && prev.length === 0 && user) {
        addNotification({
          userId: user.id,
          title: "First House Saved! 🏠",
          description: "You've started building your wishlist. We'll notify you if price drops!",
          type: 'favorite_added'
        });
      }

      localStorage.setItem('fav_houses', JSON.stringify(next));
      return next;
    });
  }, [user, addNotification]);

  const toggleFavoriteItem = useCallback((id: string) => {
    setFavoriteItems(prev => {
      const isNew = !prev.includes(id);
      const next = isNew ? [...prev, id] : prev.filter(x => x !== id);

      if (isNew && prev.length === 0 && user) {
        addNotification({
          userId: user.id,
          title: "First Item Saved! 🛍️",
          description: "Smart move! Keeping track of interesting items helps you find the best deals.",
          type: 'favorite_added'
        });
      }

      localStorage.setItem('fav_items', JSON.stringify(next));
      return next;
    });
  }, [user, addNotification]);

  return { favoriteHouses, favoriteItems, toggleFavoriteHouse, toggleFavoriteItem };
}
