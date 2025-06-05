
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Run {
  id: string;
  data: string;
  distancia_km: number;
  tempo_min: number;
  notas?: string;
  criado_em: string;
}

interface RunHistoryProps {
  runs: Run[];
}

const RunHistory = ({ runs }: RunHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const calculatePace = (distanceKm: number, timeMin: number) => {
    const paceMinPerKm = timeMin / distanceKm;
    const minutes = Math.floor(paceMinPerKm);
    const seconds = Math.round((paceMinPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Corridas</CardTitle>
      </CardHeader>
      <CardContent>
        {runs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma corrida registrada ainda.</p>
            <p className="text-sm">Registre sua primeira corrida acima!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Distância</TableHead>
                  <TableHead>Tempo</TableHead>
                  <TableHead>Pace</TableHead>
                  <TableHead>Notas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.slice(0, 10).map((run) => (
                  <TableRow key={run.id}>
                    <TableCell className="font-medium">
                      {formatDate(run.data)}
                    </TableCell>
                    <TableCell>
                      {run.distancia_km.toFixed(1)} km
                    </TableCell>
                    <TableCell>
                      {formatTime(run.tempo_min)}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {calculatePace(run.distancia_km, run.tempo_min)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {run.notas || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RunHistory;
