// Mock environment variables for Supabase
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Suppress console errors and warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress all console.error in tests
  console.error = jest.fn();
  
  // Suppress all console.warn in tests
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
  usePathname: jest.fn(),
  useSegments: jest.fn(),
  Stack: {
    Screen: jest.fn(),
  },
  Link: jest.fn(),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));
