
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

  useEffect(() => {
    const getUser = async () => {
      try {
        console.log('=== Iniciando getUser ===');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log('Nenhuma sessão encontrada');
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

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('=== Auth state change ===', event, session?.user?.email);
        
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
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso!');
      navigate('/auth');
    }
  };

  return { user, handleLogout, loading };
};
