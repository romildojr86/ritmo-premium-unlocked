
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
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

export const useExpirationCheck = (user: User | null, userProfile: UserProfile | null) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!userProfile || !user) return;

    const checkExpiration = async () => {
      // Verifica se é um usuário premium com trial
      if (userProfile.status === 'premium' && userProfile.plano === 'trial' && userProfile.assinou_em) {
        const signupDate = new Date(userProfile.assinou_em);
        const expirationDate = new Date(signupDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 dias
        const now = new Date();

        if (now > expirationDate) {
          setIsExpired(true);
          
          // Atualiza automaticamente o status para expirado se ainda não foi atualizado
          if (userProfile.status === 'premium') {
            try {
              await supabase
                .from('users')
                .update({
                  status: 'expired_trial'
                })
                .eq('id', user.id);
            } catch (error) {
              console.error('Erro ao atualizar status de expiração:', error);
            }
          }
        } else {
          setIsExpired(false);
        }
      } else {
        setIsExpired(false);
      }
    };

    checkExpiration();
  }, [user, userProfile]);

  return { isExpired };
};
