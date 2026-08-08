import { fireEvent, render, screen } from '@testing-library/react-native';
import OnboardingSlides from '../../app/onboarding/[step]';
import { ONBOARDING_SLIDES } from '@/features/onboarding/slides';
import { usePrefsStore } from '@/stores/prefsStore';
import { storage } from '@/stores/storage';

const mockReplace = jest.fn();
const mockSetParams = jest.fn();
let mockStepParam = '1';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ step: mockStepParam }),
  useRouter: () => ({ replace: mockReplace, setParams: mockSetParams }),
}));

describe('onboarding slides', () => {
  beforeEach(() => {
    storage.clearAll();
    usePrefsStore.setState({ onboardingCompletedAt: null });
    mockReplace.mockClear();
    mockSetParams.mockClear();
    mockStepParam = '1';
  });

  it('starts on the first slide', async () => {
    await render(<OnboardingSlides />);

    expect(
      screen.getByRole('header', { name: ONBOARDING_SLIDES[0]!.title }),
    ).toBeOnTheScreen();
    expect(screen.getByTestId('onboarding-progress')).toHaveAccessibleName('Step 1 of 4');
    expect(screen.getByTestId('onboarding-advance')).toHaveAccessibleName('Next');
  });

  it('advances 1 -> 2 -> 3 -> 4 and swaps the label on the last slide', async () => {
    await render(<OnboardingSlides />);
    const advance = screen.getByTestId('onboarding-advance');

    for (const step of [2, 3, 4]) {
      await fireEvent.press(advance);
      expect(screen.getByTestId('onboarding-progress')).toHaveAccessibleName(
        `Step ${step} of 4`,
      );
    }

    expect(screen.getByTestId('onboarding-advance')).toHaveAccessibleName("Let's go!");
  });

  it('keeps the route param in step with the slide', async () => {
    await render(<OnboardingSlides />);

    await fireEvent.press(screen.getByTestId('onboarding-advance'));

    expect(mockSetParams).toHaveBeenCalledWith({ step: '2' });
  });

  it("sets onboardingCompletedAt and leaves for the app on Let's go!", async () => {
    mockStepParam = String(ONBOARDING_SLIDES.length);
    await render(<OnboardingSlides />);

    expect(screen.getByTestId('onboarding-advance')).toHaveAccessibleName("Let's go!");
    await fireEvent.press(screen.getByTestId('onboarding-advance'));

    expect(usePrefsStore.getState().onboardingCompletedAt).toEqual(expect.any(Number));
    expect(mockReplace).toHaveBeenCalledWith('/discover');
  });

  it('clamps an out-of-range step param to the last slide', async () => {
    mockStepParam = '99';
    await render(<OnboardingSlides />);

    expect(screen.getByTestId('onboarding-progress')).toHaveAccessibleName('Step 4 of 4');
  });

  it('falls back to the first slide for a non-numeric step param', async () => {
    mockStepParam = 'banana';
    await render(<OnboardingSlides />);

    expect(screen.getByTestId('onboarding-progress')).toHaveAccessibleName('Step 1 of 4');
  });
});
