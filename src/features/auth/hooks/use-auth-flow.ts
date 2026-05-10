import { useCallback, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useAuthStore } from '../stores/auth-store';
import { reposService } from '@core/api/github/services/repos';
import { logger } from '@core/logger/logger';

WebBrowser.maybeCompleteAuthSession();

const GITHUB_CLIENT_ID = process.env['EXPO_PUBLIC_GITHUB_CLIENT_ID'] ?? '';
const TOKEN_ENDPOINT = process.env['EXPO_PUBLIC_TOKEN_ENDPOINT'] ?? '';

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
};

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export function useAuthFlow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  // In Expo Go, Linking.createURL ignores the scheme and returns exp://...
  // which GitHub's OAuth doesn't accept. Pass `native` so that bare/standalone
  // builds (dev build, EAS) always use the registered app scheme.
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'visieditor',
    native: 'visieditor://',
  });

  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['repo', 'read:user'],
      redirectUri,
      usePKCE: false, // GitHub OAuth Apps do not support PKCE
    },
    discovery,
  );

  const handleCode = useCallback(
    async (code: string) => {
      setLoading(true);
      try {
        if (!TOKEN_ENDPOINT) {
          throw new Error(
            'EXPO_PUBLIC_TOKEN_ENDPOINT não configurado. Adicione ao .env.',
          );
        }

        const res = await fetch(TOKEN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirect_uri: redirectUri }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error_description?: string }).error_description ??
              `Token exchange falhou (${res.status})`,
          );
        }

        const { access_token } = (await res.json()) as { access_token: string };
        setToken(access_token);
        const user = await reposService.getCurrentUser();
        setUser(user);
      } catch (e) {
        setError((e as Error).message);
        logger.error('Auth flow failed', e);
      } finally {
        setLoading(false);
      }
    },
    [redirectUri, setToken, setUser],
  );

  const signIn = useCallback(async () => {
    if (!GITHUB_CLIENT_ID) {
      setError(
        'GitHub Client ID não configurado. Defina EXPO_PUBLIC_GITHUB_CLIENT_ID no .env.',
      );
      return;
    }

    if (isExpoGo) {
      setError(
        'Login com GitHub não funciona no Expo Go porque o redirect URI ' +
          '(exp://...) não pode ser registrado no GitHub OAuth App. ' +
          'Use um dev build: npx expo run:android ou npx expo run:ios.',
      );
      return;
    }

    logger.info('OAuth redirect URI:', redirectUri);
    setError(null);

    const result = await promptAsync();
    if (result.type === 'success' && result.params['code']) {
      await handleCode(result.params['code']);
    } else if (result.type === 'error') {
      setError(result.error?.message ?? 'OAuth falhou');
    }
  }, [promptAsync, handleCode, redirectUri]);

  return { signIn, loading, error, request };
}
