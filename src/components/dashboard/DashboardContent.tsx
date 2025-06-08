
import React from 'react';
import FreeUserDashboard from '@/components/dashboard/FreeUserDashboard';
import PremiumUserDashboard from '@/components/dashboard/PremiumUserDashboard';
import TrialWarning from '@/components/dashboard/TrialWarning';
import ExpiredTrialWarning from '@/components/dashboard/ExpiredTrialWarning';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  // Se ainda está carregando o perfil, mostra dashboard básico com loading
  if (profileLoading && !userProfile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Carregando seus dados...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-3 text-gray-600">Preparando seu dashboard...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
