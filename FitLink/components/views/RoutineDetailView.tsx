import React from 'react';
import { useRoutineDetailContainer } from '../../containers/RoutineDetailContainer';
import { RoutineDetailContent } from '../details/RoutineDetailContent';

interface RoutineDetailViewProps {
  routineId: string | undefined;
}

export const RoutineDetailView: React.FC<RoutineDetailViewProps> = ({ routineId }) => {
  const { routine, loading, handleEdit, handleDelete } = useRoutineDetailContainer(routineId);

  return (
    <RoutineDetailContent
      routine={routine}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};