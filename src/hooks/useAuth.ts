
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
  const [retryCount, setRetryCount] = useState(0);

  const retrySession = async () => {
    console.log('🔄 Retentando carregar sessão...');
    try {
      const sessionUser = await initializeUserSession();
      setUser(sessionUser);
      setRetryCount(0);
    } catch (error) {
      console.error('💥 Erro na retentativa:', error);
      setUser(null);
    } finally {
      setLoading(false);
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

    // Timeout de fallback de 3 segundos
    const timeoutId = setTimeout(() => {
      if (loading && retryCount < 2) {
        console.log('⏰ Timeout de 3s atingido - retentando...');
        setRetryCount(prev => prev + 1);
        retrySession();
      } else if (loading) {
        console.log('⏰ Timeout final - forçando fim do loading');
        setLoading(false);
      }
    }, 3000);

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth state change ===', event, session?.user?.email);
        
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

    // Listener para detectar quando a aba volta ao foco
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('👀 Aba voltou ao foco - verificando sessão...');
        // Pequeno delay para evitar execução excessiva
        setTimeout(async () => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user) {
              console.log('✅ Sessão válida confirmada');
              // Atualiza o cache se necessário
              const userWithAdmin = await handleAuthStateChange(session);
              setUser(userWithAdmin);
            } else if (user) {
              console.log('❌ Sessão perdida - fazendo logout');
              clearUserCache();
              setUser(null);
              navigate('/');
            }
          } catch (error) {
            console.error('💥 Erro ao verificar sessão:', error);
          }
        }, 500);
      }
    };

    // Listener para detectar foco na janela
    const handleWindowFocus = () => {
      if (user) {
        console.log('🪟 Janela voltou ao foco - verificando sessão...');
        handleVisibilityChange();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [user, loading, retryCount, navigate]);

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
