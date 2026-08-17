import { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { Button } from '@/components/Button';
import { Carousel } from '@/components/Carousel';
import { Divider } from '@/components/Divider';
import { FigureCard, FIGURE_CARD_WIDTH } from '@/components/FigureCard';
import { Icon } from '@/components/Icon';
import PlaceholderIcon from '@/components/icons/placeholder.svg';
import { LinkImage } from '@/components/LinkImage';
import { LinkRow } from '@/components/LinkRow';
import { LogoBlock } from '@/components/LogoBlock';
import { MapCallout } from '@/components/MapCallout';
import { MiniPlayer } from '@/components/MiniPlayer';
import { ParkCard, PARK_CARD_WIDTH } from '@/components/ParkCard';
import { PassportSummary } from '@/components/PassportSummary';
import { PhotoHeader } from '@/components/PhotoHeader';
import { PostGrid } from '@/components/PostGrid';
import type { Post } from '@/components/PostGrid';
import { Screen } from '@/components/Screen';
import { SearchBar } from '@/components/SearchBar';
import { Section } from '@/components/Section';
import { Stamp } from '@/components/Stamp';
import { StampAddedCard } from '@/components/StampAddedCard';
import { StampGrid } from '@/components/StampGrid';
import { Text } from '@/components/Text';
import { VideoCard, VIDEO_CARD_WIDTH } from '@/components/VideoCard';
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

const stamps = [
  { id: 's1', name: 'Fair Park', collected: true },
  { id: 's2', name: 'Reverchon Park', collected: false },
  { id: 's3', name: 'Klyde Warren Park', collected: false },
  { id: 's4', name: 'Moore Park', collected: false },
];

const posts: Post[] = Array.from({ length: 9 }, (_, i) => ({
  id: `post-${i}`,
  permalink: 'https://www.instagram.com/',
}));

const videos = [
  { id: 'v1', title: 'Kiest Park History', thumbnail: require('../../assets/park-1.jpg'), permalink: 'https://www.instagram.com/' },
  { id: 'v2', title: 'Reverchon Park Walk', thumbnail: require('../../assets/park-2.jpg'), permalink: 'https://www.instagram.com/' },
  { id: 'v3', title: 'Fair Park Legacy', thumbnail: require('../../assets/park-3.jpg'), permalink: 'https://www.instagram.com/' },
];

const tracks = [
  { id: 't1', title: 'Kiest Park History', coverImage: require('../../assets/park-1.jpg'), duration: '10:20' },
  { id: 't2', title: 'Reverchon Park Walk', coverImage: require('../../assets/park-2.jpg'), duration: '8:45' },
  { id: 't3', title: 'Fair Park Legacy', coverImage: require('../../assets/park-3.jpg'), duration: '14:02' },
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
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedTrackId, setDownloadedTrackId] = useState<string | null>(null);
  const [downloadingTrackId, setDownloadingTrackId] = useState<string | null>(null);

  const handleLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const handleToggleDownload = () => {
    if (isDownloaded) {
      setIsDownloaded(false);
      return;
    }
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
    }, 2000);
  };

  const handleToggleTrackDownload = (trackId: string) => {
    if (downloadedTrackId === trackId) {
      setDownloadedTrackId(null);
      return;
    }
    setDownloadingTrackId(trackId);
    setTimeout(() => {
      setDownloadingTrackId(null);
      setDownloadedTrackId(trackId);
    }, 2000);
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Component gallery' }} />
      <Screen scroll>
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

        <Section title="MiniPlayer — Bar">
          <MiniPlayer
            title="Kiest Park History"
            coverImage={require('../../assets/park-1.jpg')}
            elapsedLabel="10:20"
            progress={playerProgress}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((current) => !current)}
            isDownloaded={isDownloaded}
            isDownloading={isDownloading}
            onToggleDownload={handleToggleDownload}
            onPress={() => {}}
            onSeek={setPlayerProgress}
          />
        </Section>

        <Section title="MiniPlayer — List">
          <View style={styles.trackList}>
            {tracks.map((track) => (
              <MiniPlayer
                key={track.id}
                variant="row"
                title={track.title}
                coverImage={track.coverImage}
                elapsedLabel={track.duration}
                progress={0}
                isPlaying={playingTrackId === track.id}
                onTogglePlay={() =>
                  setPlayingTrackId((current) => (current === track.id ? null : track.id))
                }
                isDownloaded={downloadedTrackId === track.id}
                isDownloading={downloadingTrackId === track.id}
                onToggleDownload={() => handleToggleTrackDownload(track.id)}
                onPress={() => setPlayingTrackId(track.id)}
              />
            ))}
          </View>
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

        <Section title="PhotoHeader">
          <View style={styles.fullBleed}>
            <PhotoHeader
              photo={require('../../assets/park-3.jpg')}
              onBack={() => {}}
              onShare={() => {}}
              height={220}
            />
          </View>
        </Section>

        <Section title="PostGrid">
          <PostGrid posts={posts} />
        </Section>

        <Section title="Discover Videos">
          <Carousel
            data={videos}
            keyExtractor={(video) => video.id}
            itemWidth={VIDEO_CARD_WIDTH}
            renderItem={(video) => (
              <VideoCard title={video.title} thumbnail={video.thumbnail} permalink={video.permalink} />
            )}
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

        <Section title="Stamp">
          <StampGrid
            data={stamps}
            keyExtractor={(stamp) => stamp.id}
            renderItem={(stamp, size) => (
              <Stamp
                name={stamp.name}
                image={require('../../assets/stamps/fair-park-stamp.png')}
                grayImage={require('../../assets/stamps/fair-park-stamp-gray.png')}
                collected={stamp.collected}
                size={size}
              />
            )}
          />
        </Section>

        <Section title="StampAddedCard">
          <View style={styles.fullBleed}>
            <StampAddedCard name="Fair Park" image={require('../../assets/stamps/fair-park-stamp.png')} />
          </View>
        </Section>

        <Section title="Divider">
          <Text>Above the divider</Text>
          <Divider />
          <Text>Below the divider</Text>
        </Section>

        <Section title="LogoBlock">
          <View style={styles.tightList}>
            <LogoBlock leftLogo="inline" />
            <LogoBlock variant="anniversary" />
            <LogoBlock variant="anniversary" leftLogo="dark" />
          </View>
        </Section>

        <Section title="LinkImage">
          <LinkImage
            source={require('../../assets/park-4.jpg')}
            url="https://dallasparks.org/store"
            width={160}
            height={160}
            accessibilityLabel="Shop the Dallas Park store"
          />
        </Section>

        <Section title="LinkRow">
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
  trackList: {
    gap: spacing.sm,
  },
  fullBleed: {
    marginHorizontal: -spacing.base,
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
