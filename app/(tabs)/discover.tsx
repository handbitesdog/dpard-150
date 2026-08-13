import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { palette } from '@/design/colors';
import { fontFamily } from '@/design/typography';
import { spacing } from '@/design/spacing';

export default function DiscoverScreen() {
  const [claimingStamp, setClaimingStamp] = useState(false);

  const handleClaimStamp = () => {
    setClaimingStamp(true);
    setTimeout(() => setClaimingStamp(false), 1500);
  };

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        Discover
      </Text>
      <View style={styles.buttons}>
        <Button label="Directions" onPress={() => {}} icon="navigate-outline" />
        <Button label="Learn more" onPress={() => {}} variant="secondary" color="sky" />
        <Button label="Check in" onPress={() => {}} variant="secondary" color="pear" />
        <Button
          label="Directions"
          onPress={() => {}}
          icon="navigate-outline"
          size="small"
        />
        <View style={styles.inlineRow}>
          <Button
            label="Learn more"
            onPress={() => {}}
            variant="secondary"
            color="sky"
            size="small"
            fullWidth={false}
          />
          <Button
            label="Check in"
            onPress={() => {}}
            variant="secondary"
            color="pear"
            size="small"
            fullWidth={false}
          />
        </View>
        <Button label="Claim stamp" onPress={handleClaimStamp} loading={claimingStamp} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fontFamily.bold,
    color: palette.navy,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttons: {
    gap: spacing.base,
  },
  inlineRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
});
