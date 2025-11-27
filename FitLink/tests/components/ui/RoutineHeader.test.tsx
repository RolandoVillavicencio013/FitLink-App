jest.mock('../../../src/constants/theme', () => ({
  theme: {
    colors: {
      textPrimary: '#000000',
      textSecondary: '#666666',
    },
  },
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import { RoutineHeader } from '../../../src/components/ui/RoutineHeader';

describe('RoutineHeader', () => {
  it('should render without crashing', () => {
    expect(() => render(
      <RoutineHeader name="Morning Workout" estimatedTime={45} />
    )).not.toThrow();
  });

  it('should display routine name', () => {
    const { getByText } = render(
      <RoutineHeader name="Morning Workout" estimatedTime={45} />
    );
    expect(getByText('Morning Workout')).toBeTruthy();
  });

  it('should display estimated time', () => {
    const { getByText } = render(
      <RoutineHeader name="Morning Workout" estimatedTime={45} />
    );
    expect(getByText('45 minutos')).toBeTruthy();
  });

  it('should display different routine name', () => {
    const { getByText } = render(
      <RoutineHeader name="Evening Stretch" estimatedTime={30} />
    );
    expect(getByText('Evening Stretch')).toBeTruthy();
  });

  it('should display different estimated time', () => {
    const { getByText } = render(
      <RoutineHeader name="Quick Session" estimatedTime={15} />
    );
    expect(getByText('15 minutos')).toBeTruthy();
  });

  it('should display zero time', () => {
    const { getByText } = render(
      <RoutineHeader name="No Time Routine" estimatedTime={0} />
    );
    expect(getByText('0 minutos')).toBeTruthy();
  });

  it('should display large time value', () => {
    const { getByText } = render(
      <RoutineHeader name="Marathon Session" estimatedTime={120} />
    );
    expect(getByText('120 minutos')).toBeTruthy();
  });

  it('should display empty name', () => {
    const { getByText } = render(
      <RoutineHeader name="" estimatedTime={30} />
    );
    expect(getByText('')).toBeTruthy();
  });
});
