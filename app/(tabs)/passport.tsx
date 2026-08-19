import { StyleSheet, View } from 'react-native';
import { PassportCard } from '@/components/PassportCard';
import { Screen } from '@/components/Screen';
import { Text } from '@/components/Text';
import { parks } from '@/data';
import { useStampStore } from '@/stores/stampStore';

export default function PassportScreen() {
  const collected = useStampStore((s) => s.stamps.length);

  return (
    <Screen testID="screen-passport">
      <Text variant="title1" accessibilityRole="header" style={styles.hiddenHeading}>
        Passport
      </Text>

      <View style={styles.cardContainer}>
        <PassportCard collected={collected} total={parks.length} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hiddenHeading: {
    position: 'absolute',
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
