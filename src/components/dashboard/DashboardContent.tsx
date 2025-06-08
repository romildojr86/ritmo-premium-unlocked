
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
  onStatusChange
}: DashboardContentProps) => {
  return (
    <>
      {/* Aviso de Trial Expirado */}
      {isExpired && user && (
        <ExpiredTrialWarning 
          userId={user.id} 
          onStatusChange={onStatusChange}
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
