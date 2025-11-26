// tests/home.test.tsx
import { render } from '@testing-library/react-native';
import React from 'react';
import Home from '../src/app/(tabs)/home';

describe('Home screen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Este es el Home')).toBeTruthy();
  });
});
