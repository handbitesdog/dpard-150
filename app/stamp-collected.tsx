import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StampAddedCard } from '@/components/StampAddedCard';
import { Text } from '@/components/Text';
import { parks } from '@/data';
import { stampImage } from '@/data/assets';
import { spacing } from '@/design/spacing';

export default function StampCollectedScreen() {
  const { parkId } = useLocalSearchParams<{ parkId: string }>();
  const router = useRouter();
  const park = parks.find((candidate) => candidate.id === parkId);

  if (!park) return null;

  return (
    <Screen>
      <View style={styles.body}>
        <StampAddedCard name={park.name} image={stampImage(park)} />
      </View>

      <View style={styles.actions}>
        <Button label="View Passport" onPress={() => router.dismissTo('/passport')} />
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          style={styles.close}
        >
          <Text variant="headline">Close</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    paddingBottom: spacing.base,
  },
  close: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
});
