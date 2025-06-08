
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UserWithAdmin extends User {
  isAdmin?: boolean;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserWithAdmin | null>(null);
  const [loading, setLoading] = useState(true);

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

  const revalidateSession = async () => {
    try {
      console.log('🔄 Revalidando sessão...');
      
      // Primeiro tenta pegar a sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Erro ao obter sessão:', sessionError);
        throw sessionError;
      }

      console.log('📋 Sessão atual:', session?.user?.email || 'nenhuma');

      // Se não há sessão, tenta refrescar
      if (!session) {
        console.log('🔄 Tentando refresh da sessão...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('❌ Erro no refresh da sessão:', refreshError);
          throw refreshError;
        }

        if (refreshData.session) {
          console.log('✅ Sessão refreshada com sucesso');
          return refreshData.session;
        }
      }

      return session;
    } catch (error) {
      console.error('💥 Erro fatal na revalidação da sessão:', error);
      return null;
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log('=== Iniciando getUser ===');
        
        // Revalida a sessão primeiro
        const session = await revalidateSession();
        console.log('auth.session', session);
        
        if (!session?.user) {
          console.log('Nenhuma sessão encontrada após revalidação');
          setUser(null);
          setLoading(false);
          return;
        }
        
        console.log('Usuário logado:', session.user.email);
        console.log('ID do usuário:', session.user.id);
        
        // Buscar status de admin
        const isAdmin = await fetchUserAdminStatus(session.user.id);
        
        const userWithAdmin = {
          ...session.user,
          isAdmin
        };
        
        console.log('Usuário final com admin:', userWithAdmin);
        setUser(userWithAdmin);
      } catch (error) {
        console.error('Erro na autenticação:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Fallback timeout de 5 segundos
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ Timeout de 5s atingido - forçando revalidação');
        revalidateSession().then((session) => {
          if (!session) {
            console.log('❌ Sessão inválida após timeout - redirecionando para login');
            toast.error('Sua sessão expirou. Faça login novamente.');
            navigate('/');
          }
          setLoading(false);
        });
      }
    }, 5000);

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth state change ===', event, session?.user?.email);
        console.log('auth.session', session);
        
        if (event === 'SIGNED_IN' && session) {
          setLoading(true);
          
          // Buscar status de admin
          const isAdmin = await fetchUserAdminStatus(session.user.id);
          
          const userWithAdmin = {
            ...session.user,
            isAdmin
          };
          
          console.log('Usuário após login com admin:', userWithAdmin);
          setUser(userWithAdmin);
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
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
  }, [navigate]);

  // Função para detectar visibilidade da página e revalidar quando necessário
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user) {
        console.log('👁️ Página ficou visível - revalidando sessão');
        revalidateSession().then((session) => {
          if (!session) {
            console.log('❌ Sessão perdida após voltar à página - fazendo logout');
            handleLogout();
          }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    }
  };

  return { user, handleLogout, loading, revalidateSession };
};
