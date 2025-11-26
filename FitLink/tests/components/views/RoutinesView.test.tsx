jest.mock('../../../src/containers/RoutinesContainer', () => ({
  useRoutinesContainer: jest.fn(),
}));

jest.mock('../../../src/components/lists/RoutinesList', () => ({
  RoutinesList: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { RoutinesView } from '../../../src/components/views/RoutinesView';
import { useRoutinesContainer } from '../../../src/containers/RoutinesContainer';
import { RoutinesList } from '../../../src/components/lists/RoutinesList';

describe('RoutinesView', () => {
  const mockUseRoutinesContainer = useRoutinesContainer as jest.Mock;

  const mockRoutines = [
    {
      routine_id: 1,
      name: 'Routine 1',
      description: 'Description 1',
      is_shared: false,
      created_at: '2024-01-01',
      user_id: '1',
      estimated_time: 30,
      routine_exercises: [{ exercise_id: 1 }],
    },
  ];

  const mockContainerData = {
    routines: mockRoutines,
    loading: false,
    searchQuery: '',
    setSearchQuery: jest.fn(),
    navigateToRoutine: jest.fn(),
    navigateToAddRoutine: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoutinesContainer.mockReturnValue(mockContainerData);
  });

  it('should render without crashing', () => {
    expect(() => render(<RoutinesView />)).not.toThrow();
  });

  it('should call useRoutinesContainer hook', () => {
    render(<RoutinesView />);
    expect(useRoutinesContainer).toHaveBeenCalled();
  });

  it('should render RoutinesList', () => {
    render(<RoutinesView />);
    expect(RoutinesList).toHaveBeenCalled();
  });

  it('should pass routines to RoutinesList', () => {
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.routines).toBe(mockRoutines);
  });

  it('should pass loading state to RoutinesList', () => {
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.loading).toBe(false);
  });

  it('should pass loading true to RoutinesList', () => {
    const loadingData = { ...mockContainerData, loading: true };
    mockUseRoutinesContainer.mockReturnValue(loadingData);
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.loading).toBe(true);
  });

  it('should pass searchQuery to RoutinesList', () => {
    const dataWithSearch = { ...mockContainerData, searchQuery: 'test search' };
    mockUseRoutinesContainer.mockReturnValue(dataWithSearch);
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.searchQuery).toBe('test search');
  });

  it('should pass setSearchQuery to RoutinesList', () => {
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.onSearchChange).toBe(mockContainerData.setSearchQuery);
  });

  it('should pass navigateToRoutine to RoutinesList', () => {
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.onRoutinePress).toBe(mockContainerData.navigateToRoutine);
  });

  it('should pass navigateToAddRoutine to RoutinesList', () => {
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.onAddRoutine).toBe(mockContainerData.navigateToAddRoutine);
  });

  it('should pass empty routines array to RoutinesList', () => {
    const emptyData = { ...mockContainerData, routines: [] };
    mockUseRoutinesContainer.mockReturnValue(emptyData);
    render(<RoutinesView />);
    const callArgs = (RoutinesList as jest.Mock).mock.calls[0][0];
    expect(callArgs.routines).toEqual([]);
  });
});
