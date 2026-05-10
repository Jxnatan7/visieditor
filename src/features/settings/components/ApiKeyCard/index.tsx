import { ApiKeyCard as Root } from './ApiKeyCard';
import { ApiKeyCardInput } from './ApiKeyCard.Input';
import { ApiKeyCardTestButton } from './ApiKeyCard.TestButton';
import { ApiKeyCardStatus } from './ApiKeyCard.Status';

export const ApiKeyCard = Object.assign(Root, {
  Input: ApiKeyCardInput,
  TestButton: ApiKeyCardTestButton,
  Status: ApiKeyCardStatus,
});
