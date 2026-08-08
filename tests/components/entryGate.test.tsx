import { render } from '@testing-library/react-native';
import Index from '../../app/index';
import { usePrefsStore } from '@/stores/prefsStore';
import { storage } from '@/stores/storage';

const mockRedirect = jest.fn((_props: { href: string }) => null);

jest.mock('expo-router', () => ({
  Redirect: (props: { href: string }) => mockRedirect(props),
}));

describe('entry gate', () => {
  beforeEach(() => {
    storage.clearAll();
    usePrefsStore.setState({ onboardingCompletedAt: null });
    mockRedirect.mockClear();
    delete process.env.EXPO_PUBLIC_SKIP_ONBOARDING;
  });

  it('sends a first-time user to onboarding', async () => {
    await render(<Index />);

    expect(mockRedirect).toHaveBeenCalledWith({ href: '/onboarding' });
  });

  it('sends a returning user straight to Discover', async () => {
    usePrefsStore.setState({ onboardingCompletedAt: Date.now() });

    await render(<Index />);

    expect(mockRedirect).toHaveBeenCalledWith({ href: '/discover' });
  });

  it('honors the skip flag in development', async () => {
    process.env.EXPO_PUBLIC_SKIP_ONBOARDING = '1';

    await render(<Index />);

    // __DEV__ is true under Jest, so the flag applies here. The production
    // half of this guarantee is covered in tests/unit/onboarding.test.ts,
    // which exercises the resolver with isDev false.
    expect(mockRedirect).toHaveBeenCalledWith({ href: '/discover' });
  });
});
