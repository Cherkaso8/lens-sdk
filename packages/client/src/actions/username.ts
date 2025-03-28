import type {
  AssignUsernameToAccountRequest,
  AssignUsernameToAccountResult,
  CreateUsernameRequest,
  CreateUsernameResult,
  Paginated,
  UnassignUsernameFromAccountRequest,
  UnassignUsernameToAccountResult,
  Username,
  UsernameRequest,
  UsernamesRequest,
} from '@lens-protocol/graphql';
import {
  AssignUsernameToAccountMutation,
  CreateUsernameMutation,
  UnassignUsernameFromAccountMutation,
  UsernameQuery,
  UsernamesQuery,
} from '@lens-protocol/graphql';
import type { ResultAsync } from '@lens-protocol/types';

import type { SessionClient } from '../clients';
import type { UnauthenticatedError, UnexpectedError } from '../errors';

import type { AnyClient } from '../clients';

/**
 * Create a username
 *
 * ```ts
 * const result = await createUsername(sessionClient, {
 *   username: {
 *    localName: 'wagmi'
 *   }
 * });
 * ```
 *
 * @param client - The session client for the authenticated Account.
 * @param request - The mutation request.
 * @returns Tiered transaction result.
 */
export function createUsername(
  client: SessionClient,
  request: CreateUsernameRequest,
): ResultAsync<CreateUsernameResult, UnexpectedError | UnauthenticatedError> {
  return client.mutation(CreateUsernameMutation, { request });
}

/**
 * Assign a username to the account associated with the authenticated session.
 *
 * ```ts
 * const result = await assignUsernameToAccount(sessionClient, {
 *   username: {
 *    localName: 'wagmi'
 *   }
 * });
 * ```
 *
 * @param client - The session client for the authenticated Account.
 * @param request - The mutation request.
 * @returns Tiered transaction result.
 */
export function assignUsernameToAccount(
  client: SessionClient,
  request: AssignUsernameToAccountRequest,
): ResultAsync<AssignUsernameToAccountResult, UnauthenticatedError | UnexpectedError> {
  return client.mutation(AssignUsernameToAccountMutation, { request });
}

/**
 * Unassign a username to the account associated with the authenticated session.
 *
 * ```ts
 * const result = await unassignUsernameFromAccount(sessionClient, {
 *   username: {
 *    localName: 'wagmi'
 *   }
 * });
 * ```
 *
 * @param client - The session client for the authenticated Account.
 * @param request - The mutation request.
 * @returns Tiered transaction result.
 */
export function unassignUsernameFromAccount(
  client: SessionClient,
  request: UnassignUsernameFromAccountRequest,
): ResultAsync<UnassignUsernameToAccountResult, UnauthenticatedError | UnexpectedError> {
  return client.query(UnassignUsernameFromAccountMutation, { request });
}

/**
 * Fetch username details.
 *
 * ```ts
 * const result = await fetchUsername(anyClient, {
 *   username: { localName: 'wagmi' },
 * });
 * ```
 *
 * @param client - Any Lens client.
 * @param request - The query request.
 * @returns The username details.
 */
export function fetchUsername(
  client: AnyClient,
  request: UsernameRequest,
): ResultAsync<Username | null, UnexpectedError> {
  return client.query(UsernameQuery, { request });
}

/**
 * Fetch usernames owned by an address.
 *
 * ```ts
 * const result = await fetchUsernames(anyClient, {
 *   owner: evmAddress('0xe2f2a5C287993345a840db3B0845fbc70f5935a5'),
 * });
 * ```
 *
 * @param client - Any Lens client.
 * @param request - The query request.
 * @returns The list of owned usernames.
 */
export function fetchUsernames(
  client: AnyClient,
  request: UsernamesRequest,
): ResultAsync<Paginated<Username> | null, UnexpectedError> {
  return client.query(UsernamesQuery, { request });
}
