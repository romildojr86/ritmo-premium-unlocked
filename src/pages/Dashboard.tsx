
import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRuns } from '@/hooks/useRuns';
import { useExpirationCheck } from '@/hooks/useExpirationCheck';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FreeUserDashboard from '@/components/dashboard/FreeUserDashboard';
import PremiumUserDashboard from '@/components/dashboard/PremiumUserDashboard';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import DashboardError from '@/components/dashboard/DashboardError';
import TrialWarning from '@/components/dashboard/TrialWarning';
import ExpiredTrialWarning from '@/components/dashboard/ExpiredTrialWarning';

const Dashboard = () => {
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

  // Se ainda está carregando a autenticação
  if (authLoading) {
    return <LoadingSpinner />;
  }

  // Se não há usuário logado, redirecionar
  if (!user) {
    window.location.href = '/';
    return null;
  }

  // Se houve erro ao carregar o perfil OU timeout nos dados
  if ((profileError && !profileLoading) || dataTimeout) {
    const errorMessage = dataTimeout 
      ? "Não foi possível carregar seus dados. Tente novamente." 
      : profileError;
    return <DashboardError onRetry={handleRetry} error={errorMessage} />;
  }

  // Se ainda está carregando o perfil ou runs (apenas na primeira carga e sem timeout)
  if ((profileLoading || runsLoading) && !dataTimeout) {
    return <LoadingSpinner />;
  }

  // Se não há perfil de usuário após o carregamento
  if (!userProfile && !profileLoading && !dataTimeout) {
    return <DashboardError onRetry={handleRetry} error="Perfil do usuário não encontrado" />;
  }

  const isPremium = userProfile?.status === 'premium' || userProfile?.status === 'vitalicio';
  const isFree = userProfile?.status === 'free';
  const isActiveTrial = userProfile?.status === 'premium' && userProfile?.plano === 'trial';

  console.log('🔍 Trial check:', {
    status: userProfile?.status,
    plano: userProfile?.plano,
    isActiveTrial,
    expira_em: userProfile?.expira_em
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader 
          userName={userProfile?.nome || 'Usuário'} 
          onLogout={handleLogout}
        />

        {/* Aviso de Trial Expirado */}
        {isExpired && user && (
          <ExpiredTrialWarning 
            userId={user.id} 
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Aviso de Trial Premium Ativo */}
        {!isExpired && isActiveTrial && userProfile?.expira_em && (
          <TrialWarning expiresAt={userProfile.expira_em} />
        )}

        {/* Conteúdo baseado no status */}
        {isFree && (
          <FreeUserDashboard 
            stats={stats}
            onRunAdded={handleRunAdded}
          />
        )}

        {isPremium && !isExpired && (
          <PremiumUserDashboard 
            stats={stats}
            runs={runs}
            onRunAdded={handleRunAdded}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
