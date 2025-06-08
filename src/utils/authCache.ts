
import { User } from '@supabase/supabase-js';

interface UserWithAdmin extends User {
  isAdmin?: boolean;
}

interface CachedProfile {
  user: UserWithAdmin;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const CACHE_KEY = 'auth_user_cache';

export const saveUserToCache = (userData: UserWithAdmin) => {
  const cached: CachedProfile = {
    user: userData,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
};

export const getUserFromCache = (): UserWithAdmin | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsedCache: CachedProfile = JSON.parse(cached);
    const isExpired = Date.now() - parsedCache.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return parsedCache.user;
  } catch (error) {
    console.error('Erro ao ler cache:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

export const clearUserCache = () => {
  localStorage.removeItem(CACHE_KEY);
};
