jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

import { useRouter } from 'expo-router';
import { render } from '@testing-library/react-native';
import Index from '../../src/app/index';

describe('Index', () => {
  const mockRouter = {
    replace: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render without crashing', () => {
    expect(() => render(<Index />)).not.toThrow();
  });

  it('should return null', () => {
    const { toJSON } = render(<Index />);
    expect(toJSON()).toBeNull();
  });

  it('should call useRouter hook', () => {
    render(<Index />);
    expect(useRouter).toHaveBeenCalled();
  });

  it('should redirect to login page', () => {
    render(<Index />);
    jest.runAllTimers();
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('should redirect immediately with timeout of 0', () => {
    render(<Index />);
    expect(mockRouter.replace).not.toHaveBeenCalled();
    jest.advanceTimersByTime(0);
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  it('should cleanup timeout on unmount', () => {
    const { unmount } = render(<Index />);
    unmount();
    jest.runAllTimers();
    expect(mockRouter.replace).not.toHaveBeenCalled();
  });
});
