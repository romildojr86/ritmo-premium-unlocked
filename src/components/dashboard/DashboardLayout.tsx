
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

  // Se houve erro grave no perfil E timeout (apenas para erros persistentes)
  if (profileError && dataTimeout && !profileLoading) {
    return <DashboardError onRetry={onRetry} error={profileError} />;
  }

  // Nome do usuário com fallback
  const userName = userProfile?.nome || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader 
          userName={userName} 
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
          profileLoading={profileLoading}
          runsLoading={runsLoading}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
