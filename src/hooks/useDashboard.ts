
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

  // Timeout de 2 segundos para dados do perfil
  React.useEffect(() => {
    if (user && (profileLoading || runsLoading)) {
      const timer = setTimeout(() => {
        console.log('⏰ Timeout de 2s atingido para dados do perfil');
        setDataTimeout(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, profileLoading, runsLoading]);

  // Reset timeout quando dados carregam
  React.useEffect(() => {
    if (!profileLoading && !runsLoading) {
      setDataTimeout(false);
    }
  }, [profileLoading, runsLoading]);

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
  console.log('user.status', userProfile?.status);
  console.log('user.plano', userProfile?.plano);
  console.log('user.expira_em', userProfile?.expira_em);
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
  const isFree = userProfile?.status === 'free';
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
