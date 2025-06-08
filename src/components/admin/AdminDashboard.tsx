
import React from 'react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useAuth } from '@/hooks/useAuth';
import AdminStats from './AdminStats';
import AdminFilters from './AdminFilters';
import AdminUsersTable from './AdminUsersTable';
import LoadingSpinner from '@/components/dashboard/LoadingSpinner';

const AdminDashboard = () => {
  const { handleLogout } = useAuth();
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    planFilter,
    setPlanFilter,
    stats
  } = useAdminUsers();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Stats */}
        <AdminStats stats={stats} />

        {/* Filters */}
        <AdminFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          planFilter={planFilter}
          setPlanFilter={setPlanFilter}
        />

        {/* Users Table */}
        <AdminUsersTable users={users} />
      </div>
    </div>
  );
};

export default AdminDashboard;
