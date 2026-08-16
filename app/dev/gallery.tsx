import { useState } from 'react';
import { ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { Carousel } from '@/components/Carousel';
import { Divider } from '@/components/Divider';
import { FigureCard, FIGURE_CARD_WIDTH } from '@/components/FigureCard';
import { Icon } from '@/components/Icon';
import PlaceholderIcon from '@/components/icons/placeholder.svg';
import { LinkRow } from '@/components/LinkRow';
import { LogoBlock } from '@/components/LogoBlock';
import { MapCallout } from '@/components/MapCallout';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ParkCard, PARK_CARD_WIDTH } from '@/components/ParkCard';
import { PassportSummary } from '@/components/PassportSummary';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { Section } from '@/components/Section';
import { Text } from '@/components/Text';
import { palette } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';
import type { TypographyVariant } from '@/design/typography';

const secondaryColors = ['sky', 'pear'] as const;

const parks = [
  { id: 'p1', name: 'Kiest Park', neighborhood: 'Oak Cliff', photo: require('../../assets/park-1.jpg') },
  { id: 'p2', name: 'Reverchon Park', neighborhood: 'Uptown', photo: require('../../assets/park-2.jpg') },
  { id: 'p3', name: 'Fair Park', neighborhood: 'South Dallas', photo: require('../../assets/park-3.jpg') },
];

const figures = [
  { id: 'f1', name: 'Name Here', era: 'Era Goes Here' },
  { id: 'f2', name: 'Name Here', era: 'Era Goes Here' },
  { id: 'f3', name: 'Name Here', era: 'Era Goes Here' },
];

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
  const [isPlaying, setIsPlaying] = useState(true);
  const [playerProgress, setPlayerProgress] = useState(0.5);
  const [searchValue, setSearchValue] = useState('');

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

          <Section title="SearchBar">
            <SearchBar value={searchValue} onChangeText={setSearchValue} />
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

          <Section title="Button — icon">
            <View style={styles.iconRow}>
              <Button label="Share" onPress={() => {}} variant="icon" icon="share-outline" />
              <Button
                label="Share"
                onPress={() => {}}
                variant="icon"
                icon="share-outline"
                size="small"
              />
            </View>
          </Section>

          <Section title="Icon">
            <View style={styles.iconRow}>
              <Icon icon={PlaceholderIcon} />
              <Icon icon={PlaceholderIcon} size={32} color={palette.pear} />
            </View>
          </Section>

          <Section title="MiniPlayer">
            <MiniPlayer
              title="Kiest Park History"
              coverImage={require('../../assets/park-1.jpg')}
              elapsedLabel="10:20"
              progress={playerProgress}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((current) => !current)}
              onExpand={() => {}}
              onSeek={setPlayerProgress}
            />
          </Section>

          <Section title="Discover Parks">
            <Carousel
              data={parks}
              keyExtractor={(park) => park.id}
              itemWidth={PARK_CARD_WIDTH}
              renderItem={(park) => (
                <ParkCard
                  name={park.name}
                  neighborhood={park.neighborhood}
                  photo={park.photo}
                  onPress={() => {}}
                />
              )}
            />
          </Section>

          <Section title="Discover Historic Figures">
            <Carousel
              data={figures}
              keyExtractor={(figure) => figure.id}
              itemWidth={FIGURE_CARD_WIDTH}
              renderItem={(figure) => (
                <FigureCard name={figure.name} era={figure.era} onPress={() => {}} />
              )}
            />
          </Section>

          <Section title="MapCallout">
            <MapCallout
              title="Fair Park"
              subtitle="3809 Grand Ave, Dallas TX"
              photo={require('../../assets/park-3.jpg')}
              onLearnMore={() => {}}
              onClose={() => {}}
            />
          </Section>

          <Section title="PassportSummary">
            <ImageBackground
              source={require('../../assets/city-1.jpg')}
              style={styles.passportBackground}
              imageStyle={styles.passportBackgroundImage}
            >
              <PassportSummary collected={1} total={25} />
            </ImageBackground>
          </Section>

          <Section title="Divider">
            <Text>Above the divider</Text>
            <Divider />
            <Text>Below the divider</Text>
          </Section>

          <Section title="LogoBlock">
            <View style={styles.tightList}>
              <LogoBlock />
              <LogoBlock variant="anniversary" />
            </View>
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
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  passportBackground: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passportBackgroundImage: {
    borderRadius: radii.md,
  },
});
