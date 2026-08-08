import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ONBOARDING_SLIDES, type OnboardingSlide } from '@/features/onboarding/slides';
import { usePrefsStore } from '@/stores/prefsStore';

/** Clamps a `[step]` route param (1-based) to a valid slide index (0-based). */
function parseStepParam(step: string | undefined): number {
  const parsed = Number.parseInt(step ?? '', 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(Math.max(parsed - 1, 0), ONBOARDING_SLIDES.length - 1);
}

export default function OnboardingSlides() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const completeOnboarding = usePrefsStore((s) => s.completeOnboarding);

  // The route param seeds the starting slide; `index` is the source of truth
  // afterwards so tapping and swiping stay in agreement.
  const [index, setIndex] = useState(() => parseStepParam(step));
  const listRef = useRef<FlatList<OnboardingSlide>>(null);

  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const goTo = useCallback(
    (next: number) => {
      setIndex(next);
      router.setParams({ step: String(next + 1) });
    },
    [router],
  );

  const handleMomentumEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      if (next !== index) goTo(next);
    },
    [goTo, index, width],
  );

  const handleAdvance = useCallback(() => {
    if (isLast) {
      completeOnboarding();
      router.replace('/discover');
      return;
    }
    const next = index + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    goTo(next);
  }, [completeOnboarding, goTo, index, isLast, router]);

  return (
    <SafeAreaView style={styles.screen} testID="onboarding-slides">
      <FlatList
        ref={listRef}
        data={ONBOARDING_SLIDES}
        keyExtractor={(slide) => slide.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={index}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.title} accessibilityRole="header">
              {item.title}
            </Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View
        style={styles.progress}
        accessibilityRole="progressbar"
        accessibilityLabel={`Step ${index + 1} of ${ONBOARDING_SLIDES.length}`}
        testID="onboarding-progress"
      >
        {ONBOARDING_SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      <Pressable
        style={styles.button}
        onPress={handleAdvance}
        accessibilityRole="button"
        accessibilityLabel={isLast ? "Let's go!" : 'Next'}
        testID="onboarding-advance"
      >
        <Text style={styles.buttonLabel}>{isLast ? "Let's go!" : 'Next'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  slide: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 34, lineHeight: 40, fontWeight: '700', marginBottom: 16 },
  body: { fontSize: 17, lineHeight: 24 },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: '#0f3357' },
  dotInactive: { backgroundColor: '#e5e5ea' },
  button: {
    minHeight: 44,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#0f3357',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  buttonLabel: { color: '#ffffff', fontSize: 17, fontWeight: '600' },
});
