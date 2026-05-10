import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';
import { secureStore } from '@core/storage/secure-store';
import { AuthRequiredError } from './errors';

export type GithubClient = {
  rest: Octokit;
  gql: typeof graphql;
};

let _client: GithubClient | null = null;

export async function makeGithubClient(): Promise<GithubClient> {
  const token = await secureStore.get('github_token');
  if (!token) throw new AuthRequiredError();

  _client = {
    rest: new Octokit({ auth: token, userAgent: 'VisiEditor/1.0' }),
    gql: graphql.defaults({ headers: { authorization: `bearer ${token}` } }),
  };

  return _client;
}

export function invalidateClient(): void {
  _client = null;
}

export async function getClient(): Promise<GithubClient> {
  if (_client) return _client;
  return makeGithubClient();
}
