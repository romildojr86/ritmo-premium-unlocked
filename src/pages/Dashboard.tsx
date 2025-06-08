
import React from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Dashboard = () => {
  const {
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
  } = useDashboard();

  return (
    <DashboardLayout
      user={user}
      userProfile={userProfile}
      runs={runs}
      stats={stats}
      authLoading={authLoading}
      profileLoading={profileLoading}
      runsLoading={runsLoading}
      profileError={profileError}
      dataTimeout={dataTimeout}
      isExpired={isExpired}
      isPremium={isPremium}
      isFree={isFree}
      isActiveTrial={isActiveTrial}
      onLogout={handleLogout}
      onRunAdded={handleRunAdded}
      onStatusChange={handleStatusChange}
      onRetry={handleRetry}
    />
  );
};

export default Dashboard;
