
import React from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRuns } from '@/hooks/useRuns';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import FreeUserDashboard from '@/components/dashboard/FreeUserDashboard';
import PremiumUserDashboard from '@/components/dashboard/PremiumUserDashboard';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';
import TrialWarning from '@/components/dashboard/TrialWarning';

const Dashboard = () => {
  const { user, handleLogout } = useAuth();
  const { userProfile } = useUserProfile(user);
  const { runs, stats, loading, refetchRuns } = useRuns(user);

  const handleRunAdded = () => {
    refetchRuns();
    toast.success('Corrida registrada com sucesso!');
  };

  const isPremium = userProfile?.status === 'premium' || userProfile?.status === 'vitalicio';
  const isFree = userProfile?.status === 'free';
  
  // Verificar se é trial premium ativo
  const isActiveTrial = userProfile?.status === 'premium' && 
                       userProfile?.plano === 'trial' && 
                       userProfile?.expira_em && 
                       new Date(userProfile.expira_em) > new Date();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DashboardHeader 
          userName={userProfile?.nome || 'Usuário'} 
          onLogout={handleLogout}
        />

        {/* Aviso de Trial Premium */}
        {isActiveTrial && userProfile?.expira_em && (
          <TrialWarning expiresAt={userProfile.expira_em} />
        )}

        {/* Conteúdo baseado no status */}
        {isFree && (
          <FreeUserDashboard 
            stats={stats}
            onRunAdded={handleRunAdded}
          />
        )}

        {isPremium && (
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
