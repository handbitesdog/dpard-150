import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { spacing } from '@/design/spacing';
import type { StampOutcome } from '@/services/stampService';

type Failure = { status: 'too_far'; distanceMeters: number } | { status: 'low_accuracy' | 'denied' };

const FAILURE_MESSAGES: Record<'low_accuracy' | 'denied', string> = {
  low_accuracy: "Your location isn't accurate enough right now. Try again outdoors.",
  denied: 'Location permission is needed to collect this stamp.',
};

type ClaimStampButtonProps = {
  alreadyCollected: boolean;
  onClaim: () => Promise<StampOutcome>;
  onSuccess: () => void;
};

/** Renders every state `stampService.claimStamp` can return, distance included on the too-far failure. */
export function ClaimStampButton({ alreadyCollected, onClaim, onSuccess }: ClaimStampButtonProps) {
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState<Failure | null>(null);

  async function handlePress() {
    setLoading(true);
    setFailure(null);

    const outcome = await onClaim();
    setLoading(false);

    if (outcome.status === 'success') {
      onSuccess();
    } else if (outcome.status === 'too_far') {
      setFailure({ status: 'too_far', distanceMeters: outcome.distanceMeters });
    } else if (outcome.status === 'low_accuracy' || outcome.status === 'denied') {
      setFailure({ status: outcome.status });
    }
  }

  if (alreadyCollected) {
    return (
      <Button
        label="Stamp Collected"
        onPress={() => {}}
        variant="secondary"
        color="sky"
        icon="checkmark-circle"
        disabled
      />
    );
  }

  return (
    <View>
      <Button label="Collect Stamp" onPress={handlePress} variant="secondary" color="pear" loading={loading} />
      {failure && (
        <Text variant="subhead" style={styles.failure}>
          {failure.status === 'too_far'
            ? `You're ${Math.round(failure.distanceMeters)}m away`
            : FAILURE_MESSAGES[failure.status]}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  failure: {
    marginTop: spacing.sm,
  },
});
