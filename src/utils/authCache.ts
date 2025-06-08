
import { User } from '@supabase/supabase-js';

interface UserWithAdmin extends User {
  isAdmin?: boolean;
}

interface CachedProfile {
  user: UserWithAdmin;
  timestamp: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos (aumentado para maior persistência)
const CACHE_KEY = 'auth_user_cache';

export const saveUserToCache = (userData: UserWithAdmin) => {
  try {
    const cached: CachedProfile = {
      user: userData,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    console.log('💾 Usuário salvo no cache:', userData.email);
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
};

export const getUserFromCache = (): UserWithAdmin | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsedCache: CachedProfile = JSON.parse(cached);
    const isExpired = Date.now() - parsedCache.timestamp > CACHE_DURATION;
    
    if (isExpired) {
      console.log('⏰ Cache expirado - removendo');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log('💾 Usuário recuperado do cache:', parsedCache.user.email);
    return parsedCache.user;
  } catch (error) {
    console.error('Erro ao ler cache:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

export const clearUserCache = () => {
  localStorage.removeItem(CACHE_KEY);
  console.log('🗑️ Cache do usuário limpo');
};

// Função para verificar se o cache está válido sem removê-lo
export const isCacheValid = (): boolean => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const parsedCache: CachedProfile = JSON.parse(cached);
    const isValid = Date.now() - parsedCache.timestamp <= CACHE_DURATION;
    
    return isValid;
  } catch (error) {
    return false;
  }
};
