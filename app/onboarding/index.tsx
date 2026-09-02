import { Link } from 'expo-router';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { sizes } from '@/design/sizes';
import { spacing } from '@/design/spacing';

const BACKGROUND = require('../../assets/onboarding-background.jpg');
const TOP_LOGO = require('../../assets/DPARD-150-logo.png');
const BOTTOM_LOGO = require('../../assets/DPARD-icon-logo.png');

const TOP_LOGO_RATIO = 600 / 537;
const BOTTOM_LOGO_RATIO = 413 / 501;

export default function OnboardingWelcome() {
  const { width } = useWindowDimensions();
  const topLogoWidth = width * 0.38;
  const bottomLogoWidth = 32;

  return (
    <ImageBackground source={BACKGROUND} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.screen} testID="onboarding-welcome">
        <Image
          source={TOP_LOGO}
          style={{ width: topLogoWidth, height: topLogoWidth / TOP_LOGO_RATIO }}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Dallas Park and Recreation 150th anniversary logo"
        />
        <View style={styles.body}>
          <Text variant="display" accessibilityRole="header" color="white">
            Welcome to Your DPARD 150 Parks Adventure
          </Text>
        </View>
        <View style={styles.spacer} />
        <Link href="/onboarding/1" asChild>
          <Pressable
            style={styles.button}
            accessibilityRole="button"
            accessibilityLabel="Get started"
            testID="onboarding-get-started"
          >
            <Text variant="headline" color="white" style={styles.buttonLabel}>
              Get started
            </Text>
          </Pressable>
        </Link>
        <Image
          source={BOTTOM_LOGO}
          style={{
            width: bottomLogoWidth,
            height: bottomLogoWidth / BOTTOM_LOGO_RATIO,
            alignSelf: 'center',
            marginTop: spacing.base,
          }}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Dallas Park and Recreation icon logo"
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  screen: { flex: 1, padding: spacing.xl },
  body: { marginTop: spacing['4xl'] },
  button: {
    minHeight: sizes.touchTarget,
    borderRadius: radii.md,
    backgroundColor: palette.pear,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing['3xl'],
  },
  spacer: { flex: 1 },
  buttonLabel: { textTransform: 'uppercase', letterSpacing: 0.5 },
});
