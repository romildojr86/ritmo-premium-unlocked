
import { supabase } from "@/integrations/supabase/client";

export const fetchUserAdminStatus = async (userId: string): Promise<boolean> => {
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
