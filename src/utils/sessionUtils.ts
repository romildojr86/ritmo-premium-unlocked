import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { fetchUserAdminStatus } from '@/services/adminService';
import { saveUserToCache, isCacheValid, getUserFromCache } from './authCache';

interface UserWithAdmin extends User {
  isAdmin?: boolean;
}

export const initializeUserSession = async (): Promise<UserWithAdmin | null> => {
  try {
    console.log('📡 Verificando sessão no Supabase...');
    
    // Primeiro, tenta carregar do cache
    const cachedUser = getUserFromCache();
    if (cachedUser && isCacheValid()) {
      console.log('💾 Cache válido encontrado - usando cache');
      return cachedUser; // Retorna o usuário do cache
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Erro ao obter sessão:', error);
      throw error;
    }

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
    
    console.log('Usuário final com admin:', userWithAdmin.email, 'isAdmin:', isAdmin);
    
    // Salva no cache
    saveUserToCache(userWithAdmin);
    
    return userWithAdmin;
  } catch (error) {
    console.error('💥 Erro na inicialização da sessão:', error);
    throw error;
  }
};

export const handleAuthStateChange = async (session: any): Promise<UserWithAdmin | null> => {
  if (!session?.user) return null;

  try {
    // Buscar status de admin
    const isAdmin = await fetchUserAdminStatus(session.user.id);
    
    const userWithAdmin = {
      ...session.user,
      isAdmin
    };
    
    console.log('Usuário após auth change:', userWithAdmin.email, 'isAdmin:', isAdmin);
    
    // Salva no cache
    saveUserToCache(userWithAdmin);
    
    return userWithAdmin;
  } catch (error) {
    console.error('💥 Erro ao processar mudança de auth:', error);
    return {
      ...session.user,
      isAdmin: false
    };
  }
};

// Função para forçar atualização da sessão
export const refreshUserSession = async (): Promise<UserWithAdmin | null> => {
  try {
    console.log('🔄 Forçando atualização da sessão...');
    
    const { data: { session }, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('❌ Erro ao atualizar sessão:', error);
      return null;
    }

    if (session?.user) {
      return await handleAuthStateChange(session);
    }
    
    return null;
  } catch (error) {
    console.error('💥 Erro ao atualizar sessão:', error);
    return null;
  }
};
