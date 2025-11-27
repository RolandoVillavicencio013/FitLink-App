jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesome',
}));

jest.mock('../../../src/components/ui', () => ({
  RoutineCard: jest.fn(() => null),
  SearchInput: jest.fn(() => null),
  Button: jest.fn(() => null),
}));

jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      primary: '#007AFF',
      background: '#f5f5f5',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { ActivityIndicator } from 'react-native';
import { RoutinesList } from '../../../src/components/lists/RoutinesList';
import { RoutineCard, SearchInput, Button } from '../../../src/components/ui';

describe('RoutinesList', () => {
  const mockRoutines = [
    {
      routine_id: 1,
      name: 'Routine 1',
      description: 'Description 1',
      is_shared: false,
      created_at: '2024-01-01',
      user_id: '1',
      estimated_time: 30,
      routine_exercises: [{ exercise_id: 1 }, { exercise_id: 2 }],
    },
    {
      routine_id: 2,
      name: 'Routine 2',
      description: 'Description 2',
      is_shared: true,
      created_at: '2024-01-02',
      user_id: '1',
      estimated_time: 45,
      routine_exercises: [{ exercise_id: 3 }],
    },
  ];

  const mockProps = {
    routines: mockRoutines,
    loading: false,
    searchQuery: '',
    onSearchChange: jest.fn(),
    onRoutinePress: jest.fn(),
    onAddRoutine: jest.fn(),
    onQuickStart: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when loading', () => {
    it('should render without crashing', () => {
      expect(() => render(
        <RoutinesList {...mockProps} loading={true} />
      )).not.toThrow();
    });

    it('should display ActivityIndicator', () => {
      const { UNSAFE_getByType } = render(
        <RoutinesList {...mockProps} loading={true} />
      );
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });

    it('should not render FlatList when loading', () => {
      render(
        <RoutinesList {...mockProps} loading={true} />
      );
      expect(SearchInput).not.toHaveBeenCalled();
    });
  });

  describe('when not loading', () => {
    it('should render without crashing', () => {
      expect(() => render(<RoutinesList {...mockProps} />)).not.toThrow();
    });

    it('should render SearchInput', () => {
      render(<RoutinesList {...mockProps} />);
      expect(SearchInput).toHaveBeenCalled();
    });

    it('should render SearchInput with correct props', () => {
      render(<RoutinesList {...mockProps} searchQuery="test" />);
      const callArgs = (SearchInput as jest.Mock).mock.calls[0][0];
      expect(callArgs.placeholder).toBe('Buscar rutina...');
      expect(callArgs.value).toBe('test');
      expect(callArgs.onChangeText).toBe(mockProps.onSearchChange);
    });

    it('should render Button', () => {
      render(<RoutinesList {...mockProps} />);
      expect(Button).toHaveBeenCalled();
    });

    it('should render Button with correct props', () => {
      render(<RoutinesList {...mockProps} />);
      const callArgs = (Button as jest.Mock).mock.calls[0][0];
      expect(callArgs.title).toBe('Inicio rápido');
      expect(callArgs.onPress).toBeDefined();
    });

    it('should render RoutineCard for each routine', () => {
      render(<RoutinesList {...mockProps} />);
      expect(RoutineCard).toHaveBeenCalledTimes(3);
    });

    it('should render first RoutineCard with correct props', () => {
      render(<RoutinesList {...mockProps} />);
      const firstCall = (RoutineCard as jest.Mock).mock.calls[0][0];
      expect(firstCall.name).toBe('Routine 1');
      expect(firstCall.exerciseCount).toBe(2);
      expect(firstCall.estimatedTime).toBe(30);
    });

    it('should render second RoutineCard with correct props', () => {
      render(<RoutinesList {...mockProps} />);
      const secondCall = (RoutineCard as jest.Mock).mock.calls[2][0];
      expect(secondCall.name).toBe('Routine 2');
      expect(secondCall.exerciseCount).toBe(1);
      expect(secondCall.estimatedTime).toBe(45);
    });

    it('should handle routine with empty exercises array', () => {
      const routinesWithEmpty = [
        { ...mockRoutines[0], routine_exercises: [] },
      ];
      render(<RoutinesList {...mockProps} routines={routinesWithEmpty} />);
      const callArgs = (RoutineCard as jest.Mock).mock.calls[0][0];
      expect(callArgs.exerciseCount).toBe(0);
    });

    it('should handle empty routines array', () => {
      render(<RoutinesList {...mockProps} routines={[]} />);
      expect(RoutineCard).not.toHaveBeenCalled();
    });

    it('should call onRoutinePress when RoutineCard is pressed', () => {
      render(<RoutinesList {...mockProps} />);
      const firstCardOnPress = (RoutineCard as jest.Mock).mock.calls[0][0].onPress;
      firstCardOnPress();
      expect(mockProps.onRoutinePress).toHaveBeenCalledWith(1);
    });

    it('should call onRoutinePress with correct routine_id', () => {
      render(<RoutinesList {...mockProps} />);
      const secondCardOnPress = (RoutineCard as jest.Mock).mock.calls[2][0].onPress;
      secondCardOnPress();
      expect(mockProps.onRoutinePress).toHaveBeenCalledWith(2);
    });
  });
});
