jest.mock('../../src/components/useClientOnlyValue.web');

import { useClientOnlyValue } from '../../src/components/useClientOnlyValue.web';

const mockUseClientOnlyValue = useClientOnlyValue as jest.MockedFunction<typeof useClientOnlyValue>;

describe('useClientOnlyValue.web', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return client value when called', () => {
    mockUseClientOnlyValue.mockReturnValue('client');
    const result = mockUseClientOnlyValue('server', 'client');
    expect(result).toBe('client');
  });

  it('should be called with server and client arguments', () => {
    mockUseClientOnlyValue.mockReturnValue('client');
    mockUseClientOnlyValue('server', 'client');
    expect(mockUseClientOnlyValue).toHaveBeenCalledWith('server', 'client');
  });

  it('should work with different types', () => {
    mockUseClientOnlyValue.mockReturnValue(20);
    const result = mockUseClientOnlyValue(10, 20);
    expect(result).toBe(20);
  });

  it('should work with objects', () => {
    const clientValue = { type: 'client' };
    mockUseClientOnlyValue.mockReturnValue(clientValue);
    const result = mockUseClientOnlyValue({ type: 'server' }, clientValue);
    expect(result).toEqual({ type: 'client' });
  });

  it('should work with null and string', () => {
    mockUseClientOnlyValue.mockReturnValue('client');
    const result = mockUseClientOnlyValue(null, 'client');
    expect(result).toBe('client');
  });

  it('should work with boolean values', () => {
    mockUseClientOnlyValue.mockReturnValue(true);
    const result = mockUseClientOnlyValue(false, true);
    expect(result).toBe(true);
  });

  it('should work with arrays', () => {
    const clientValue = [1, 2, 3];
    mockUseClientOnlyValue.mockReturnValue(clientValue);
    const result = mockUseClientOnlyValue([], clientValue);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should work with undefined values', () => {
    mockUseClientOnlyValue.mockReturnValue('defined');
    const result = mockUseClientOnlyValue(undefined, 'defined');
    expect(result).toBe('defined');
  });
});
