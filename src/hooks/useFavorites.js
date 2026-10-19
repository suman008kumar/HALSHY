import { useCallback, useState } from 'react';
import { storage } from '../utils/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => storage.getFavorites());
  const toggle = useCallback(id => setFavorites(prev => { const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]; storage.setFavorites(next); return next; }), []);
  const has = useCallback(id => favorites.includes(id), [favorites]);
  return { favorites, toggle, has };
}
