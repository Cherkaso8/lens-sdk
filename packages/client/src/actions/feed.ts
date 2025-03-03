import type {
  CreateFeedRequest,
  CreateFeedResult,
  Feed,
  FeedRequest,
  FeedsRequest,
  Paginated,
} from '@lens-protocol/graphql';
import { CreateFeedMutation, FeedQuery, FeedsQuery } from '@lens-protocol/graphql';
import type { ResultAsync } from '@lens-protocol/types';

import type { AnyClient, SessionClient } from '../clients';
import type { UnauthenticatedError, UnexpectedError } from '../errors';

/**
 * Create a Feed
 *
 * ```ts
 * const result = await createFeed(sessionClient);
 * ```
 *
 * @param client - The session client logged as a builder.
 * @param request - The mutation request.
 * @returns Tiered transaction result.
 */
export function createFeed(
  client: SessionClient,
  request: CreateFeedRequest,
): ResultAsync<CreateFeedResult, UnexpectedError | UnauthenticatedError> {
  return client.mutation(CreateFeedMutation, { request });
}

/**
 * Fetch a Feed.
 *
 * ```ts
 * const result = await fetchFeed(anyClient, {
 *   feed: evmAddress('0xe2f2a5C287993345a840db3B0845fbc70f5935a5'),
 * });
 * ```
 *
 * @param client - Any Lens client.
 * @param request - The Feed query request.
 * @returns The Feed or `null` if it does not exist.
 */
export function fetchFeed(
  client: AnyClient,
  request: FeedRequest,
): ResultAsync<Feed | null, UnexpectedError> {
  return client.query(FeedQuery, { request });
}

/**
 * Fetch Feeds.
 *
 * ```ts
 * const result = await fetchFeeds(anyClient, {
 *   filter: {
 *     managedBy: {
 *       address: evmAddress('0xe2f2a5C287993345a840db3B0845fbc70f5935a5')
 *     }
 *   },
 * });
 * ```
 *
 * @param client - Any Lens client.
 * @param request - The Feeds query request.
 * @returns The list of Feeds or empty list if none exist.
 */
export function fetchFeeds(
  client: AnyClient,
  request: FeedsRequest,
): ResultAsync<Paginated<Feed> | null, UnexpectedError> {
  return client.query(FeedsQuery, { request });
}
