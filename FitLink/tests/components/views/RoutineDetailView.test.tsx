jest.mock('../../../src/containers/RoutineDetailContainer', () => ({
  useRoutineDetailContainer: jest.fn(),
}));

jest.mock('../../../src/components/details/RoutineDetailContent', () => ({
  RoutineDetailContent: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { RoutineDetailView } from '../../../src/components/views/RoutineDetailView';
import { useRoutineDetailContainer } from '../../../src/containers/RoutineDetailContainer';
import { RoutineDetailContent } from '../../../src/components/details/RoutineDetailContent';

describe('RoutineDetailView', () => {
  const mockUseRoutineDetailContainer = useRoutineDetailContainer as jest.Mock;

  const mockRoutine = {
    routine_id: 1,
    name: 'Test Routine',
    description: 'Test Description',
    estimated_time: 60,
    created_at: '2024-01-01T12:00:00',
    is_shared: true,
    routine_exercises: [],
  };

  const mockContainerData = {
    routine: mockRoutine,
    loading: false,
    handleEdit: jest.fn(),
    handleDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRoutineDetailContainer.mockReturnValue(mockContainerData);
  });

  it('should render without crashing', () => {
    expect(() => render(<RoutineDetailView routineId="1" />)).not.toThrow();
  });

  it('should call useRoutineDetailContainer with routineId', () => {
    render(<RoutineDetailView routineId="123" />);
    expect(useRoutineDetailContainer).toHaveBeenCalledWith('123');
  });

  it('should call useRoutineDetailContainer with undefined', () => {
    render(<RoutineDetailView routineId={undefined} />);
    expect(useRoutineDetailContainer).toHaveBeenCalledWith(undefined);
  });

  it('should render RoutineDetailContent', () => {
    render(<RoutineDetailView routineId="1" />);
    expect(RoutineDetailContent).toHaveBeenCalled();
  });

  it('should pass routine to RoutineDetailContent', () => {
    render(<RoutineDetailView routineId="1" />);
    const callArgs = (RoutineDetailContent as jest.Mock).mock.calls[0][0];
    expect(callArgs.routine).toBe(mockRoutine);
  });

  it('should pass loading state to RoutineDetailContent', () => {
    render(<RoutineDetailView routineId="1" />);
    const callArgs = (RoutineDetailContent as jest.Mock).mock.calls[0][0];
    expect(callArgs.loading).toBe(false);
  });

  it('should pass loading true to RoutineDetailContent', () => {
    const loadingData = { ...mockContainerData, loading: true };
    mockUseRoutineDetailContainer.mockReturnValue(loadingData);
    render(<RoutineDetailView routineId="1" />);
    const callArgs = (RoutineDetailContent as jest.Mock).mock.calls[0][0];
    expect(callArgs.loading).toBe(true);
  });

  it('should pass handleEdit to RoutineDetailContent', () => {
    render(<RoutineDetailView routineId="1" />);
    const callArgs = (RoutineDetailContent as jest.Mock).mock.calls[0][0];
    expect(callArgs.onEdit).toBe(mockContainerData.handleEdit);
  });

  it('should pass handleDelete to RoutineDetailContent', () => {
    render(<RoutineDetailView routineId="1" />);
    const callArgs = (RoutineDetailContent as jest.Mock).mock.calls[0][0];
    expect(callArgs.onDelete).toBe(mockContainerData.handleDelete);
  });

  it('should pass null routine to RoutineDetailContent', () => {
    const nullData = { ...mockContainerData, routine: null };
    mockUseRoutineDetailContainer.mockReturnValue(nullData);
    render(<RoutineDetailView routineId="1" />);
    const callArgs = (RoutineDetailContent as jest.Mock).mock.calls[0][0];
    expect(callArgs.routine).toBe(null);
  });
});
