
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { fetchUserAdminStatus } from '@/services/adminService';
import { saveUserToCache } from './authCache';

interface UserWithAdmin extends User {
  isAdmin?: boolean;
}

export const initializeUserSession = async (): Promise<UserWithAdmin | null> => {
  try {
    console.log('📡 Verificando sessão no Supabase...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao obter sessão:', error);
      return null;
    }

    console.log('auth.session', session);
    console.log('user.id', session?.user?.id);

    if (!session?.user) {
      console.log('❌ Nenhuma sessão encontrada');
      return null;
    }
    
    console.log('✅ Sessão encontrada:', session.user.email);
    
    // Buscar status de admin
    const isAdmin = await fetchUserAdminStatus(session.user.id);
    
    const userWithAdmin = {
      ...session.user,
      isAdmin
    };
    
    console.log('Usuário final com admin:', userWithAdmin);
    
    // Salva no cache
    saveUserToCache(userWithAdmin);
    
    return userWithAdmin;
  } catch (error) {
    console.error('💥 Erro na inicialização da sessão:', error);
    return null;
  }
};

export const handleAuthStateChange = async (session: any): Promise<UserWithAdmin | null> => {
  if (!session?.user) return null;

  // Buscar status de admin
  const isAdmin = await fetchUserAdminStatus(session.user.id);
  
  const userWithAdmin = {
    ...session.user,
    isAdmin
  };
  
  console.log('Usuário após auth change com admin:', userWithAdmin);
  
  // Salva no cache
  saveUserToCache(userWithAdmin);
  
  return userWithAdmin;
};
