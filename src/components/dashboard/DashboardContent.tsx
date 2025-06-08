
import React from 'react';
import FreeUserDashboard from '@/components/dashboard/FreeUserDashboard';
import PremiumUserDashboard from '@/components/dashboard/PremiumUserDashboard';
import TrialWarning from '@/components/dashboard/TrialWarning';
import ExpiredTrialWarning from '@/components/dashboard/ExpiredTrialWarning';

interface Run {
  id: string;
  data: string;
  distancia_km: number;
  tempo_min: number;
  notas?: string;
  criado_em: string;
}

interface Stats {
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  runsThisWeek: number;
}

interface UserProfile {
  id: string;
  nome: string;
  email: string;
  status: string;
  plano?: string;
  assinou_em?: string;
  expira_em?: string;
}

interface DashboardContentProps {
  user: any;
  userProfile: UserProfile | null;
  runs: Run[];
  stats: Stats;
  isExpired: boolean;
  isPremium: boolean;
  isFree: boolean;
  isActiveTrial: boolean;
  onRunAdded: () => void;
  onStatusChange: () => void;
  profileLoading: boolean;
  runsLoading: boolean;
}

const DashboardContent = ({
  user,
  userProfile,
  runs,
  stats,
  isExpired,
  isPremium,
  isFree,
  isActiveTrial,
  onRunAdded,
  onStatusChange,
  profileLoading,
  runsLoading
}: DashboardContentProps) => {
  // Renderizar sempre, sem aguardar userProfile
  return (
    <>
      {/* Aviso de Trial Expirado - só mostrar se tiver userProfile confirmado */}
      {isExpired && user && userProfile && (
        <ExpiredTrialWarning 
          userId={user.id} 
          onStatusChange={onStatusChange}
        />
      )}

      {/* Aviso de Trial Premium Ativo - só mostrar se tiver userProfile confirmado */}
      {!isExpired && isActiveTrial && userProfile?.expira_em && (
        <TrialWarning expiresAt={userProfile.expira_em} />
      )}

      {/* Conteúdo baseado no status - usar fallback se ainda carregando */}
      {(isFree || (!userProfile && !profileLoading)) && (
        <FreeUserDashboard 
          stats={stats}
          onRunAdded={onRunAdded}
        />
      )}

      {isPremium && !isExpired && (
        <PremiumUserDashboard 
          stats={stats}
          runs={runs}
          onRunAdded={onRunAdded}
        />
      )}
    </>
  );
};

export default DashboardContent;
