import React, { useState } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@core/design-system/theme-provider';
import { Text } from '@ui/Text';
import { Button } from '@ui/Button';
import { Pressable } from '@ui/Pressable';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Code Anywhere',
    description: 'Edit your GitHub repositories directly from your phone with a full-featured code editor.',
    emoji: '💻',
  },
  {
    title: 'AI-Powered',
    description: 'Use Claude, Gemini, or any AI to explain, refactor, and improve your code on the go.',
    emoji: '✦',
  },
  {
    title: 'Git Workflow',
    description: 'Commit, push, create branches and pull requests — the full git workflow in your pocket.',
    emoji: '🔀',
  },
  {
    title: 'Your Keys, Your Data',
    description: 'API keys are stored securely on your device. No server, no tracking, complete privacy.',
    emoji: '🔒',
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { colors, spacing } = useTheme();

  const isLast = currentSlide === SLIDES.length - 1;
  const slide = SLIDES[currentSlide]!;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg.base }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[8] }}>
        <Text style={{ fontSize: 80, marginBottom: spacing[8] }}>{slide.emoji}</Text>
        <Text variant="display" style={{ textAlign: 'center', marginBottom: spacing[4] }}>
          {slide.title}
        </Text>
        <Text variant="body" tone="secondary" style={{ textAlign: 'center', marginBottom: spacing[12] }}>
          {slide.description}
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing[2], marginBottom: spacing[8] }}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => setCurrentSlide(i)}>
              <View style={{
                width: i === currentSlide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentSlide ? colors.accent.primary : colors.border.subtle,
              }} />
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: spacing[3], alignSelf: 'stretch' }}>
          {!isLast ? (
            <>
              <Button label="Skip" onPress={() => router.push('/(auth)/sign-in')} variant="ghost" />
              <Button label="Next" onPress={() => setCurrentSlide((c) => c + 1)} variant="primary" fullWidth />
            </>
          ) : (
            <Button label="Get Started" onPress={() => router.push('/(auth)/sign-in')} variant="primary" fullWidth />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
