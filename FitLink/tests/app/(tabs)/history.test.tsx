import React from 'react';
import { render } from '@testing-library/react-native';
import History from '../../../src/app/(tabs)/history';

describe('History', () => {
  it('should render without crashing', () => {
    expect(() => render(<History />)).not.toThrow();
  });

  it('should display the history text', () => {
    const { getByText } = render(<History />);
    expect(getByText('Este es el historial de entrenamientos')).toBeTruthy();
  });

  it('should render a View container', () => {
    const { UNSAFE_root } = render(<History />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render Text component with correct content', () => {
    const { getByText } = render(<History />);
    const textElement = getByText('Este es el historial de entrenamientos');
    expect(textElement).toBeDefined();
  });
});
