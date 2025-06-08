
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { getUserFromCache, clearUserCache } from '@/utils/authCache';
import { initializeUserSession, handleAuthStateChange } from '@/utils/sessionUtils';

interface UserWithAdmin extends User {
  isAdmin?: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithAdmin | null>(null);
  const [loading, setLoading] = useState(true);

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

        // Se não há cache, inicializa sessão do Supabase
        const sessionUser = await initializeUserSession();
        setUser(sessionUser);
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
          const userWithAdmin = await handleAuthStateChange(session);
          setUser(userWithAdmin);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          console.log('🚪 Usuário deslogado');
          clearUserCache();
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
      clearUserCache();
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    }
  };

  return { user, handleLogout, loading };
};
