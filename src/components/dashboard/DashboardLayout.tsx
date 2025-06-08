
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import DashboardError from '@/components/dashboard/DashboardError';
import DashboardContent from '@/components/dashboard/DashboardContent';

interface DashboardLayoutProps {
  user: any;
  userProfile: any;
  runs: any[];
  stats: any;
  authLoading: boolean;
  profileLoading: boolean;
  runsLoading: boolean;
  profileError: string | null;
  dataTimeout: boolean;
  isExpired: boolean;
  isPremium: boolean;
  isFree: boolean;
  isActiveTrial: boolean;
  onLogout: () => void;
  onRunAdded: () => void;
  onStatusChange: () => void;
  onRetry: () => void;
}

const DashboardLayout = ({
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
  onLogout,
  onRunAdded,
  onStatusChange,
  onRetry
}: DashboardLayoutProps) => {
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
    return <DashboardError onRetry={onRetry} error={errorMessage} />;
  }

  // Se ainda está carregando o perfil ou runs (apenas na primeira carga e sem timeout)
  if ((profileLoading || runsLoading) && !dataTimeout) {
    return <LoadingSpinner />;
  }

  // Se não há perfil de usuário após o carregamento
  if (!userProfile && !profileLoading && !dataTimeout) {
    return <DashboardError onRetry={onRetry} error="Perfil do usuário não encontrado" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader 
          userName={userProfile?.nome || 'Usuário'} 
          onLogout={onLogout}
        />

        {/* Content */}
        <DashboardContent
          user={user}
          userProfile={userProfile}
          runs={runs}
          stats={stats}
          isExpired={isExpired}
          isPremium={isPremium}
          isFree={isFree}
          isActiveTrial={isActiveTrial}
          onRunAdded={onRunAdded}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
