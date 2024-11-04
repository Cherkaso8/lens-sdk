import { local } from '@lens-social/env';
import { url, assertErr, assertOk, evmAddress, signatureFrom } from '@lens-social/types';

import { privateKeyToAccount } from 'viem/accounts';
import { describe, expect, it } from 'vitest';

import { HealthQuery } from '@lens-social/graphql';
import { currentSession } from './actions';
import { PublicClient } from './clients';
import { UnexpectedError } from './errors';

const signer = privateKeyToAccount(import.meta.env.PRIVATE_KEY);
const account = evmAddress(signer.address);
const app = evmAddress('0x90c8c68d0Abfb40D4fCD72316A65e42161520BC3');

describe(`Given an instance of the ${PublicClient.name}`, () => {
  const client = PublicClient.create({
    environment: local,
    origin: 'http://example.com',
  });

  describe('When authenticating via the low-level methods', () => {
    it('Then it should authenticate and stay authenticated', async () => {
      const challenge = await client.challenge({
        request: {
          account,
          signedBy: account,
          app,
        },
      });
      assertOk(challenge);

      const authenticated = await client.authenticate({
        request: {
          id: challenge.value.id,
          signature: signatureFrom(await signer.signMessage({ message: challenge.value.text })),
        },
      });

      assertOk(authenticated);

      const principal = await authenticated.value.getPrincipal();
      assertOk(principal);
      expect(principal.value).toMatchObject({
        account: account.toLowerCase(),
        signer: account.toLowerCase(),
      });
    });
  });

  describe('When authenticating via the `login` convenience method', () => {
    it('Then it should return an Err<never, SigningError> with any error thrown by the provided `SignMessage` function', async () => {
      const authenticated = await client.login({
        request: {
          account,
          signedBy: account,
          app,
        },
        signMessage: async () => {
          throw new Error('Test Error');
        },
      });

      assertErr(authenticated);
    });
  });

  describe('When resuming an authenticated session', () => {
    it('Then it should return a SessionClient instance associated with the credentials in the storage', async () => {
      await client.login({
        request: {
          account,
          signedBy: account,
          app,
        },
        signMessage: (message) => signer.signMessage({ message }),
      });

      const authenticated = await client.resumeSession();
      assertOk(authenticated);

      const authentication = await currentSession(authenticated.value);
      expect(authentication._unsafeUnwrap()).toMatchObject({
        signer: account,
        app,
      });
    });
  });

  describe('When receiving a Network error', () => {
    const client = PublicClient.create({
      environment: {
        backend: url('http://127.0.0.1'),
        name: 'broken',
      },
      origin: 'http://example.com',
    });

    it(`Then it should return an ${UnexpectedError.name}`, async () => {
      const result = await client.query(HealthQuery, {});
      assertErr(result);
      expect(result.error).toBeInstanceOf(UnexpectedError);
    });
  });
});
