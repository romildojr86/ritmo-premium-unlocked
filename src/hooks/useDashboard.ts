
import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRuns } from '@/hooks/useRuns';
import { useExpirationCheck } from '@/hooks/useExpirationCheck';

export const useDashboard = () => {
  const { user, handleLogout, loading: authLoading } = useAuth();
  const { userProfile, loading: profileLoading, error: profileError, refreshProfile } = useUserProfile(user);
  const { runs, stats, loading: runsLoading, refetchRuns } = useRuns(user);
  const { isExpired } = useExpirationCheck(user, userProfile);
  const [dataTimeout, setDataTimeout] = React.useState(false);

  // Timeout de 10 segundos para dados do perfil (mais tolerante)
  React.useEffect(() => {
    if (user && profileLoading) {
      const timer = setTimeout(() => {
        console.log('⏰ Timeout de 10s atingido para dados do perfil');
        setDataTimeout(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [user, profileLoading]);

  // Reset timeout quando dados carregam
  React.useEffect(() => {
    if (!profileLoading) {
      setDataTimeout(false);
    }
  }, [profileLoading]);

  // Listener para detectar volta do foco e recarregar dados se necessário
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user && dataTimeout) {
        console.log('👀 Aba voltou ao foco com timeout ativo - recarregando dados...');
        setDataTimeout(false);
        refreshProfile();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, dataTimeout, refreshProfile]);

  // Logs de debug
  console.log('=== Dashboard render ===');
  console.log('user.id', user?.id);
  console.log('🔐 Auth loading:', authLoading);
  console.log('👤 User:', user?.email);
  console.log('📊 Profile loading:', profileLoading);
  console.log('📊 Profile error:', profileError);
  console.log('📊 User profile:', {
    status: userProfile?.status,
    plano: userProfile?.plano,
    expira_em: userProfile?.expira_em
  });
  console.log('🏃 Runs loading:', runsLoading);
  console.log('⏰ Is expired:', isExpired);
  console.log('⏰ Data timeout:', dataTimeout);

  const handleRunAdded = () => {
    refetchRuns();
    toast.success('Corrida registrada com sucesso!');
  };

  const handleStatusChange = () => {
    refreshProfile();
  };

  const handleRetry = () => {
    console.log('🔄 Usuário solicitou retry');
    setDataTimeout(false);
    refreshProfile();
  };

  const isPremium = userProfile?.status === 'premium' || userProfile?.status === 'vitalicio';
  const isFree = userProfile?.status === 'free' || !userProfile; // Fallback para free se não há perfil
  const isActiveTrial = userProfile?.status === 'premium' && userProfile?.plano === 'trial';

  console.log('🔍 Trial check:', {
    status: userProfile?.status,
    plano: userProfile?.plano,
    isActiveTrial,
    expira_em: userProfile?.expira_em
  });

  return {
    user,
    userProfile,
    runs,
    stats,
    authLoading,
    profileLoading,
    runsLoading,
    profileError,
    dataTimeout,
    isExpired,
    isPremium,
    isFree,
    isActiveTrial,
    handleLogout,
    handleRunAdded,
    handleStatusChange,
    handleRetry
  };
};
