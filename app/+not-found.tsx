import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@ui/Text';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#282A36' }}>
        <Text variant="title">Page not found</Text>
        <Link href="/">
          <Text variant="body" tone="primary" style={{ marginTop: 16 }}>Go home</Text>
        </Link>
      </View>
    </>
  );
}
