
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
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

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para salvar usuário no cache
  const saveUserToCache = (userData: UserWithAdmin) => {
    const cached: CachedProfile = {
      user: userData,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
  };

  // Função para buscar usuário do cache
  const getUserFromCache = (): UserWithAdmin | null => {
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

  const fetchUserAdminStatus = async (userId: string) => {
    try {
      console.log('Buscando status admin para usuário ID:', userId);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('admin')
        .eq('id', userId)
        .single();

      console.log('Resultado da busca admin:', { userData, error });
      
      if (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return false;
      }
      
      const isAdmin = userData?.admin === true;
      console.log('Status admin final:', isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('Erro na busca do status admin:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('=== Inicializando autenticação ===');
        
        // Primeiro, tenta carregar do cache
        const cachedUser = getUserFromCache();
        if (cachedUser) {
          console.log('✅ Usuário carregado do cache:', cachedUser.email);
          setUser(cachedUser);
          setLoading(false);
          return;
        }

        console.log('📡 Verificando sessão no Supabase...');
        
        // Verifica sessão atual no Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          setUser(null);
          setLoading(false);
          return;
        }

        console.log('auth.session', session);
        console.log('user.id', session?.user?.id);

        if (!session?.user) {
          console.log('❌ Nenhuma sessão encontrada');
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('✅ Sessão encontrada:', session.user.email);
        
        // Buscar status de admin
        const isAdmin = await fetchUserAdminStatus(session.user.id);
        
        const userWithAdmin = {
          ...session.user,
          isAdmin
        };
        
        console.log('Usuário final com admin:', userWithAdmin);
        
        // Salva no cache e no state
        saveUserToCache(userWithAdmin);
        setUser(userWithAdmin);
      } catch (error) {
        console.error('💥 Erro na inicialização:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Timeout de fallback de 2 segundos
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout de 2s atingido - forçando fim do loading');
        setLoading(false);
      }
    }, 2000);

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth state change ===', event, session?.user?.email);
        console.log('auth.session', session);
        console.log('user.id', session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          setLoading(true);
          
          // Buscar status de admin
          const isAdmin = await fetchUserAdminStatus(session.user.id);
          
          const userWithAdmin = {
            ...session.user,
            isAdmin
          };
          
          console.log('Usuário após login com admin:', userWithAdmin);
          
          // Salva no cache e no state
          saveUserToCache(userWithAdmin);
          setUser(userWithAdmin);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 Usuário deslogado');
          localStorage.removeItem(CACHE_KEY);
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed automaticamente');
        }
      }
    );

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      localStorage.removeItem(CACHE_KEY);
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    }
  };

  return { user, handleLogout, loading };
};
