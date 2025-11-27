import React from 'react';
import { render } from '@testing-library/react-native';
import Profile from '../../../src/app/(tabs)/profile';

describe('Profile', () => {
  it('should render without crashing', () => {
    expect(() => render(<Profile />)).not.toThrow();
  });

  it('should display the profile text', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Este es el profile')).toBeTruthy();
  });

  it('should render a View container', () => {
    const { UNSAFE_root } = render(<Profile />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render Text component with correct content', () => {
    const { getByText } = render(<Profile />);
    const textElement = getByText('Este es el profile');
    expect(textElement).toBeDefined();
  });
});
