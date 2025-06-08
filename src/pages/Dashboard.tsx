
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
  const { user, handleLogout, loading: authLoading, revalidateSession } = useAuth();
  const { userProfile, loading: profileLoading, error: profileError, refreshProfile } = useUserProfile(user);
  const { runs, stats, loading: runsLoading, refetchRuns } = useRuns(user);
  const { isExpired } = useExpirationCheck(user, userProfile);
  const [loadingTimeout, setLoadingTimeout] = React.useState(false);
  const [sessionTimeout, setSessionTimeout] = React.useState(false);

  // Timeout de 3 segundos para dados do perfil
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (profileLoading || runsLoading) {
        console.log('⏰ Timeout atingido - forçando exibição de erro');
        setLoadingTimeout(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [profileLoading, runsLoading]);

  // Timeout de 5 segundos para sessão inválida
  React.useEffect(() => {
    if (authLoading) {
      const sessionTimer = setTimeout(() => {
        console.log('⏰ Timeout de sessão atingido - verificando se precisa redirecionar');
        if (authLoading && !user) {
          console.log('❌ Sessão ainda carregando após 5s sem usuário - redirecionando');
          setSessionTimeout(true);
          toast.error('Sua sessão expirou. Faça login novamente.');
          window.location.href = '/';
        }
      }, 5000);

      return () => clearTimeout(sessionTimer);
    }
  }, [authLoading, user]);

  // Reset timeout quando dados carregam
  React.useEffect(() => {
    if (!profileLoading && !runsLoading) {
      setLoadingTimeout(false);
    }
    if (!authLoading) {
      setSessionTimeout(false);
    }
  }, [profileLoading, runsLoading, authLoading]);

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
  console.log('⏰ Loading timeout:', loadingTimeout);
  console.log('⏰ Session timeout:', sessionTimeout);

  const handleRunAdded = () => {
    refetchRuns();
    toast.success('Corrida registrada com sucesso!');
  };

  const handleStatusChange = () => {
    refreshProfile();
  };

  const handleRetry = async () => {
    console.log('🔄 Usuário solicitou retry');
    setLoadingTimeout(false);
    setSessionTimeout(false);
    
    // Tenta revalidar a sessão primeiro
    if (revalidateSession) {
      const session = await revalidateSession();
      if (!session) {
        toast.error('Sua sessão expirou. Faça login novamente.');
        window.location.href = '/';
        return;
      }
    }
    
    refreshProfile();
  };

  const isPremium = userProfile?.status === 'premium' || userProfile?.status === 'vitalicio';
  const isFree = userProfile?.status === 'free';
  
  // Simplificando a lógica do trial ativo - corrigindo o problema principal
  const isActiveTrial = userProfile?.status === 'premium' && userProfile?.plano === 'trial';

  console.log('🔍 Trial check simplificado:', {
    status: userProfile?.status,
    plano: userProfile?.plano,
    isActiveTrial,
    expira_em: userProfile?.expira_em
  });

  // Se ainda está carregando a autenticação ou houve timeout de sessão
  if (authLoading && !sessionTimeout) {
    return <LoadingSpinner />;
  }

  // Se houve timeout de sessão, redireciona
  if (sessionTimeout) {
    return null; // Vai redirecionar
  }

  // Se houve erro ao carregar o perfil OU timeout
  if ((profileError && !profileLoading) || loadingTimeout) {
    const errorMessage = loadingTimeout 
      ? "Timeout ao carregar dados - tente novamente" 
      : profileError;
    return <DashboardError onRetry={handleRetry} error={errorMessage} />;
  }

  // Se ainda está carregando o perfil ou runs (apenas na primeira carga e sem timeout)
  if ((profileLoading || runsLoading) && !loadingTimeout) {
    return <LoadingSpinner />;
  }

  // Se não há perfil de usuário após o carregamento
  if (!userProfile && !profileLoading && !loadingTimeout) {
    return <DashboardError onRetry={handleRetry} error="Perfil do usuário não encontrado" />;
  }

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

        {/* Aviso de Trial Premium Ativo - corrigindo a condição para mostrar sempre que for trial premium */}
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
