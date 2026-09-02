import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';
import { ONBOARDING_SLIDES, type OnboardingSlide } from '@/features/onboarding/slides';
import { usePrefsStore } from '@/stores/prefsStore';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { spacing } from '@/design/spacing';

// Blurred park photo behind each slide's phone mockup, rotating through
// park-1..4.jpg so the four slides don't all show the same shot.
const SLIDE_BACKGROUNDS = [
  require('../../assets/onboarding-slide-bg-1.jpg'),
  require('../../assets/onboarding-slide-bg-2.jpg'),
  require('../../assets/onboarding-slide-bg-3.jpg'),
  require('../../assets/onboarding-slide-bg-4.jpg'),
];

// Picked for content relevance to each slide's copy — the map slide shows the
// Explore map, the audio slide the Audio Tour list, and so on.
const SLIDE_PHONES = [
  require('../../assets/onboarding-1.png'), // Map — Explore map
  require('../../assets/onboarding-2.png'), // Audio — Audio Tour list
  require('../../assets/onboarding-3.png'), // Stamps — Park Stamps
  require('../../assets/onboarding-4.png'), // Reward — Passport
];

const PHONE_ASPECT_RATIO = 928 / 1830;
const PHONE_WIDTH_RATIO = 0.72;
// Fraction of the phone screenshot's height, measured from the top, before
// its own in-app bottom navbar begins — the top section is sized to this so
// the mockup is visible all the way down to just above that navbar.
const PHONE_VISIBLE_RATIO = 1592 / 1830;
const FADE_HEIGHT = 140;

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
  const insets = useSafeAreaInsets();
  const completeOnboarding = usePrefsStore((s) => s.completeOnboarding);

  // The photo background bleeds behind the status bar, so its icons need to
  // read against the image rather than the beige background below it.
  useEffect(() => {
    StatusBar.setStyle('light');
    return () => StatusBar.setStyle('dark');
  }, []);

  // The route param seeds the starting slide; `index` is the source of truth
  // afterwards so tapping and swiping stay in agreement.
  const [index, setIndex] = useState(() => parseStepParam(step));
  const listRef = useRef<FlatList<OnboardingSlide>>(null);

  const isLast = index === ONBOARDING_SLIDES.length - 1;
  const phoneMarginTop = insets.top + spacing.xl;

  // A horizontal FlatList's items don't reliably stretch to the list's
  // height via flex alone, which broke `overflow: hidden` clipping on the
  // phone mockup — so the list's height is measured and handed to each
  // item as an explicit pixel value instead.
  const [listHeight, setListHeight] = useState(0);
  const handleListLayout = useCallback((event: LayoutChangeEvent) => {
    setListHeight(event.nativeEvent.layout.height);
  }, []);

  // The text block's height varies per slide's copy; the largest one seen so
  // far is reserved for every slide so the top section is a consistent size
  // and never has to compete with text for space. The screen must never
  // scroll, so it's the phone mockup that shrinks to fit what's left, rather
  // than the text getting clipped.
  const [maxTextHeight, setMaxTextHeight] = useState(0);
  const handleTextLayout = useCallback((event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setMaxTextHeight((prev) => (height > prev ? height : prev));
  }, []);
  const topSectionHeight = Math.max(listHeight - maxTextHeight, 0);

  // Image (unlike View) doesn't reliably honor `aspectRatio` on Android, so
  // both dimensions are computed explicitly instead.
  const baseWidth = width * PHONE_WIDTH_RATIO;
  const baseVisibleHeight = (baseWidth / PHONE_ASPECT_RATIO) * PHONE_VISIBLE_RATIO;
  const availableForPhone = Math.max(topSectionHeight - phoneMarginTop, 0);
  const shrink = baseVisibleHeight > 0 ? Math.min(1, availableForPhone / baseVisibleHeight) : 1;
  const phoneWidth = baseWidth * shrink;
  const phoneHeight = phoneWidth / PHONE_ASPECT_RATIO;

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
    <View style={styles.screen} testID="onboarding-slides">
      <FlatList
        ref={listRef}
        style={styles.list}
        onLayout={handleListLayout}
        data={ONBOARDING_SLIDES}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={index}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={handleMomentumEnd}
        renderItem={({ item, index: itemIndex }) => (
          <View style={[styles.slide, { width, height: listHeight }]}>
            <View style={[styles.topSection, { height: topSectionHeight }]}>
              <ImageBackground
                source={SLIDE_BACKGROUNDS[itemIndex]}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
              <Image
                source={SLIDE_PHONES[itemIndex]}
                style={{ width: phoneWidth, height: phoneHeight, marginTop: phoneMarginTop }}
                resizeMode="contain"
                accessibilityElementsHidden
                importantForAccessibility="no"
              />
              <Svg style={styles.fade} pointerEvents="none">
                <Defs>
                  <LinearGradient id="onboardingFade" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={palette.beige} stopOpacity={0} />
                    <Stop offset="1" stopColor={palette.beige} stopOpacity={1} />
                  </LinearGradient>
                </Defs>
                <Rect x={0} y={0} width="100%" height="100%" fill="url(#onboardingFade)" />
              </Svg>
            </View>
            <View style={styles.textSection} onLayout={handleTextLayout}>
              <Text variant="display" accessibilityRole="header" style={styles.title}>
                {item.title}
              </Text>
              <Text variant="body" style={styles.body}>
                {item.body}
              </Text>
            </View>
          </View>
        )}
      />

      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <Pressable
          style={styles.button}
          onPress={handleAdvance}
          accessibilityRole="button"
          accessibilityLabel={isLast ? "Let's go!" : 'Next'}
          testID="onboarding-advance"
        >
          <Text variant="headline" color="white" style={styles.buttonLabel}>
            {isLast ? "Let's go!" : 'Next'}
          </Text>
        </Pressable>

        <View
          style={styles.progress}
          accessibilityRole="progressbar"
          accessibilityLabel={`Step ${index + 1} of ${ONBOARDING_SLIDES.length}`}
          testID="onboarding-progress"
        >
          {ONBOARDING_SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.beige },
  list: { flex: 1 },
  slide: {},
  topSection: {
    overflow: 'hidden',
    alignItems: 'center',
    backgroundColor: palette.beige,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FADE_HEIGHT,
  },
  textSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  title: { marginBottom: spacing.base, textAlign: 'center' },
  body: { textAlign: 'center' },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { backgroundColor: palette.navy },
  dotInactive: { backgroundColor: palette.grey },
  button: {
    minHeight: 44,
    marginHorizontal: spacing.xl,
    marginTop: spacing.base,
    borderRadius: 12,
    backgroundColor: palette.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  buttonLabel: { textTransform: 'uppercase', letterSpacing: 0.5 },
});
