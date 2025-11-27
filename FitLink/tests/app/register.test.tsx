jest.mock('../../src/components/views/RegisterView', () => ({
  RegisterView: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import Register from '../../src/app/register';
import { RegisterView } from '../../src/components/views/RegisterView';

describe('Register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<Register />)).not.toThrow();
  });

  it('should render RegisterView component', () => {
    render(<Register />);
    expect(RegisterView).toHaveBeenCalled();
  });

  it('should render RegisterView component exactly once', () => {
    render(<Register />);
    expect(RegisterView).toHaveBeenCalledTimes(1);
  });
});
