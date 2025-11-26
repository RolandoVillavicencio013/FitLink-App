jest.mock('../../src/components/views/LoginView', () => ({
  LoginView: jest.fn(() => null),
}));

import React from 'react';
import { render } from '@testing-library/react-native';
import Login from '../../src/app/login';
import { LoginView } from '../../src/components/views/LoginView';

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    expect(() => render(<Login />)).not.toThrow();
  });

  it('should render LoginView component', () => {
    render(<Login />);
    expect(LoginView).toHaveBeenCalled();
  });

  it('should render LoginView component exactly once', () => {
    render(<Login />);
    expect(LoginView).toHaveBeenCalledTimes(1);
  });
});
