
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

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
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
      }

      const userWithAdmin = {
        ...session.user,
        isAdmin: userData?.admin || false
      };

      setUser(userWithAdmin);
    };

    getUser();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      toast.success('Logout realizado com sucesso!');
      navigate('/auth');
    }
  };

  return { user, handleLogout };
};
