import { useCallback, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../stores/auth-store';
import { reposService } from '@core/api/github/services/repos';
import { secureStore } from '@core/storage/secure-store';
import { logger } from '@core/logger/logger';

WebBrowser.maybeCompleteAuthSession();

const GITHUB_CLIENT_ID = process.env['EXPO_PUBLIC_GITHUB_CLIENT_ID'] ?? '';

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
};

export function useAuthFlow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const redirectUri = AuthSession.makeRedirectUri({ scheme: 'visieditor' });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['repo', 'read:user'],
      redirectUri,
    },
    discovery,
  );

  const handleCode = useCallback(async (code: string) => {
    setLoading(true);
    try {
      // Device flow: exchange code for token via your backend
      // For PKCE without backend, you need a proxy server
      // This is a placeholder for the actual token exchange
      logger.info('Auth code received, exchanging for token...');

      // In production, call your token exchange endpoint
      // For development, you can use a proxy like https://github.com/nicedoc/github-oauth-proxy
      const tokenEndpoint = process.env['EXPO_PUBLIC_TOKEN_ENDPOINT'];
      if (!tokenEndpoint) {
        throw new Error('Token exchange endpoint not configured. Set EXPO_PUBLIC_TOKEN_ENDPOINT.');
      }

      const res = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      });

      if (!res.ok) throw new Error('Token exchange failed');
      const { access_token } = await res.json() as { access_token: string };

      setToken(access_token);
      const user = await reposService.getCurrentUser();
      setUser(user);
    } catch (e) {
      setError((e as Error).message);
      logger.error('Auth flow failed', e);
    } finally {
      setLoading(false);
    }
  }, [redirectUri, setToken, setUser]);

  const signIn = useCallback(async () => {
    setError(null);
    const result = await promptAsync();
    if (result.type === 'success' && result.params['code']) {
      await handleCode(result.params['code']);
    } else if (result.type === 'error') {
      setError(result.error?.message ?? 'OAuth failed');
    }
  }, [promptAsync, handleCode]);

  return { signIn, loading, error, request };
}
