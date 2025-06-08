
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        // Buscar informações do usuário incluindo o campo admin
        const { data: userData, error } = await supabase
          .from('users')
          .select('admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUser(session.user);
        } else {
          const userWithAdmin = {
            ...session.user,
            isAdmin: userData?.admin || false
          };
          setUser(userWithAdmin);
        }
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
        if (event === 'SIGNED_IN' && session) {
          // Buscar dados do admin quando o usuário fizer login
          const { data: userData, error } = await supabase
            .from('users')
            .select('admin')
            .eq('id', session.user.id)
            .single();

          const userWithAdmin = {
            ...session.user,
            isAdmin: userData?.admin || false
          };
          setUser(userWithAdmin);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
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
