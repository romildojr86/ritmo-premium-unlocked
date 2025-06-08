
import React from 'react';
import { Users, Crown, Gift } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    total: number;
    premium: number;
    free: number;
  };
}

const AdminStats = ({ stats }: AdminStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Users */}
      <div className="bg-yellow-50 rounded-xl shadow-sm p-6 border border-yellow-100">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Users className="h-7 w-7 text-yellow-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-yellow-700">Total de Usuários</p>
            <p className="text-3xl font-bold text-yellow-900">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Premium Users */}
      <div className="bg-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
              <Crown className="h-7 w-7 text-yellow-700" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-yellow-800">Usuários Premium</p>
            <p className="text-3xl font-bold text-yellow-900">{stats.premium}</p>
          </div>
        </div>
      </div>

      {/* Free Users */}
      <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-100">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Gift className="h-7 w-7 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-green-700">Usuários Gratuitos</p>
            <p className="text-3xl font-bold text-green-900">{stats.free}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
