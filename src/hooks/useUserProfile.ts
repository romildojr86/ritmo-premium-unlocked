
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  status: string;
  plano?: string;
  assinou_em?: string;
  expira_em?: string;
}

export const useUserProfile = (user: User | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log('=== useUserProfile: Buscando perfil para usuário ===', user.email);
      fetchUserProfile(user.id);
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Buscando dados do usuário no Supabase:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        console.error('❌ Detalhes do erro:', error.message, error.details, error.code);
        throw error;
      }

      console.log('✅ Dados do usuário encontrados:', {
        nome: data?.nome,
        status: data?.status,
        plano: data?.plano,
        expira_em: data?.expira_em,
        admin: data?.admin
      });

      setUserProfile(data);
    } catch (error: any) {
      console.error('💥 Erro fatal ao carregar perfil:', error);
      const errorMessage = error.message || 'Erro desconhecido ao carregar dados do usuário';
      setError(errorMessage);
      toast.error('Erro ao carregar perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    if (user) {
      console.log('🔄 Recarregando perfil do usuário');
      fetchUserProfile(user.id);
    }
  };

  return { userProfile, loading, error, refreshProfile };
};
