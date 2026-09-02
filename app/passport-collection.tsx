import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Divider } from '@/components/Divider';
import { PassportSummary } from '@/components/PassportSummary';
import { PhotoHeader } from '@/components/PhotoHeader';
import { Screen } from '@/components/Screen';
import { Stamp } from '@/components/Stamp';
import { StampGrid } from '@/components/StampGrid';
import { Text } from '@/components/Text';
import { parks } from '@/data';
import { stampImage } from '@/data/assets';
import { navyMuted } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { useStampStore } from '@/stores/stampStore';

const STAMP_PHOTO_PLACEHOLDER_GRAY = require('../assets/stamps/fair-park-stamp-gray.png');
const STAMP_SCALE = 0.9;

export default function PassportCollectionScreen() {
  const router = useRouter();
  const stamps = useStampStore((state) => state.stamps);

  return (
    <Screen scroll noTopInset>
      <View style={styles.fullBleed}>
        <PhotoHeader photo={require('../assets/statue-blue.png')} onBack={() => router.back()}>
          <View style={styles.badge}>
            <PassportSummary collected={stamps.length} total={parks.length} size={180} />
          </View>
        </PhotoHeader>
      </View>

      <Text variant="title1" accessibilityRole="header" style={styles.title}>
        Park Stamps
      </Text>
      <Text variant="body" style={styles.subtitle}>
        {stamps.length}/{parks.length} collected
      </Text>

      <View style={styles.divider}>
        <Divider />
      </View>

      <View style={styles.grid}>
        <StampGrid
          data={parks}
          keyExtractor={(park) => park.id}
          renderItem={(park, size) => (
            <Stamp
              name={park.name}
              image={stampImage(park)}
              grayImage={STAMP_PHOTO_PLACEHOLDER_GRAY}
              collected={stamps.some((stamp) => stamp.parkId === park.id)}
              size={size * STAMP_SCALE}
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fullBleed: {
    marginHorizontal: -spacing.base,
  },
  badge: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing.xl,
  },
  title: {
    marginTop: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: navyMuted,
  },
  divider: {
    marginTop: spacing.xl,
  },
  grid: {
    marginTop: spacing.xl,
  },
});
