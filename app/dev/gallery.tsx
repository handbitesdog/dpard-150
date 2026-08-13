import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { LinkRow } from '@/components/LinkRow';
import { Screen } from '@/components/Screen';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { spacing } from '@/design/spacing';
import type { TypographyVariant } from '@/design/typography';

const secondaryColors = ['sky', 'pear'] as const;

const typographyVariants: TypographyVariant[] = [
  'display',
  'title1',
  'title2',
  'headline',
  'body',
  'subhead',
  'footnote',
  'caption',
];

export default function ComponentGallery() {
  const [loading, setLoading] = useState(false);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Component gallery' }} />
      <Screen>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Section title="Text">
            <View style={styles.tightList}>
              {typographyVariants.map((variant) => (
                <Text key={variant} variant={variant}>
                  {variant}
                </Text>
              ))}
            </View>
          </Section>

          <Section title="Button — primary">
            <Button label="Directions" onPress={() => {}} icon="navigate-outline" />
            <Button label="Click to load" onPress={handleLoad} loading={loading} />
            <Button label="Directions" onPress={() => {}} disabled />
          </Section>

          <Section title="Button — secondary">
            {secondaryColors.map((color) => (
              <Button
                key={color}
                label="Learn more"
                onPress={() => {}}
                variant="secondary"
                color={color}
              />
            ))}
          </Section>

          <Section title="Button — small">
            <Button
              label="Learn more"
              onPress={() => {}}
              variant="secondary"
              color="sky"
              size="small"
            />
          </Section>

          <Section title="Button — inline">
            <Button
              label="Check in"
              onPress={() => {}}
              variant="secondary"
              color="pear"
              fullWidth={false}
            />
          </Section>

          <Section title="Divider">
            <Text>Above the divider</Text>
            <Divider />
            <Text>Below the divider</Text>
          </Section>

          <Section title="LinkRow" onSeeAllPress={() => {}}>
            <View style={styles.tightList}>
              <LinkRow icon="call-outline" label="123-456-7890" onPress={() => {}} />
              <LinkRow icon="globe-outline" label="dallasparks.org/" onPress={() => {}} />
              <LinkRow
                icon="location-outline"
                label="123 Sesame Street, Dallas TX 12345"
                onPress={() => {}}
              />
            </View>
          </Section>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  tightList: {
    gap: spacing.xs,
  },
});
