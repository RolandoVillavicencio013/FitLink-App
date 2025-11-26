import React from 'react';
import { useRoutinesContainer } from '../../containers/RoutinesContainer';
import { RoutinesList } from '../lists/RoutinesList';

export const RoutinesView: React.FC = () => {
  const {
    routines,
    loading,
    searchQuery,
    setSearchQuery,
    navigateToRoutine,
    navigateToAddRoutine,
  } = useRoutinesContainer();

  return (
    <RoutinesList
      routines={routines}
      loading={loading}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      onRoutinePress={navigateToRoutine}
      onAddRoutine={navigateToAddRoutine}
    />
  );
};